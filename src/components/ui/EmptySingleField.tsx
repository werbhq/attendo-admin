import { Typography } from '@mui/material';
import { useRecordContext } from 'react-admin';

// Single Field List Does not support empty Text
const EmptySingleDisplay = ({ fieldName }: { fieldName: string }) => {
    const record = useRecordContext();
    if (record[fieldName].length === 0)
        return (
            <Typography variant="body2" marginTop={'10px'}>
                -
            </Typography>
        );
    else return <></>;
};

export default EmptySingleDisplay;
