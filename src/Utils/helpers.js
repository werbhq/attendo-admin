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

/**
 * Sorter for getList data
 * @param {Object} params
 * @param {Array} data
 */
export const sorter = (params, data) => {
  const sort = params?.sort;

  if (sort) {
    const field = sort.field;

    data = data.sort((a, b) => {
      if (typeof a[field] === "string") {
        if (sort.order === "DESC") return b[field].localeCompare(a[field]);
        return a[field].localeCompare(b[field]);
      } else if (typeof a[field] === "number") {
        if (sort.order === "DESC") return b[field] - a[field];
        return a[field] - b[field];
      }
      return a - b;
    });
  }

  return data;
};
