import React from 'react';
import './index.css';

interface IRequestError {
    code: number,
    message: string,
    display: string,
}

const ErrorViewFailedRequest = (props: { error: IRequestError | null }) => {
    let {error} = props;
    let {code, display} = error || {};

    return <div className={'search_view_container'}>
        <div className={'search_view error_view'}>
            <div>
                <h1 className={'error_failed_request_title'}>Произошла ошибка</h1>
                <span className={'error_failed_request_alternative_text'}>
                    {display}
                </span>
            </div>
            <div className={'error_failed_request_code_background'}>{code}</div>
            <div>
                <span className={'error_failed_request_alternative_text'}>
                    Попробуйте ещё раз
                </span>
            </div>
        </div>
    </div>;
};

export default ErrorViewFailedRequest;
