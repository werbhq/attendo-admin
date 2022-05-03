import { useList, ListContextProvider, useRecordContext } from "react-admin";

/**
 * CustomArrayList
 * Use it for data having arrays
 */
const CustomArrayList = ({ fieldName, resource, children }) => {
  const record = useRecordContext();
  return (
    <ListContextProvider value={useList({ data: record[fieldName], resource })}>
      {children}
    </ListContextProvider>
  );
};

export default CustomArrayList;
