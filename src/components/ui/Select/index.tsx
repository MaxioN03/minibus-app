import React, { useEffect, useRef, useState } from 'react';
import './index.css';
import '../../../index.css';
import { OptionsList } from './OptionsList';

export interface IOption {
    value: string,
    text: string
}

interface ISelectProps {
    placeholder: string,
    options: IOption[],
    emptyMessage?: string,
    className?: string,
    onSelect: (value: string) => void
}

export const Select = (props: ISelectProps) => {
    let {placeholder, options, emptyMessage, className} = props;
    const [isOptionsListShow, setIsOptionsListShow] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [filteredOptions, setFilteredOptions] = useState<IOption[]>([]);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState<string>('');
    const selectInput = useRef<HTMLInputElement | null>(null);
    let ignoreBlur = false;

    useEffect(() => {
        setFilteredOptions(options);
    }, [options]);

    useEffect(() => {
        setIsOptionsListShow(isFocused);
        if (isFocused) {
            let selectInputElement: any = selectInput?.current;
            selectInputElement?.focus();
            selectInputElement.selectionStart = selectInputElement?.value.length;
        } else {
            selectInput.current?.blur();
        }
    }, [isFocused]);

    const setIgnoreBlur = () => {
        ignoreBlur = true;
    };

    const clearIgnoreBlur = () => {
        ignoreBlur = false;
    };

    const handleBlur = () => {
        if (ignoreBlur) {
            return;
        }

        setIsFocused(false);
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const onSelectClickHandler = (event: any) => {
        //Check is click was on option
        let isOptionsListClick = false;
        let classList = event.target.classList;
        for (let i = 0; i < classList.length; i++) {
            if (classList[i].includes('select_option')) {
                isOptionsListClick = true;
            }
        }

        if (!isOptionsListClick) {
            handleFocus();
        }
    };

    const onInputChange = (event: any) => {
        let inputValue = event?.target?.value;
        let filteredOptions = inputValue
            ? props.options.filter(option => {
                let {value, text} = option;
                return value?.toLowerCase().includes(inputValue?.toLowerCase())
                    || text?.toLowerCase().includes(inputValue?.toLowerCase());
            })
            : props.options;
        setFilteredOptions(filteredOptions);
        setSelectedValue(null);
        setInputValue(inputValue);
    };

    const onSelect = (selectedValue: string) => {
        setSelectedValue(selectedValue);
        let selectedOption = props.options.find(option => option.value === selectedValue);
        let selectedOptionText = selectedOption?.text ?? '';
        setInputValue(selectedOptionText);
        setFilteredOptions(props.options);
        props.onSelect(selectedValue);
        handleBlur();
    };

    return <div className={`select ${isFocused ? 'focused' : ''} ${className ?? ''}`}
                tabIndex={0}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onMouseDown={setIgnoreBlur}
                onMouseUp={clearIgnoreBlur}
                onMouseOut={clearIgnoreBlur}
                onClick={onSelectClickHandler}>
        <div className={'select_placeholder'}>{placeholder ?? 'Выберите'}</div>
        <input value={inputValue} ref={selectInput} className={'select_input'} onChange={onInputChange}/>
        {isOptionsListShow
            ? <OptionsList selectedValue={selectedValue} onSelect={onSelect}
                           options={filteredOptions} emptyMessage={emptyMessage}/>
            : null}
    </div>;
};