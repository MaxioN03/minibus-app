import React, {useEffect, useRef, useState} from 'react';
import './index.css';
import '../../../index.css';
import {OptionsList} from './OptionsList';
import {isMobile} from "../../../utils";

export interface IOption {
    value: string,
    text: string
}

interface ISelectProps {
    placeholder: string,
    options: IOption[],
    emptyMessage?: string,
    className?: string,
    onSelect: (value: string | null) => void,
    initialValue?: string | number | null,
}

export const Select = (props: ISelectProps) => {
    let {placeholder, options, emptyMessage, className, initialValue} = props;
    const [isOptionsListShow, setIsOptionsListShow] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [filteredOptions, setFilteredOptions] = useState<IOption[]>([]);
    const [selectedValue, setSelectedValue] = useState<string | number | null>(null);
    const [inputValue, setInputValue] = useState<string>('');
    const selectInput = useRef<HTMLInputElement | null>(null);
    let ignoreBlur = false;

    useEffect(() => {
        setFilteredOptions(options);
    }, [options]);

    useEffect(() => {
        let selectedOptions = options.find(option => option.value === initialValue);
        if (selectedOptions) {
            setSelectedValue(initialValue || null);
            setInputValue(selectedOptions.text);
        }
        if (initialValue === null) {
            setSelectedValue(null);
            setInputValue('');
        }
    }, [options, initialValue]);

    useEffect(() => {
        setIsOptionsListShow(isFocused);
        if (isFocused) {
            let selectInputElement: any = selectInput?.current;
            selectInputElement?.focus();
            selectInputElement.selectionStart = selectInputElement?.value.length;
        } else {
            selectInput.current?.blur();
        }

        if (isFocused && isMobile()) {
            document.body.style.position = 'fixed';
        } else {
            document.body.style.position = 'static';
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
            if (classList[i].includes('select_option') || classList[i].includes('select_cancel_button')) {
                isOptionsListClick = true;
            }
        }

        if (!isOptionsListClick) {
            handleFocus();
        }
    };

    const onCancelClick = () => {
        setIgnoreBlur();
        setIsFocused(false);
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
        props.onSelect(null);
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

    return <div className={`select variants_picker ${isFocused ? 'focused' : ''} ${className ?? ''}`}
                tabIndex={0}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onMouseDown={setIgnoreBlur}
                onMouseUp={clearIgnoreBlur}
                onMouseOut={clearIgnoreBlur}
                onClick={onSelectClickHandler}>
        <div className={'controls'}>
            <div className={'select_placeholder'}>{placeholder ?? 'Выберите'}</div>
            <div className={'select_cancel_button'} onClick={onCancelClick}>Отмена</div>
        </div>
        <input value={inputValue} ref={selectInput} className={'select_input'} onChange={onInputChange}/>
        {isOptionsListShow
            ? <OptionsList selectedValue={selectedValue ? selectedValue.toString() : null} onSelect={onSelect}
                           options={filteredOptions} emptyMessage={emptyMessage}/>
            : null}
    </div>;
};