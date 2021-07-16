import React, {useEffect, useState} from 'react';
import './index.css';
import {makeRequest} from '../../request/request';
import {IOption, Select} from '../ui/Select';
import {SearchButton} from '../ui/Button/SearchButton';
import {DateInput} from '../ui/DateInput';
import {ITrip, default as TripsView} from "../TripsView/TripsView";
import {useLocation, useHistory} from 'react-router-dom';
import {CountPicker} from "../ui/CountPicker";
import ErrorViewFailedRequest from "../ErrorViewFailedRequest";
import IntimationUpdatePopUp from "../IntimationUpdatePopUp";

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

const UPDATE_POPUP_TIMEOUT = 900000;

const SearchView = () => {
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [trips, setTrips] = useState<ITrip[] | null>(null);
    const [error, setError] = useState<any>(null);
    const [stationsOptions, setStationsOptions] = useState<IOption[]>([]);
    const [filters, setFilters] = useState<IFilters | null>(null);
    const [firstLoad, setFirstLoad] = useState<boolean>(false);
    const [isShowUpdatePopup, setIsShowUpdatePopup] = useState<boolean>(false);
    const location = useLocation();
    const history = useHistory();
    let updateTimer: any = null;

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
        if (!firstLoad && isMainFiltersExist(filters)) {
            onSearchTrips();
            setFirstLoad(true);
        }
    }, [filters]);

    const onSearchTrips = () => {
        setIsSearching(true);
        setError(null);
        clearTimeout(updateTimer);
        setIsShowUpdatePopup(false);

        makeRequest(`trips?from=${filters?.from}&to=${filters?.to}&date=${filters?.date}&passengers=${filters?.passengers}`)
            .finally(() => {
                setIsSearching(false);
                updateTimer = setTimeout(() => {
                    setIsShowUpdatePopup(true);
                }, UPDATE_POPUP_TIMEOUT);
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

    const onUpdatePopUpAccept = () => {
        onSearchTrips();
    };

    const onUpdatePopUpClose = () => {
        setIsShowUpdatePopup(false);
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
            ? <TripsView isTripsLoading={isSearching} trips={trips || []}/>
            : error
                ? <ErrorViewFailedRequest error={error}/>
                : trips
                    ? <TripsView isTripsLoading={isSearching} trips={trips}/>
                    : null}
        {isShowUpdatePopup
            ? <IntimationUpdatePopUp onAccept={onUpdatePopUpAccept} onClose={onUpdatePopUpClose}/>
            : null}
    </>;
};

export default SearchView;
