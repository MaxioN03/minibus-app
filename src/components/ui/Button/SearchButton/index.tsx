import React from 'react';
import './style.css';
import {Button} from '../index';
import {isMobile} from "../../../../utils";

interface ISearchButtonProps {
    onClick: () => void,
    disabled?: boolean
}

export const SearchButton = (props: React.PropsWithChildren<ISearchButtonProps>) => {
    const {onClick: onClickProps, disabled} = props;
    let mobile = isMobile();

    return <Button icon={<div className={'search_button_icon'}/>} className={`search_button`} onClick={onClickProps}
                   disabled={disabled}>
        {mobile ? <span className={'search_button_title'}>Найти</span> : null}
    </Button>;
};