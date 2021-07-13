import React from 'react';
import './index.css';
import {Link} from "react-router-dom";

const ErrorViewNotFound = () => {
    return <div className={'search_view_container'}>
        <div className={'search_view'}>
            <div>
                <h1 className={'error_code'}>404</h1>
                <h1 className={'error_title'}>Кажется, такой страницы нет</h1>
                <span className={'alternative_text'}>Конец - это всегда только начало. Попробуйте <Link className={'link'} to={'/'}>вернуться на главную страницу</Link></span>
            </div>
        </div>
    </div>;
};

export default ErrorViewNotFound;
