import React, { useRef } from 'react';
import './index.css';
import '../../../../index.css';
import { IOption } from '../index';

const MAX_OPTIONS_LENGTH = 5;

interface IOptionsListProps {
    options: IOption[],
    onSelect: (value: string) => void,
    selectedValue: string | null,
    emptyMessage?: string
}

export const OptionsList = (props: IOptionsListProps) => {
    let {options, onSelect, selectedValue, emptyMessage} = props;

    let filteredOptions = options
        ?.sort((option1, option2) => {
            let isSelected1 = selectedValue === option1.value ? 1 : 0;
            let isSelected2 = selectedValue === option2.value ? 1 : 0;
            if (isSelected1 && isSelected2 || !isSelected1 && !isSelected2) {
                return option2.text?.toLowerCase().localeCompare(option1.text?.toLowerCase());
            }
            return isSelected2 - isSelected1;
        })
        ?.slice(0, Math.min(options.length, MAX_OPTIONS_LENGTH))
        ?.map(option => {
            let {value, text} = option;

            return <div onClick={onSelect.bind(null, value)}
                        className={`select_option ${selectedValue === value ? 'selected_option' : ''}`}
                        key={value}>
                {text}
            </div>;
        });

    return <div className={`options_list`}>
        {options?.length
            ? filteredOptions
            : <div onClick={() => {
            }}
                   className={`select_option empty_option`}>
                {emptyMessage ?? 'Нет подходящих опций'}
            </div>}
    </div>;
};