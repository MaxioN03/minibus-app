import React from 'react';
import './index.css';

interface IIntimationUpdatePopUpProps {
    onAccept: () => void
    onClose: () => void,
}

const IntimationUpdatePopUp = (props: IIntimationUpdatePopUpProps) => {
    let {onAccept, onClose} = props;

    return <div className={'intimation_update_popup_container'}>
        <div className={'intimation_update_popup'}>
            <span>Прошло время, результаты поиска могли изменится, поискать ещё раз?</span>
            <div className={'intimation_update_popup_controls'}>
                <span className={'interactive_line intimation_update_popup_control yes'} onClick={onAccept}>Искать</span>
                <span className={'interactive_line intimation_update_popup_control'} onClick={onClose}>Закрыть</span>
            </div>
        </div>
    </div>;
};

export default IntimationUpdatePopUp;
