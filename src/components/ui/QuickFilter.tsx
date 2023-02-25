import { Chip } from '@mui/material';

const QuickFilter = (props: any) => {
    return <Chip sx={{ marginBottom: 1 }} label={props.label} />;
};

export default QuickFilter;
