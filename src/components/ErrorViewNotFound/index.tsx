import React from 'react';
import style from './index.module.css';
import {Link} from "react-router-dom";

const ErrorViewNotFound = () => {
    return <div className={style.error_view_container}>
        <div className={style.error_view}>
            <div>
                <h1 className={style.error_code}>404</h1>
                <h1 className={style.error_title}>Кажется, такой страницы нет</h1>
                <span className={style.alternative_text}>Конец - это всегда только начало. Попробуйте <Link className={'link'} to={'/'}>вернуться на главную страницу</Link></span>
            </div>
        </div>
    </div>;
};

export default ErrorViewNotFound;
