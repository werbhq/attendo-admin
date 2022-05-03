export const sortByRoll = (a, b) => a.rollNo - b.rollNo;

export const autoCapitalize = (value) => value && value.toUpperCase();

export const convertSingleValueListToSelectList = (value) => {
  return { id: value, name: value.toUpperCase() };
};

export const getClassroomId = (data) => {
  const dataIdSet = [data.course, data.year, data.branch, data.name];
  if (data.isDerived) dataIdSet.push(data.subjectId);
  return dataIdSet.join("-").toUpperCase();
};
