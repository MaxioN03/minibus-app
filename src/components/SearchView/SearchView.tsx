import React, {useEffect, useState} from 'react';
import './index.css';
import {makeRequest} from '../../request/request';
import {IOption, Select} from '../ui/Select';
import {SwipeRoutesButton} from '../ui/Button/SwipeRoutesButton';
import {SearchButton} from '../ui/Button/SearchButton';
import {DateInput} from '../ui/DateInput';
import {ITrip, default as TripsView} from "../TripsView/TripsView";

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
    const [filters, setFilters] = useState<{ [key: string]: any } | null>({});

    useEffect(() => {
        makeRequest('stations').then(stations => {
            let stationsOptions = stations.map((station: IStation) => {
                return {text: station.name, value: station._id};
            });
            setStationsOptions(stationsOptions);
        });
    }, []);

    const onSearchButtonClick = () => {
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

    useEffect(() => {
    }, [isSearching]);

    const onChangeFilter = (type: string, value: any) => {
        let newFilters = Object.assign({}, filters);
        newFilters[type] = value;
        setFilters(newFilters);
    };

    return <>
        <div className={'search_view'}>
            <div className={'search_controls_container'}>
                <div className={'search_inputs'}>
                    <Select onSelect={onChangeFilter.bind(null, 'from')} options={stationsOptions}
                            emptyMessage={'Не найдено подходящих городов'}
                            className={'search_from_select'}
                            placeholder={'Откуда'}/>
                    <div className={'swipe_routes_button_container'}>
                        <SwipeRoutesButton disabled onClick={() => {
                        }}/>
                    </div>
                    <Select onSelect={onChangeFilter.bind(null, 'to')} options={stationsOptions}
                            emptyMessage={'Не найдено подходящих городов'} placeholder={'Куда'}/>
                    <DateInput className={'search_date_select'} onSelect={onChangeFilter.bind(null, 'date')}/>
                </div>
                <SearchButton disabled={isSearching} onClick={onSearchButtonClick}/>
            </div>
            <div className={'search_button_container'}>

            </div>
        </div>
        <TripsView trips={trips}/>
    </>;
};

export default SearchView;
