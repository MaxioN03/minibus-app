import React from 'react';
import style from './index.module.css';
import '../../../index.css';
import {EMPTY_FILLER} from "../../../constants/constants";

interface IButtonProps {
    onClick: () => void,
    secondary?: boolean,
    secondColor?: boolean,
    disabled?: boolean,
    className?: string,
    icon?: any
}

export const Button = (props: React.PropsWithChildren<IButtonProps>) => {
    const {onClick: onClickProps, secondary, children, disabled, className, icon, secondColor} = props;

    const onClick = () => {
        if (!disabled) {
            onClickProps();
        }
    };

    return <button className={`${style.button} ${secondary ? style.secondary : ''} ${disabled ? style.disabled : ''} `
    + ` ${secondColor ? style.second_color : ''} ${className ?? ''}`}
                   onClick={onClick}>
        {icon
            ? <div className={style.icon}>{icon}</div>
            : null}
        {children !== null
            ? <span className={style.button_title}>{children ?? EMPTY_FILLER}</span>
            : null}
    </button>;
};