import React, {useEffect, useState} from 'react';
import {makeRequest} from '../../request/request';
import {useHistory, useLocation} from 'react-router-dom';
import IntimationUpdatePopUp from "../IntimationUpdatePopUp";
import {getCgiKeyWithPrefix} from "./SearchViewFormBlock/SearchViewForm";
import {formatDateFromRuToEn} from "../ui/DateInput";
import {ITrip} from "../TripsView";
import {DIRECTIONS, FilterKeys, Filters} from "./types";
import SearchViewResults from "./SearchViewResults";
import {UPDATE_POPUP_TIMEOUT} from "./constants";
import SearchViewFormBlock from "./SearchViewFormBlock";

const SearchView = () => {
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);
    const [trips, setTrips] = useState<{ from: string, to: string, date: string, direction: DIRECTIONS, trips: ITrip[] }[] | null>(null);
    const [isShowUpdatePopup, setIsShowUpdatePopup] = useState<boolean>(false);
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
            searchTrips();
        }
    }, [filters]);

    const onUnIncludeBack = () => {
        setTrips(trips?.filter(tripObject => tripObject.direction !== DIRECTIONS.BACK) ?? []);

        let searchParams = new URLSearchParams(location.search);
        [FilterKeys.from, FilterKeys.to, FilterKeys.date, FilterKeys.passengers].forEach(filterKey => {
            searchParams.delete(getCgiKeyWithPrefix(filterKey, DIRECTIONS.BACK));
        });

        history.push(`${location.pathname}?${searchParams}`);
    };

    const searchTrips = () => {
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

    const onUpdatePopUpAccept = () => {
        searchTrips();
    };

    const onUpdatePopUpClose = () => {
        setIsShowUpdatePopup(false);
    };

    const isMainFiltersExist = (filters: Filters) => {
        return !!filters?.from && !!filters?.to && !!filters?.date && !!filters?.passengers;
    };

    return <>
        <SearchViewFormBlock filters={filters}
                             onUnIncludeBack={onUnIncludeBack}
                             isSearching={isSearching}
                             searchTrips={searchTrips}/>
        <SearchViewResults isSearching={isSearching} error={error} tripsObjects={trips}/>
        {isShowUpdatePopup
            ? <IntimationUpdatePopUp onAccept={onUpdatePopUpAccept} onClose={onUpdatePopUpClose}/>
            : null}
    </>;
};

export default SearchView;