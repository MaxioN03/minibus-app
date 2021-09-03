import React from 'react';
import style from "./index.module.css";

export interface ISwitcherValue {
    value: string,
    text: string,
    selected: boolean,
}

interface ISwitcherProps {
    options: ISwitcherValue[]
    onClick: (value: string) => void,
    disabled?: boolean,
}

export const Switcher = (props: ISwitcherProps) => {
    const {options, onClick: onClickProps, disabled} = props;

    const onClick = (value: string) => {
        if (!disabled) {
            onClickProps(value);
        }
    };

    return <div className={`${style.switcher} ${disabled ? style.disabled : ''}`}>
        {options.map(option => {
            let {text, value, selected} = option;
            return <div key={value} onClick={onClick.bind(null, value)} className={`${style.switcher_item} ${selected ? style.selected : ''}`}>
                {text}
            </div>;
        })}
    </div>;
};