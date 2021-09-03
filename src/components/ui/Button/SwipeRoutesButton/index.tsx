import React from 'react';
import style from './index.module.css';
import { Button } from '../index';

interface IButtonProps {
    onClick: () => void,
    disabled?: boolean
}

export const SwipeRoutesButton = (props: React.PropsWithChildren<IButtonProps>) => {
    const {onClick: onClickProps, disabled} = props;

    return <Button className={style.swipe_routes_button} onClick={onClickProps} secondary disabled={disabled}>
        <div className={style.swipe_routes_button_icon}/>
    </Button>;
};