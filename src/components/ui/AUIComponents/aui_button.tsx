import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/material';
import AUIColours from './colours';
import { Color, mergeColors } from './flutter_color';

const AUIButton = styled(LoadingButton)`
    background-color: ${AUIColours.primary1Day};
    color: ${AUIColours.onSurfaceDay};
    border-radius: 16px;
    font-size: 16px;
    font-weight: 600;
    text-transform: none;
    box-shadow: none;
    height: 48px;
    &:hover {
        box-shadow: none;
    }
`;
export default AUIButton;
