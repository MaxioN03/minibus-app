import React, {useEffect, useState} from 'react';
import style from "./index.module.css";
import {makeRequest} from '../../request/request';
import {IOption} from '../ui/Select';
import {SearchButton} from '../ui/Button/SearchButton';
import {ITrip, default as TripsView} from "../TripsView/TripsView";
import {useLocation} from 'react-router-dom';
import ErrorViewFailedRequest from "../ErrorViewFailedRequest";
import IntimationUpdatePopUp from "../IntimationUpdatePopUp";
import {DirectionButton} from "../ui/Button/DirectionButton";
import {getCgiKeyWithPrefix, SearchViewForm} from "./SearchViewForm";
import {formatDateFromRuToEn} from "../ui/DateInput";

export enum FilterKeys {
    from = 'from',
    to = 'to',
    date = 'date',
    passengers = 'passengers',
}

export type Filters = Record<FilterKeys, string | number | null>

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
    const [trips, setTrips] = useState<{ from: string, to: string, date: string, trips: ITrip[] }[] | null>(null);
    const [error, setError] = useState<any>(null);

    const [stationsOptions, setStationsOptions] = useState<IOption[]>([]);
    const [filters, setFilters] = useState<{ forward: Filters, back: Filters }>({
        forward: {
            from: null,
            to: null,
            date: null,
            passengers: null,
        },
        back: {
            from: null,
            to: null,
            date: null,
            passengers: null,
        }
    });

    const [isShowUpdatePopup, setIsShowUpdatePopup] = useState<boolean>(false);

    const [pickedDirection, setPickedDirection] = useState<'forward' | 'back'>('forward');

    const location = useLocation();

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
        let newFilters: { forward: Filters, back: Filters } = {
            forward: {
                from: null,
                to: null,
                date: null,
                passengers: null,
            },
            back: {
                from: null,
                to: null,
                date: null,
                passengers: null,
            },
        };

        let searchParams = new URLSearchParams(location.search);

        [FilterKeys.from, FilterKeys.to, FilterKeys.date, FilterKeys.passengers].forEach(cgiFilterKey => {
            const directionKey: ('back' | 'forward')[] = ['back', 'forward'];
            directionKey.forEach(directionKey => {
                newFilters[directionKey][cgiFilterKey] = searchParams.get(getCgiKeyWithPrefix(cgiFilterKey, directionKey));
            });
        });

        setFilters(newFilters);
    }, [location]);

    useEffect(() => {
        if (isMainFiltersExist(filters.forward) || isMainFiltersExist(filters.back)) {
            onSearchTrips();
        }
    }, [filters]);

    const onSearchTrips = () => {
        setIsSearching(true);
        setError(null);
        clearTimeout(updateTimer);
        setIsShowUpdatePopup(false);

        const getRequestByPrefix = (prefix: 'forward' | 'back') => {
            let filtersByDirection = filters[prefix];
            let searchParams = new URLSearchParams();

            [FilterKeys.from, FilterKeys.to, FilterKeys.date, FilterKeys.passengers].forEach(filterKey => {
                let filterValue = filtersByDirection?.[filterKey];
                if (filterValue) {
                    searchParams.set(filterKey, filterValue.toString());
                }
            });

            return new Promise(async (resolve, reject) => {
                try {
                    let trips = await makeRequest(`trips?${searchParams.toString()}`);
                    resolve({
                        from: filtersByDirection?.[FilterKeys.from],
                        to: filtersByDirection?.[FilterKeys.to],
                        date: formatDateFromRuToEn(filtersByDirection?.[FilterKeys.date]?.toString() ?? ''),
                        passengers: filtersByDirection?.[FilterKeys.passengers],
                        trips
                    });

                } catch (error) {
                    reject(error);
                }
            });
        };

        Promise.all([
            ...(isMainFiltersExist(filters.forward) ? [getRequestByPrefix('forward')] : []),
            ...(isMainFiltersExist(filters.back) ? [getRequestByPrefix('back')] : []),
        ])
            .finally(() => {
                setIsSearching(false);
                updateTimer = setTimeout(() => {
                    setIsShowUpdatePopup(true);
                }, UPDATE_POPUP_TIMEOUT);
            })
            .then((tripsArray: any) => {
                console.log('tripsArray', tripsArray);
                setTrips(tripsArray);
            })
            .catch(error => {
                setError(error);
            });
    };

    const isAnyFiltersExist = (filters: Filters) => {
        return !!filters?.from || !!filters?.to || !!filters?.date || !!filters?.passengers;
    };

    const isMainFiltersExist = (filters: Filters) => {
        return !!filters?.from && !!filters?.to && !!filters?.date && !!filters?.passengers;
    };

    const onUpdatePopUpAccept = () => {
        onSearchTrips();
    };

    const onUpdatePopUpClose = () => {
        setIsShowUpdatePopup(false);
    };

    const onDirectionButtonClick = (type: 'forward' | 'back', isIncluded?: boolean) => {
        if (type === 'back' && isIncluded === false) {
            setPickedDirection('forward');
        } else {
            setPickedDirection(type);
        }
    };

    return <>
        <div className={style.search_view_container}>
            <div className={style.search_view}>
                <div className={style.search_title}>
                    <h1>Маршрутки по Беларуси</h1>
                    <span>Онлайн-сервис для поиска билетов</span>
                </div>
                <div className={style.direction_buttons}>
                    <DirectionButton onClick={onDirectionButtonClick.bind(null, 'forward')}
                                     picked={pickedDirection === 'forward'} title={'Туда'}/>
                    <DirectionButton onClick={onDirectionButtonClick.bind(null, 'back')}
                                     includable
                                     included={isAnyFiltersExist(filters.back)}
                                     picked={pickedDirection === 'back'} title={'Обратно'}/>
                </div>
                <div className={style.search_controls_container}>
                    <SearchViewForm prefix={pickedDirection} stationsOptions={stationsOptions}/>
                    <SearchButton disabled={isSearching || !isMainFiltersExist(filters.forward)}
                                  onClick={onSearchTrips}/>
                </div>
            </div>
        </div>
        {isSearching
            ? trips?.map(tripsInfo => {
                let {from, to, date, trips} = tripsInfo;
                let key = `${from}_${to}_${date}`;
                return <TripsView key={key} from={from} to={to} date={date} trips={trips}
                                  isTripsLoading={isSearching}/>;
            })
            : error
                ? <ErrorViewFailedRequest error={error}/>
                : trips
                    ? trips.map(tripsInfo => {
                        let {from, to, date, trips} = tripsInfo;
                        let key = `${from}_${to}_${date}`;
                        return <TripsView key={key} from={from} to={to} date={date} trips={trips}
                                          isTripsLoading={isSearching}/>;
                    })
                    : null}
        {isShowUpdatePopup
            ? <IntimationUpdatePopUp onAccept={onUpdatePopUpAccept} onClose={onUpdatePopUpClose}/>
            : null}
    </>;
};

export default SearchView;