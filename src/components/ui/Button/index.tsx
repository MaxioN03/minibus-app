import React from 'react';
import './style.css';
import '../../../index.css';

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

    return <button className={`button ${secondary ? 'secondary' : ''} ${disabled ? 'disabled' : ''} `
    + ` ${secondColor ? 'second_color' : ''} ${className ?? ''}`}
                   onClick={onClick}>
        {icon
            ? <div className={'icon'}>{icon}</div>
            : null}
        <span className={'button_title'}>{children ?? 'title'}</span>
    </button>;
};