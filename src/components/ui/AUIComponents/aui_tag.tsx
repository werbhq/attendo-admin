import { ChipField } from 'react-admin';
import AUIColours from './colours';

export const AUITag = (props: any) => {
    return (
        <ChipField
            sx={{
                border: '1px solid ' + AUIColours.overlayDay,
                borderRadius: 2,
                backgroundColor: AUIColours.overlayDay,
            }}
            source={props.source}
        ></ChipField>
    );
};
