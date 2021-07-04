import React, { useEffect, useState } from 'react';
import './index.css';
import { Button } from '../ui/Button';
import { makeRequest } from '../../request/request';
import { IOption, Select } from '../ui/Select';
import { SwipeRoutesButton } from '../ui/Button/SwipeRoutesButton';
import { SearchButton } from '../ui/Button/SearchButton';
import { DateInput } from '../ui/DateInput';

interface IStation {
    _id: string,
    name: string,
    operatorsKeys: {
        [key: string]: string
    }
}

const SearchView = () => {
    const [isSearching, setIsSearching] = useState<boolean>(false);
    // const [stations, setStations] = useState<IStation[]>([]);
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

        console.log('JSON.stringify(filters)', JSON.stringify(filters));

        makeRequest('trips', {
            method: 'POST',
            body: JSON.stringify(filters)
        }).then(response => {
            console.log('response', response);
        })
    };

    useEffect(() => {
    }, [isSearching]);

    const onChangeFilter = (type: string, value: any) => {
        let newFilters = Object.assign({}, filters);
        newFilters[type] = value;
        setFilters(newFilters);
    };

    return <div className={'search_view'}>
        <div className={'search_controls_container'}>
            <div className={'search_inputs'}>
                <Select onSelect={onChangeFilter.bind(null, 'from')} options={stationsOptions}
                        emptyMessage={'Не найдено подходящих городов'}
                        placeholder={'Откуда'}/>
                <div className={'swipe_routes_button_container'}>
                    <SwipeRoutesButton disabled onClick={() => {
                    }}/>
                </div>
                <Select onSelect={onChangeFilter.bind(null, 'to')} options={stationsOptions}
                        emptyMessage={'Не найдено подходящих городов'} placeholder={'Куда'}/>
                <DateInput onSelect={onChangeFilter.bind(null, 'date')}/>
            </div>
            <SearchButton disabled={isSearching} onClick={onSearchButtonClick}/>
        </div>
        <div className={'search_button_container'}>

        </div>
    </div>;
};

export default SearchView;
