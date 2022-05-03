require('dotenv').config();
const fs = require('fs').promises;
const { google } = require('googleapis');

const cookieHandler = require('../../util/cookieHandler');
const devopersList = require('../developers.json');
const puppeterHandler = require('../../util/puppeterHandler');
const mailHandler = require('../../util/mailHandler');
const firebaseRealtime = require('../../firebase/firestore');

/**
 * @typedef {import('../models/gclassrooms').GoogleClassroom} GoogleClassroom
 * @typedef {import('../models/functionSpecific/extract_meet_id').classData} classData
 * */

// Authorization
let credentials;
let auth;
const authorizeSync = async () => {
    if (credentials === undefined) {
        credentials = JSON.parse(await fs.readFile('credentials.json'));
    }
    const { client_secret, client_id, redirect_uris } = credentials.web; // eslint-disable-line camelcase
    // eslint-disable-next-line camelcase
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[parseInt(process.env.SELECTED_URL, 10)]);
    oAuth2Client.setCredentials(await firebaseRealtime.getToken());
    return oAuth2Client;
};

async function closeBrowser(page, browser) {
    page.removeAllListeners('request');
    await page._client.send('Page.stopLoading');
    await page.close();
    await browser.disconnect();
}

/**
 * Returns the classroom list with their Meet Links attached as meetID attribute
 * @param {GoogleClassroom} courseList
 * @returns {Promise<{courseList:GoogleClassroom;errorOccured:boolean; errorLog:string[]}>}
 */
exports.extractMeetID = async (courseList) => {
    const browser = await puppeterHandler.getBrowser();

    /** @type  {classData[]} */
    let classData;

    if (auth === undefined) {
        auth = await authorizeSync();
    }
    const page = await browser.newPage();
    // await page.setViewport({ width: 400, height: 300 })

    // Disable CSS,fonts and Images and Media
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (
            req.resourceType() === 'stylesheet' ||
            req.resourceType() === 'font' ||
            req.resourceType() === 'image' ||
            req.resourceType() === 'media'
        ) {
            req.abort();
        } else {
            req.continue();
        }
    });

    // Checking cookies
    const cookies = await cookieHandler.cookieCheck();
    await page.setCookie(...cookies);

    const idMeetLookUpElement = 'a.tnRfhc.etFl5b';
    const classroom = google.classroom({ version: 'v1', auth });

    let errorOccured = false;
    const errorLog = [];
    errorLog.push(`Email ID: ${courseList.teacher.email}`);

    try {
        console.log(`Extracting Meet IDs For : ${courseList.teacher.email}`);
        // Joining classes and determining whether to leave or not
        if (devopersList.emails.find((email) => email === courseList.teacher.email)) {
            // Developer Mode
            console.warn(`${courseList.teacher.email}: Developer detected in extractMeetID()`);
            classData = courseList.googleClassrooms.map((Class) => ({ class: Class, toLeave: false }));
        } else {
            // Teacher Mode
            classData = courseList.googleClassrooms.map((Class) => {
                console.log(`${courseList.teacher.email} :Joining Class : ${Class.title}`);
                return new Promise((resolve) => {
                    classroom.courses.students
                        .create({
                            courseId: Class.id,
                            enrollmentCode: Class.code,
                            resource: { userId: 'me' },
                        })
                        .then(
                            (res) => {
                                if (res.status === 200) resolve({ class: Class, toLeave: true });
                            },
                            (err) => {
                                if (err.code === 409) {
                                    resolve({ class: Class, toLeave: false });
                                    console.log(`${courseList.teacher.email} :Marking Class : ${Class.title} not to leave`);
                                } else {
                                    resolve({ class: Class, toLeave: false });
                                    console.error(`${courseList.teacher.email} :${Class.title} Return Error Message :${err.message}`);
                                    console.error(`${courseList.teacher.email} :${Class.title} Return Error Code :${err.code}  `);

                                    errorLog.push(`${Class.title} Return Error Message :${err.message}`);
                                    errorOccured = true;
                                }
                            }
                        );
                });
            });

            await Promise.all(classData);
        }

        // Exiting Classes
        const classLeft = classData.map((item) => {
            if (item.toLeave === true) {
                console.log(`${courseList.teacher.email} :Leaving Class : ${item.class.title}`);
                return new Promise((resolve) => {
                    classroom.courses.students
                        .delete({
                            courseId: item.class.id,
                            userId: 'me',
                        })
                        .then(
                            // eslint-disable-next-line no-unused-vars
                            (res) => {
                                resolve(item);
                            },
                            (err) => {
                                console.error(`${courseList.teacher.email} :Leaving Class : ${item.class.title} Error: ${err}`);
                                errorLog.push(`Leaving Class: ${item.class.title} Return Error Message : ${err}`);
                            }
                        );
                });
            }
            return undefined;
        });
        await Promise.all(classLeft);

        // Fetching Link
        for (let i = 0; i < classData.length; i++) {
            const item = classData[i];
            try {
                await page.goto(item.class.link);
                console.log(`${courseList.teacher.email} :Fetching Meet ID Of Class: ${item.class.title}`);
                await page.waitForSelector(idMeetLookUpElement, { visible: true, timeout: 7000 });
                const MeetLookUpID = (await page.$eval(idMeetLookUpElement, (e) => e.getAttribute('href')))
                    .replace('https://meet.google.com/lookup/', '')
                    .replace(/\?authuser.*/g, '');
                item.class['meetLookup'] = MeetLookUpID;
            } catch (e) {
                console.log(`${courseList.teacher.email} :Meet ID Of Class: ${item.class.title} Not Found`);
            }
        }

        courseList.googleClassrooms.map((obj) => classData.find((o) => o.class.id === obj.id) || obj);
        console.log(`${courseList.teacher.email} :Done`);

        if (errorOccured) throw Error('error-occured-in-api');
    } catch (e) {
        if (e.message !== 'error-occured-in-api') {
            console.error(`${courseList.teacher.email} :Non Api Error Message :${e.message}`);
            errorLog.push(`Non Api Error Message :${e.message}`);
        }
        errorOccured = true;
    }
    closeBrowser(page, browser);
    if (errorOccured) mailHandler.sendMail('Error: extract_meet_id', errorLog);
    return { courseList, errorOccured, errorLog };
};

// ------------------------------Testing----------------------------------------------------------------------------
// ; (async () => {
//     const sampleData = require('../data/test/import_dsc_gclassroom.json'); //data after gclassroom import
//     const courseList = await this.extractMeetID(sampleData)
//     console.log(JSON.stringify(courseList, null, 2));
// })()
// ------------------------------Testing-----------------------------------------------------------------------------
