import React, {useEffect, useState} from 'react';
import './index.css';
import {makeRequest} from '../../request/request';
import {IOption, Select} from '../ui/Select';
import {SearchButton} from '../ui/Button/SearchButton';
import {DateInput} from '../ui/DateInput';
import {ITrip, default as TripsView} from "../TripsView/TripsView";
import {useLocation, useHistory} from 'react-router-dom';

interface IFilters {
    [key: string]: string,

    from: string,
    to: string,
    date: string, //dd-mm-yyyy
}

export interface IStation {
    _id: string,
    name: string,
    operatorsKeys: {
        [key: string]: string
    }
}

export interface IOperator {
    _id: string,
    name: string
}

const SearchView = () => {
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [trips, setTrips] = useState<ITrip[]>([]);
    const [stationsOptions, setStationsOptions] = useState<IOption[]>([]);
    const [filters, setFilters] = useState<IFilters | null>(null);
    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
        makeRequest('stations').then(stations => {
            let stationsOptions = stations.map((station: IStation) => {
                return {text: station.name, value: station._id};
            });
            setStationsOptions(stationsOptions);
        });
    }, []);

    useEffect(() => {
        let newFilters: any = {};

        let searchParams = new URLSearchParams(location.search);
        ['from', 'to', 'date'].forEach(cgiFilterKey => {
            let value = searchParams.get(cgiFilterKey);
            if (value) {
                newFilters[cgiFilterKey] = value;
            }
        });

        setFilters(newFilters);
    }, [location]);

    const onSearchTrips = () => {
        setIsSearching(true);

        makeRequest('trips', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(filters)
        })
            .finally(() => {
                setIsSearching(false);
            })
            .then(trips => {
                setTrips(trips);
            });
    };

    const onChangeFilter = (type: string, value: any) => {
        let searchParams = new URLSearchParams(location.search);
        if (value !== null) {
            searchParams.set(type, value);
        } else {
            searchParams.delete(type);
        }
        history.push(`${location.pathname}?${searchParams}`);
    };

    const isMainFiltersExist = () => {
        return !!filters?.from && !!filters?.to && !!filters?.date;
    };

    return <>
        <div className={'search_view_container'}>
            <div className={'search_view'}>
                <div className={'search_title'}>
                    <h1>Маршрутки по Беларуси</h1>
                    <span>Онлайн-сервис для поиска выгодных билетов</span>
                </div>
                <div className={'search_controls_container'}>
                    <div className={'search_inputs'}>
                        <Select onSelect={onChangeFilter.bind(null, 'from')}
                                options={stationsOptions}
                                emptyMessage={'Не найдено подходящих городов'}
                                className={'search_from_select'}
                                initialValue={filters?.from}
                                placeholder={'Откуда'}/>
                        {/*<div className={'swipe_routes_button_container'}>*/}
                        {/*<SwipeRoutesButton disabled onClick={() => {*/}
                        {/*}}/>*/}
                        {/*</div>*/}
                        <Select onSelect={onChangeFilter.bind(null, 'to')} options={stationsOptions}
                                initialValue={filters?.to}
                                emptyMessage={'Не найдено подходящих городов'} placeholder={'Куда'}/>
                        <DateInput placeholder={'Дата'} initialValue={filters?.date} className={'search_date_select'}
                                   onSelect={onChangeFilter.bind(null, 'date')}/>
                    </div>
                    <SearchButton disabled={isSearching || !isMainFiltersExist()} onClick={onSearchTrips}/>
                </div>
            </div>
        </div>
        <TripsView trips={trips}/>
    </>;
};

export default SearchView;
