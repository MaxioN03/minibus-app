import React, {useEffect, useState} from 'react';
import style from "../index.module.css";
import {IOption, Select} from '../../ui/Select';
import {DateInput} from '../../ui/DateInput';
import {useLocation, useHistory} from 'react-router-dom';
import {CountPicker} from "../../ui/CountPicker";
import {SwipeRoutesButton} from "../../ui/Button/SwipeRoutesButton";
import {FilterKeys, Filters} from "../types";

interface ISearchViewFormProps {
    prefix: string,
    stationsOptions: IOption[],
}

export const SearchViewForm = (props: ISearchViewFormProps) => {
    let {stationsOptions, prefix} = props;

    const [filters, setFilters] = useState<Filters>({
        from: null,
        to: null,
        date: null,
        passengers: 1,
    });

    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
        let newFilters: Filters = {
            from: null,
            to: null,
            date: null,
            passengers: null
        };

        let searchParams = new URLSearchParams(location.search);
        [FilterKeys.from, FilterKeys.to, FilterKeys.date, FilterKeys.passengers].forEach(filterKey => {
            let filterCgiValue = searchParams.get(getCgiKeyWithPrefix(filterKey, prefix));
            if (filterCgiValue) {
                newFilters[filterKey] = filterCgiValue;
            }
        });

        setFilters(newFilters);
    }, [prefix]);

    const onChangeFilter = (type: string, value: any) => {
        let searchParams = new URLSearchParams(location.search);
        if (value !== null) {
            searchParams.set(type, value);
        } else {
            searchParams.delete(type);
        }
        history.push(`${location.pathname}?${searchParams}`);
    };

    useEffect(() => {
        let newFilters: Filters = {
            from: null,
            to: null,
            date: null,
            passengers: null,
        };

        let searchParams = new URLSearchParams(location.search);
        [
            getCgiKeyWithPrefix('from', prefix),
            getCgiKeyWithPrefix('to', prefix),
            getCgiKeyWithPrefix('date', prefix),
            getCgiKeyWithPrefix('passengers', prefix)
        ]
            .forEach(cgiFilterKey => {
                let value = searchParams.get(cgiFilterKey);
                if (value) {
                    let filterKey: FilterKeys = getCgiKeyWithoutPrefix(cgiFilterKey) as FilterKeys;
                    newFilters[filterKey] = value;
                }
            });

        setFilters(newFilters);
    }, [location, prefix]);

    const onSwipeRoutesClick = () => {
        let searchParams = new URLSearchParams(location.search);
        let toValue = searchParams.get(getCgiKeyWithPrefix('to', prefix));
        let fromValue = searchParams.get(getCgiKeyWithPrefix('from', prefix));

        if (toValue !== null) {
            searchParams.set(getCgiKeyWithPrefix('from', prefix), toValue);
        } else {
            searchParams.delete(getCgiKeyWithPrefix('from', prefix));
        }

        if (fromValue !== null) {
            searchParams.set(getCgiKeyWithPrefix('to', prefix), fromValue);
        } else {
            searchParams.delete(getCgiKeyWithPrefix('to', prefix));
        }

        history.push(`${location.pathname}?${searchParams}`);
    };

    return <div className={style.search_inputs}>
        <Select onSelect={onChangeFilter.bind(null, getCgiKeyWithPrefix('from', prefix))}
                options={stationsOptions}
                emptyMessage={'Не найдено подходящих городов'}
                className={style.search_from_select}
                initialValue={filters?.from ?? null}
                placeholder={'Откуда'}/>
        <div className={style.swipe_routes_button_container}>
            <SwipeRoutesButton onClick={onSwipeRoutesClick}/>
        </div>
        <Select onSelect={onChangeFilter.bind(null, getCgiKeyWithPrefix('to', prefix))}
                options={stationsOptions}
                initialValue={filters?.to ?? null}
                emptyMessage={'Не найдено подходящих городов'} placeholder={'Куда'}/>
        <DateInput placeholder={'Дата'} initialValue={filters?.date ? filters?.date?.toString() : null}
                   onSelect={onChangeFilter.bind(null, getCgiKeyWithPrefix('date', prefix))}/>
        <CountPicker placeholder={'Пассажиры'}
                     initialValue={filters?.passengers ? +filters?.passengers : null}
                     onChange={onChangeFilter.bind(null, getCgiKeyWithPrefix('passengers', prefix))}
                     className={style.search_passengers_select}/>
    </div>;
};

export const getCgiKeyWithPrefix = (key: 'from' | 'to' | 'date' | 'passengers', prefix: string) => {
    return `${prefix}_${key}`;
};

export const getCgiKeyWithoutPrefix = (key: string): string => {
    return key.split('_')[1];
};
