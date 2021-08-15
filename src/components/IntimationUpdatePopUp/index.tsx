import React from 'react';
import style from './index.module.css';

interface IIntimationUpdatePopUpProps {
    onAccept: () => void
    onClose: () => void,
}

const IntimationUpdatePopUp = (props: IIntimationUpdatePopUpProps) => {
    let {onAccept, onClose} = props;

    return <div className={style.intimation_update_popup_container}>
        <div className={style.intimation_update_popup}>
            <span>Прошло время, результаты поиска могли изменится, поискать ещё раз?</span>
            <div className={style.intimation_update_popup_controls}>
                <span className={`${style.interactive_line} ${style.intimation_update_popup_control} ${style.yes}`} onClick={onAccept}>Искать</span>
                <span className={`${style.interactive_line} ${style.intimation_update_popup_control}`} onClick={onClose}>Закрыть</span>
            </div>
        </div>
    </div>;
};

export default IntimationUpdatePopUp;
