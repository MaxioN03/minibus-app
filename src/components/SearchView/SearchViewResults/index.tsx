import React, {useEffect, useState} from 'react';
import style from "./index.module.css";
import ErrorViewFailedRequest from "../../ErrorViewFailedRequest";
import {Switcher} from "../../ui/Switcher";
import TripsView, {ITrip} from "../../TripsView";
import {DIRECTIONS} from "../types";

interface ISearchViewResultsProps {
    isSearching: boolean,
    error: any,
    tripsObjects: { from: string, to: string, date: string, direction: DIRECTIONS, trips: ITrip[] }[] | null,
}

const SearchViewResults = ({isSearching, error, tripsObjects}: ISearchViewResultsProps) => {
    const [pickedResult, setPickedResult] = useState<string>(DIRECTIONS.FORWARD);

    useEffect(() => {
        let existingResult = tripsObjects?.find(tripsObject => tripsObject.direction);
        setPickedResult(existingResult?.direction ?? DIRECTIONS.FORWARD);
    }, [tripsObjects]);

    const isBackTripsExist = () => !!tripsObjects?.find(tripObject => tripObject.direction === DIRECTIONS.BACK);

    let currentResultObject = tripsObjects?.find(trip => trip.direction === pickedResult);

    return <>
        {tripsObjects?.length
            ? <div className={style.results_switcher_container}>
                <Switcher onClick={setPickedResult} disabled={!isBackTripsExist()} options={[
                    {value: DIRECTIONS.FORWARD, selected: pickedResult === DIRECTIONS.FORWARD, text: 'Туда'},
                    {value: DIRECTIONS.BACK, selected: pickedResult === DIRECTIONS.BACK, text: 'Обратно'},
                ]}/>
            </div>
            : null}
        {error
            ? <ErrorViewFailedRequest error={error}/>
            : <TripsView key={`${currentResultObject?.from}_${currentResultObject?.to}_${currentResultObject?.date}`}
                         from={currentResultObject?.from ?? ''} to={currentResultObject?.to ?? ''}
                         date={currentResultObject?.date ?? ''} trips={currentResultObject?.trips ?? []}
                         isTripsLoading={isSearching}/>}
    </>;
};

export default SearchViewResults;