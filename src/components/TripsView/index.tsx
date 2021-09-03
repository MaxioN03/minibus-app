import React, {useEffect, useState} from 'react';
import './index.css';
import {makeRequest} from "../../request/request";
import TripView from "./TripView";
import {IOperator, IStation} from "../SearchView/types";

export interface ITrip {
    from: string,
    to: string,
    date: string,
    departure: string,
    arrival?: string,
    freeSeats: number,
    price: number,
    agent: string,
}

interface ITripsViewProps {
    trips: ITrip[],
    from: string,
    to: string,
    date: string,
    isTripsLoading: boolean
}

const TripsView = ({from, to, date, trips, isTripsLoading}: ITripsViewProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [stations, setStations] = useState<IStation[] | null>(null);
    const [operators, setOperators] = useState<IOperator[] | null>(null);

    useEffect(() => {

        makeRequest('stations').then(stations => {
            setStations(stations);
        });
        makeRequest('operators').then(operators => {
            setOperators(operators);
        });

    }, []);

    useEffect(() => {
        if (stations && operators) {
            setIsLoading(false);
        }
    }, [stations, operators]);

    let fromStation = stations?.find(station => station._id === from);
    let toStation = stations?.find(station => station._id === to);
    let departure = new Date(date);

    return <div className={'trips_view_container'}>
        {isTripsLoading || isLoading
            ? <>
                <div className={'direction_title_shimmer'}/>
                {trips?.length
                    ? <div className={`trips_view ${isTripsLoading || isLoading ? 'loading' : ''}`}>
                        {[true, true, true].map((trip, index) => <div key={index} className={'trip_view_shimmer'}/>)}
                    </div>
                    : null}
            </>
            : from && to && date
                ? <>
                    <div className={'direction-title'}>
                        {fromStation?.name} - {toStation?.name}, {new Date(departure).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                    })}</div>
                    {trips?.length
                        ? <div className={'trips_view'}>
                            {trips.map((trip, index) => <TripView index={index} key={`${trip.departure}_${trip.agent}`}
                                                                  stations={stations || []} operators={operators || []}
                                                                  trip={trip}/>)}
                        </div>
                        : <div className={'no-results'}>По запросу ничего не найдено</div>}
                </>
                : null}
    </div>;
};

export default TripsView;