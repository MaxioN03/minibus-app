import React, {useEffect, useState} from 'react';
import './style.css';

interface IDirectionButtonProps {
    onClick: (isIncluded?: boolean | null) => void,
    onUnInclude?: () => void,
    disabled?: boolean,
    picked: boolean,
    includable?: boolean, //if true it's possible to turn on/off tis button
    included?: boolean,
    title: string
}

export const DirectionButton = (props: React.PropsWithChildren<IDirectionButtonProps>) => {
    const {onClick: onClickProps, title, includable, onUnInclude} = props;
    const [picked, setPicked] = useState<boolean>(false);
    const [included, setIncluded] = useState<boolean>(false);

    useEffect(() => {
        if (props.included === true || props.included === false) {
            setIncluded(props.included);
        }

    }, [props.included]);

    useEffect(() => {
        setPicked(props.picked);
    }, [props.picked]);

    const onClick = (event: any) => {
        if (includable) {
            if (event.target.classList.contains('remove')) {
                setIncluded(false);
                onClickProps(false);
            } else {
                setIncluded(true);
                //Send new included value only if it was changed
                onClickProps(!included ? true : null);
            }
        } else {
            onClickProps();
        }
    };

    const unInclude = () => {
        onUnInclude?.();
    };

    return <button className={`direction_button ${!picked ? 'inactive' : ''}`} onClick={onClick}>
        {includable && !included
            ? <span className={'direction_button_include_control add'}>+</span>
            : null}
        <span>{title}</span>
        {includable && included
            ? <span onClick={unInclude} className={'direction_button_include_control remove'}>+</span>
            : null}
    </button>;
};