import React from 'react';
import './style.css';
import { Button } from '../index';

interface ISearchButtonProps {
    onClick: () => void,
    disabled?: boolean
}

export const SearchButton = (props: React.PropsWithChildren<ISearchButtonProps>) => {
    const {onClick: onClickProps, disabled} = props;

    return <Button className={'search_button'} onClick={onClickProps} disabled={disabled}>
        <div className={'search_button_icon'}/>
    </Button>;
};