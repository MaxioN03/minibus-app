import React, {useEffect, useState} from 'react';
import './index.css';
import {makeRequest} from '../../request/request';
import {IOption, Select} from '../ui/Select';
import {SearchButton} from '../ui/Button/SearchButton';
import {DateInput} from '../ui/DateInput';
import {ITrip, default as TripsView} from "../TripsView/TripsView";
import {useLocation, useHistory} from 'react-router-dom';
import {Spin} from "../ui/Spin";
import {CountPicker} from "../ui/CountPicker";
import ErrorViewFailedRequest from "../ErrorViewFailedRequest";

interface IFilters {
    [key: string]: string | number,

    from: string,
    to: string,
    date: string, //dd-mm-yyyy
    passengers: number,
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
    const [trips, setTrips] = useState<ITrip[] | null>(null);
    const [error, setError] = useState<any>(null);
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
        ['from', 'to', 'date', 'passengers'].forEach(cgiFilterKey => {
            let value = searchParams.get(cgiFilterKey);
            if (value) {
                newFilters[cgiFilterKey] = value;
            }
        });

        setFilters(newFilters);
    }, [location]);

    useEffect(() => {
        if (isMainFiltersExist(filters)) {
            onSearchTrips();
        }
    }, [filters]);

    const onSearchTrips = () => {
        setIsSearching(true);
        setError(null);

        makeRequest(`trips?from=${filters?.from}&to=${filters?.to}&date=${filters?.date}&passengers=${filters?.passengers}`)
            .finally(() => {
                setIsSearching(false);
            })
            .then(trips => {
                setTrips(trips);
            })
            .catch(error => {
                setError(error);
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

    const isMainFiltersExist = (filters: IFilters | null) => {
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
                        <DateInput placeholder={'Дата'} initialValue={filters?.date}
                                   onSelect={onChangeFilter.bind(null, 'date')}/>
                        <CountPicker placeholder={'Пассажиры'}
                                     onChange={onChangeFilter.bind(null, 'passengers')}
                                     className={'search_passengers_select'}/>
                    </div>
                    <SearchButton disabled={isSearching || !isMainFiltersExist(filters)} onClick={onSearchTrips}/>
                </div>
            </div>
        </div>
        {isSearching
            ? <Spin/>
            : error
                ? <ErrorViewFailedRequest error={error}/>
                : trips
                    ? <TripsView trips={trips}/>
                    : null}

    </>;
};

export default SearchView;
