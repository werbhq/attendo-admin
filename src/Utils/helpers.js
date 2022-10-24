export const sortByRoll = (a, b) => {
  if (a?.classId !== b?.classId) return a?.classId?.localeCompare(b?.classId);
  return a.rollNo - b.rollNo;
};

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
  const filters = params?.filter;

  if (filters && filters["subjectName"]) {
    console.log(data);
  }

  if (sort) {
    const field = sort.field;

    if (Array.isArray(data)) {
      data = data.sort((a, b) => {
        if (typeof a[field] === "string") {
          if (sort.order === "DESC") return b[field]?.localeCompare(a[field]);
          return a[field]?.localeCompare(b[field]);
        } else if (typeof a[field] === "number") {
          if (sort.order === "DESC") return b[field] - a[field];
          return a[field] - b[field];
        }
        return a - b;
      });
    }
  }

  if (filters && Object.entries(filters).length) {
    Object.entries(filters).forEach(([e_field, value]) => {
      data = data.filter((e) => {
        if (typeof e[e_field] === "string" || typeof e[e_field] === "number") {
          return `${e[e_field]}`.toUpperCase().includes(value.toUpperCase());
        } else if (Array.isArray(e[e_field])) {
          return e[e_field].includes(value);
        } else {
          return true;
        }
      });
    });
  }

  return data;
};
