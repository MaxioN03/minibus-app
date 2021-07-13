import React from 'react';
import './index.css';
import {Link} from "react-router-dom";

const ErrorViewGlobalError = () => {
    const onReloadClick = () => {
        location.reload();
    };

    return <div className={'search_view_container'}>
        <div className={'search_view'}>
            <div>
                <h1 className={'error_code'}>Упс...</h1>
                <h1 className={'error_title'}>Что-то сломалось</h1>
                <span className={'alternative_text'}>
                    Мы уже достали ключи и отвёртки, а вы попробуйте <span className={'interactive_line'} onClick={onReloadClick}>обновить страницу</span> или <Link
                    className={'link'} to={'/'}>вернуться на главную</Link>
                </span>
            </div>
        </div>
    </div>;
};

export default ErrorViewGlobalError;
