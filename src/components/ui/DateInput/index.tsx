import React, { forwardRef, useEffect, useRef, useState } from 'react';
import DatePicker, { CalendarContainer } from 'react-datepicker';
import { subDays, addDays } from 'date-fns';
import './index.css';
import '../../../index.css';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import { OptionsList } from '../Select/OptionsList';

registerLocale('ru', ru);

export const DateInput = (props: any) => {
    let {placeholder, className} = props;
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isPickerShow, setIsPickerShow] = useState<boolean>(false);
    // const [filteredOptions, setFilteredOptions] = useState<IOption[]>([]);
    const [selectedValue, setSelectedValue] = useState<any>(null);
    const [inputValue, setInputValue] = useState<string>('');
    const dateInput = useRef<HTMLInputElement | null>(null);
    let ignoreBlur = false;

    // useEffect(() => {
    //     setFilteredOptions(options);
    // }, [options]);

    useEffect(() => {
        setIsPickerShow(isFocused);
        if (isFocused) {
            let selectInputElement: any = dateInput?.current;
            selectInputElement?.focus();
            selectInputElement.selectionStart = selectInputElement?.value.length;
        } else {
            dateInput.current?.blur();
        }
    }, [isFocused]);

    const setIgnoreBlur = () => {
        ignoreBlur = true;
        console.log('setIgnoreBlur');
    };

    const clearIgnoreBlur = () => {
        ignoreBlur = false;
        console.log('clearIgnoreBlur');
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

    const onClickHandler = (event: any) => {
        console.log('onClickHandler');

        let isOptionsListClick = false;
        let classList = event.target.classList;
        for (let i = 0; i < classList.length; i++) {
            if (classList[i].includes('react-datepicker__day--keyboard-selected')) {
                isOptionsListClick = true;
            }
        }

        // if (!isOptionsListClick) {
        //     handleFocus();
        // }
    };

    const onInputChange = (event: any) => {
        // let inputValue = event?.target?.value;
        // let filteredOptions = inputValue
        //     ? props.options.filter(option => {
        //         let {value, text} = option;
        //         return value?.toLowerCase().includes(inputValue?.toLowerCase())
        //             || text?.toLowerCase().includes(inputValue?.toLowerCase());
        //     })
        //     : props.options;
        // setFilteredOptions(filteredOptions);
        // setSelectedValue(null);
        // setInputValue(inputValue);
    };

    const onSelect = (selectedValue: string) => {
        // setSelectedValue(selectedValue);
        // let selectedOption = props.options.find(option => option.value === selectedValue);
        // let selectedOptionText = selectedOption?.text ?? '';

        // setFilteredOptions(props.options);
    };

    const onDateChange = (date: Date) => {
        setInputValue(date.toLocaleDateString('ru-RU'));

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let yearString = date.getFullYear();

        let dayString = day < 10 ? `0${day}` : day;
        let monthString = month < 10 ? `0${month}` : month;

        let fullDateString = `${dayString}.${monthString}.${yearString}`;

        props.onSelect(fullDateString);
        handleBlur();
    };

    const MyContainer = ({className, children}: any) => {
        return (
            <div style={{border: '1px solid #F5F5F6', borderRadius: '8px'}}>
                <CalendarContainer className={className}>
                    <div style={{position: 'relative'}}>{children}</div>
                </CalendarContainer>
            </div>
        );
    };

    return <div className={`select ${isFocused ? 'focused' : ''} ${className ?? ''}`}
                tabIndex={0}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onMouseDown={setIgnoreBlur}
                onMouseUp={clearIgnoreBlur}
                onMouseOut={clearIgnoreBlur}
                onClick={onClickHandler}>
        <div className={'select_placeholder'}>{placeholder ?? 'Выберите'}</div>
        <input value={inputValue} ref={dateInput} className={'select_input'} onChange={onInputChange}/>
        {isPickerShow
            ? <div className={'picker'}>
                <DatePicker dateFormat="dd/MM"
                            locale="ru"
                            onChange={onDateChange}
                            minDate={new Date()}
                            maxDate={addDays(new Date(), 14)}
                            calendarContainer={MyContainer}
                            inline/>
            </div>
            : null}
    </div>;
};