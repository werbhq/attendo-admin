export const noSpaceValidation = (value: string) => {
    if (value.includes(' ')) return 'No Space Allowed';
    else return undefined;
};
