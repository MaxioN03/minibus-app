import React, {useEffect, useState} from 'react';
import style from "./index.module.css";
import {makeRequest} from '../../request/request';
import {IOption} from '../ui/Select';
import {SearchButton} from '../ui/Button/SearchButton';
import {useHistory, useLocation} from 'react-router-dom';
import ErrorViewFailedRequest from "../ErrorViewFailedRequest";
import IntimationUpdatePopUp from "../IntimationUpdatePopUp";
import {DirectionButton} from "../ui/Button/DirectionButton";
import {getCgiKeyWithPrefix, SearchViewForm} from "./SearchViewForm";
import {formatDateFromRuToEn} from "../ui/DateInput";
import {Switcher} from "../ui/Switcher";
import TripsView, {ITrip} from "../TripsView";

enum DIRECTIONS {
    FORWARD = 'forward',
    BACK = 'back',
}

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
    const [trips, setTrips] = useState<{ from: string, to: string, date: string, direction: DIRECTIONS, trips: ITrip[] }[] | null>(null);
    const [error, setError] = useState<any>(null);
    const [isShowUpdatePopup, setIsShowUpdatePopup] = useState<boolean>(false);
    const [pickedDirection, setPickedDirection] = useState<DIRECTIONS.FORWARD | DIRECTIONS.BACK>(DIRECTIONS.FORWARD);
    const [pickedResult, setPickedResult] = useState<string>(DIRECTIONS.FORWARD);
    const [stationsOptions, setStationsOptions] = useState<IOption[]>([]);
    const [filters, setFilters] = useState<{ [DIRECTIONS.FORWARD]: Filters, [DIRECTIONS.BACK]: Filters }>({
        [DIRECTIONS.FORWARD]: {
            from: null,
            to: null,
            date: null,
            passengers: null,
        },
        [DIRECTIONS.BACK]: {
            from: null,
            to: null,
            date: null,
            passengers: null,
        }
    });

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
        let newFilters: { [DIRECTIONS.FORWARD]: Filters, [DIRECTIONS.BACK]: Filters } = {
            [DIRECTIONS.FORWARD]: {
                from: null,
                to: null,
                date: null,
                passengers: null,
            },
            [DIRECTIONS.BACK]: {
                from: null,
                to: null,
                date: null,
                passengers: null,
            },
        };

        let searchParams = new URLSearchParams(location.search);

        [FilterKeys.from, FilterKeys.to, FilterKeys.date, FilterKeys.passengers].forEach(cgiFilterKey => {
            const directionKey: (DIRECTIONS.FORWARD | DIRECTIONS.BACK)[] = [DIRECTIONS.FORWARD, DIRECTIONS.BACK];
            directionKey.forEach(directionKey => {
                newFilters[directionKey][cgiFilterKey] = searchParams.get(getCgiKeyWithPrefix(cgiFilterKey, directionKey));
            });
        });

        setFilters(newFilters);
    }, [location]);

    useEffect(() => {
        if (isMainFiltersExist(filters[DIRECTIONS.FORWARD]) || isMainFiltersExist(filters[DIRECTIONS.BACK])) {
            onSearchTrips();
        }
    }, [filters]);

    const onUnIncludeBack = () => {
        setTrips(trips?.filter(tripObject => tripObject.direction !== DIRECTIONS.BACK) ?? []);

        let searchParams = new URLSearchParams(location.search);
        [FilterKeys.from, FilterKeys.to, FilterKeys.date, FilterKeys.passengers].forEach(filterKey => {
            searchParams.delete(getCgiKeyWithPrefix(filterKey, DIRECTIONS.BACK));
        });
        console.log(`${location.pathname}?${searchParams}`);
        history.push(`${location.pathname}?${searchParams}`);
    };

    const onSearchTrips = () => {
        setIsSearching(true);
        setError(null);
        clearTimeout(updateTimer);
        setIsShowUpdatePopup(false);

        const getRequestByPrefix = (prefix: DIRECTIONS.FORWARD | DIRECTIONS.BACK) => {
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
                        direction: prefix,
                        passengers: filtersByDirection?.[FilterKeys.passengers],
                        trips
                    });

                } catch (error) {
                    reject(error);
                }
            });
        };

        Promise.all([
            ...(isMainFiltersExist(filters[DIRECTIONS.FORWARD]) ? [getRequestByPrefix(DIRECTIONS.FORWARD)] : []),
            ...(isMainFiltersExist(filters[DIRECTIONS.BACK]) ? [getRequestByPrefix(DIRECTIONS.BACK)] : []),
        ])
            .finally(() => {
                setIsSearching(false);
                updateTimer = setTimeout(() => {
                    setIsShowUpdatePopup(true);
                }, UPDATE_POPUP_TIMEOUT);
            })
            .then((trips: any[]) => {
                setTrips(trips);
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

    const onDirectionButtonClick = (type: DIRECTIONS.FORWARD | DIRECTIONS.BACK, isIncluded?: boolean) => {
        if (type === DIRECTIONS.BACK) {
            if (!isIncluded) {
                setPickedDirection(DIRECTIONS.FORWARD);
            } else {
                let forwardFilterObject = filters?.[DIRECTIONS.FORWARD];
                let searchParams = new URLSearchParams(location.search);

                if (forwardFilterObject?.to !== null) {
                    searchParams.set(`back_from`, forwardFilterObject.to.toString());
                }
                if (forwardFilterObject?.from !== null) {
                    searchParams.set(`back_to`, forwardFilterObject.from.toString());
                }
                if (forwardFilterObject?.passengers !== null) {
                    searchParams.set(`back_passengers`, forwardFilterObject.passengers.toString());
                }
                history.push(`${location.pathname}?${searchParams}`);

                setPickedDirection(type);
            }
        } else {
            setPickedDirection(type);
        }
    };

    const isBackTripsExist = () => !!trips?.find(tripObject => tripObject.direction === DIRECTIONS.BACK);

    const onChangePickedResult = (value: string) => {
        if (value === DIRECTIONS.BACK) {
            if (isBackTripsExist()) {
                setPickedResult(value);

            }
        } else {
            setPickedResult(value);
        }
    };

    let currentObject = trips?.find(trip => trip.direction === pickedResult);

    return <>
        <div className={style.search_view_container}>
            <div className={style.search_view}>
                <div className={style.search_title}>
                    <h1>Маршрутки по Беларуси</h1>
                    <span>Онлайн-сервис для поиска билетов</span>
                </div>
                <div className={style.direction_buttons}>
                    <DirectionButton onClick={onDirectionButtonClick.bind(null, DIRECTIONS.FORWARD)}
                                     picked={pickedDirection === DIRECTIONS.FORWARD} title={'Туда'}/>
                    <DirectionButton onClick={onDirectionButtonClick.bind(null, DIRECTIONS.BACK)}
                                     includable
                                     included={isAnyFiltersExist(filters[DIRECTIONS.BACK])}
                                     onUnInclude={onUnIncludeBack}
                                     picked={pickedDirection === DIRECTIONS.BACK} title={'Обратно'}/>
                </div>
                <div className={style.search_controls_container}>
                    <SearchViewForm prefix={pickedDirection} stationsOptions={stationsOptions}/>
                    <SearchButton disabled={isSearching || !isMainFiltersExist(filters[DIRECTIONS.FORWARD])}
                                  onClick={onSearchTrips}/>
                </div>
            </div>
        </div>
        <div className={style.results_switcher_container}>
            <Switcher onClick={onChangePickedResult} disabled={!isBackTripsExist()} options={[
                {value: DIRECTIONS.FORWARD, selected: pickedResult === DIRECTIONS.FORWARD, text: 'Туда'},
                {value: DIRECTIONS.BACK, selected: pickedResult === DIRECTIONS.BACK, text: 'Обратно'},
            ]}/>
        </div>
        {error
            ? <ErrorViewFailedRequest error={error}/>
            : <TripsView key={`${currentObject?.from}_${currentObject?.to}_${currentObject?.date}`}
                         from={currentObject?.from ?? ''} to={currentObject?.to ?? ''}
                         date={currentObject?.date ?? ''} trips={currentObject?.trips ?? []}
                         isTripsLoading={isSearching}/>}
        {isShowUpdatePopup
            ? <IntimationUpdatePopUp onAccept={onUpdatePopUpAccept} onClose={onUpdatePopUpClose}/>
            : null}
    </>;
};

export default SearchView;