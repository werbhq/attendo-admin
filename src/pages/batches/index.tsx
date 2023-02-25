import icon from '@mui/icons-material/Article';
import { MAPPING } from '../../provider/mapping';
import BatchesCreate from './Create';
import BatchesList from './List';
import BatchesShow from './Show';

import { ResourceProps } from 'react-admin';
const Batches: ResourceProps = {
    name: MAPPING.BATCHES,
    icon,
    options: { label: 'Batches' },
    list: BatchesList,
    show: BatchesShow,
    create: BatchesCreate,
};

export default Batches;
