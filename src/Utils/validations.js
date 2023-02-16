export const noSpaceValidation = (value) => {
  if (value.includes(" ")) return "No Space Allowed";
  else return undefined;
};
