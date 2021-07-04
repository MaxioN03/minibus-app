import React from 'react';
import './style.css';
import { Button } from '../index';

interface IButtonProps {
    onClick: () => void,
    disabled?: boolean
}

export const SwipeRoutesButton = (props: React.PropsWithChildren<IButtonProps>) => {
    const {onClick: onClickProps, disabled} = props;

    return <Button className={'swipe_routes_button'} onClick={onClickProps} type={'secondary'} disabled={disabled}>
        <div className={'swipe_routes_button_icon'}/>
    </Button>;
};