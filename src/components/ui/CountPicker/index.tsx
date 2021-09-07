import React, {useEffect, useRef, useState} from 'react';
import './index.css';
import '../../../index.css';

const DEFAULT_VALUE = 1;

interface ICountPickerProps {
    placeholder: string,
    onChange: (value: number | null) => void,
    initialValue?: number | null,
    className?: string,
}

export const CountPicker = (props: ICountPickerProps) => {
    let {placeholder, className, initialValue} = props;

    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<number>(1);
    const countPickerInput = useRef<HTMLInputElement | null>(null);
    let ignoreBlur = false;

    useEffect(() => {
        setInputValue(DEFAULT_VALUE);
        props.onChange(DEFAULT_VALUE);
    }, []);

    useEffect(() => {
        if (typeof initialValue === 'number' && !isNaN(initialValue)) {
            setInputValue(initialValue);
            props.onChange(initialValue ? +initialValue : DEFAULT_VALUE);
        }
    }, [initialValue]);

    useEffect(() => {
        if (isFocused) {
            let countPickerInputElement: any = countPickerInput?.current;
            countPickerInputElement?.focus();
        } else {
            countPickerInput.current?.blur();
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

    const onInputChange = (event: any) => {
        let inputValue = event?.target?.value;
        setInputValue(inputValue);
        if (inputValue) {
            props.onChange(inputValue);
        } else {
            props.onChange(null);
        }
    };

    return <div className={`select ${isFocused ? 'focused' : ''} ${className || ''}`}
                tabIndex={0}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onMouseDown={setIgnoreBlur}
                onMouseUp={clearIgnoreBlur}
                onMouseOut={clearIgnoreBlur}>
        <div className={'select_placeholder'}>{placeholder || 'Количество'}</div>
        <input type={'number'} pattern="\d*"
               min={1} value={inputValue}
               ref={countPickerInput}
               className={'select_input'}
               onChange={onInputChange}/>
    </div>;
};