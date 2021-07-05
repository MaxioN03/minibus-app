import React, {useEffect, useRef, useState} from 'react';
import {subDays, addDays} from 'date-fns';
import './index.css';
import '../../../index.css';
import 'react-datepicker/dist/react-datepicker.css';
import {registerLocale} from 'react-datepicker';
import ru from 'date-fns/locale/ru';

registerLocale('ru', ru);

interface IDateInputProps {
    placeholder: string,
    className?: string,
    onSelect: (value: string) => void
    initialValue?: string
}

export const DateInput = (props: IDateInputProps) => {
    let {placeholder, className, initialValue} = props;
    const dateInput = useRef<HTMLInputElement | null>(null);
    let ignoreBlur = false;

    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>(''); //yyyy-mm-dd

    useEffect(() => {
        if (!isNaN(Date.parse(initialValue || ''))) {
            let date = new Date(formatDateFromRuToEn(initialValue || ''));

            let day = date.getDate();
            let month = date.getMonth() + 1;

            let yearString = date.getFullYear();
            let dayString = day < 10 ? `0${day}` : day;
            let monthString = month < 10 ? `0${month}` : month;

            setInputValue(`${yearString}-${monthString}-${dayString}`);
            props.onSelect(initialValue || '');
        }
    }, [initialValue]);

    useEffect(() => {
        if (isFocused) {
            let selectInputElement: any = dateInput?.current;
            selectInputElement?.focus();
        } else {
            dateInput.current?.blur();
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

    const onClickHandler = () => {
        handleFocus();
    };

    const onInputChange = (event: any) => {
        let inputValue = event?.target?.value;
        let date = new Date(inputValue);

        let day = date.getDate();
        let month = date.getMonth() + 1;

        let yearString = date.getFullYear();
        let dayString = day < 10 ? `0${day}` : day;
        let monthString = month < 10 ? `0${month}` : month;

        setInputValue(inputValue);
        props.onSelect(`${dayString}-${monthString}-${yearString}`);
    };

    return <div className={`select ${isFocused ? 'focused' : ''} ${className || ''}`}
                tabIndex={0}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onMouseDown={setIgnoreBlur}
                onMouseUp={clearIgnoreBlur}
                onMouseOut={clearIgnoreBlur}
                onClick={onClickHandler}>
        <div className={'select_placeholder'}>{placeholder || 'Выберите'}</div>
        <input type={'date'} value={inputValue} ref={dateInput} className={'select_input'} onChange={onInputChange}/>
    </div>;
};

const formatDateFromRuToEn = (date: string) => {
    let [day, month, year] = date.split('-');
    return [year, month, day].join('-');
};