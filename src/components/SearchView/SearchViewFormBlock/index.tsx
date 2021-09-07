import React, {useEffect, useState} from 'react';
import style from "./index.module.css";
import {makeRequest} from '../../../request/request';
import {IOption} from '../../ui/Select';
import {SearchButton} from '../../ui/Button/SearchButton';
import {useHistory, useLocation} from 'react-router-dom';
import {DirectionButton} from "../../ui/Button/DirectionButton";
import {SearchViewForm} from "./SearchViewForm";
import {DIRECTIONS, Filters, IStation} from "../types";

interface ISearchViewFormBlockProps {
    filters: { [DIRECTIONS.FORWARD]: Filters, [DIRECTIONS.BACK]: Filters },
    onUnIncludeBack: () => void,
    searchTrips: () => void,
    isSearching: boolean,
}

const SearchViewFormBlock = ({filters, onUnIncludeBack, isSearching, searchTrips}: ISearchViewFormBlockProps) => {
    const [stationsOptions, setStationsOptions] = useState<IOption[]>([]);
    const [pickedDirection, setPickedDirection] = useState<DIRECTIONS.FORWARD | DIRECTIONS.BACK>(DIRECTIONS.FORWARD);

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

    const onDirectionButtonClick = (type: DIRECTIONS.FORWARD | DIRECTIONS.BACK, isIncluded?: boolean | null) => {
        if (type === DIRECTIONS.BACK) {
            if (isIncluded) {
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
            } else if (isIncluded === false) {
                setPickedDirection(DIRECTIONS.FORWARD);
            } else {
                setPickedDirection(type);
            }
        } else {
            setPickedDirection(type);
        }
    };

    const isAnyFiltersExist = (filters: Filters) => {
        return !!filters?.from || !!filters?.to || !!filters?.date || !!filters?.passengers;
    };

    const isMainFiltersExist = (filters: Filters) => {
        return !!filters?.from && !!filters?.to && !!filters?.date && !!filters?.passengers;
    };

    return <div className={style.search_view_container}>
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
                <SearchButton disabled={isSearching
                || (!isMainFiltersExist(filters[DIRECTIONS.FORWARD]) && !isMainFiltersExist(filters[DIRECTIONS.BACK]))}
                              onClick={searchTrips}/>
            </div>
        </div>
    </div>;
};

export default SearchViewFormBlock;