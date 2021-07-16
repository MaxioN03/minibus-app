import React, {useEffect, useState} from 'react';
import './index.css';
import {makeRequest} from "../../request/request";
import {IOperator, IStation} from "../SearchView/SearchView";
import {Button} from "../ui/Button";

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
    isTripsLoading: boolean
}

const DEFAULT_SKELETONS_LENGTH = 3;

const TripsView = ({trips, isTripsLoading}: ITripsViewProps) => {
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

    const firstTrip = trips?.[0];
    let fromStation = stations?.find(station => station._id === firstTrip?.from);
    let toStation = stations?.find(station => station._id === firstTrip?.to);
    let departure = new Date(firstTrip?.departure);

    return <div className={'trips_view_container'}>
        {isTripsLoading || isLoading
            ? <>
                <div className={'direction_title_shimmer'}/>
                <div className={`trips_view ${isTripsLoading || isLoading ? 'loading' : ''}`}>
                    {new Array(trips?.length || DEFAULT_SKELETONS_LENGTH).fill(true).map((_, index) => <TripViewSkeleton index={index}/>)}
                </div>
            </>
            : firstTrip
                ? <>
                    <div
                        className={'direction-title'}>{fromStation?.name} - {toStation?.name}, {new Date(departure).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                    })}</div>
                    <div className={'trips_view'}>
                        {trips.map((trip, index) => <TripView index={index} key={`${trip.departure}_${trip.agent}`}
                                                              stations={stations || []} operators={operators || []}
                                                              trip={trip}/>)}
                    </div>
                </>
                : <div className={'no-results'}>По запросу ничего не найдено</div>
        }
    </div>;
};

export default TripsView;

interface ITripViewProps {
    trip: ITrip,
    stations: IStation[],
    operators: IOperator[],
    index: number
}

export const TripView = ({trip, stations, operators, index}: ITripViewProps) => {
    let {from, to, departure, agent, freeSeats, price, date, arrival} = trip;

    let fromStation = stations.find(station => station._id === from);
    let toStation = stations.find(station => station._id === to);
    let operator = operators.find(operator => operator._id === agent);

    const moveToAgentSource = () => {
        let url = null;
        switch (operator?.name.toLowerCase()) {
            case 'атлас':
                url = new URL(`https://atlasbus.by/Маршруты/${fromStation?.name}/${toStation?.name}`);
                let splittedDate = date.split('-');
                url.searchParams.set('date', [splittedDate[2], splittedDate[1], splittedDate[0]].join('-'));
                break;
            case 'alfa bus':
                url = new URL('https://alfa-bus.by/');
                break;
        }

        window.open(url?.toString() || '', '_blank')?.focus();
    };

    const getPlaceWord = (placeCount: number) => {
        if (placeCount >= 10 && placeCount <= 20) {
            return 'мест';
        }
        let lastNumber = placeCount % 10;
        switch (lastNumber) {
            case 0:
                return 'мест';
            case 1:
                return 'место';
            case 2:
            case 3:
            case 4:
                return 'места';
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
                return 'мест';
        }
    };

    return <div className={'trip_view'} style={{animationDelay: `${(index) / 25}s`}}>
        <div className={'trip_view__route_info'}>
            <div className={'trip_view__route_info_item'}>
                <div className={'title_from'}>
                    <div className={'title'}>Отправление</div>
                    {/*<div className={'duration_line'}></div>*/}
                </div>
                <div className={'time'}>{new Date(departure).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                })}</div>
                <div className={'station'}>{fromStation?.name}</div>
            </div>
            <div className={'trip_view__route_info_item'}>
                <div className={'title'}>Прибытие</div>
                <div className={'time'}>{arrival
                    ? new Date(arrival).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })
                    : '—'}</div>
                <div className={'station'}>{toStation?.name}</div>
            </div>
        </div>
        <div className={'trip_view__buy_info'}>
            <div className={'info_for_customer'}>
                <span className={'info_for_customer__cost'}>{price} BYN</span>
                <span className={'info_for_customer__places'}>{freeSeats} {getPlaceWord(freeSeats)}</span>
            </div>
            <Button className={'link_button'} onClick={moveToAgentSource}>{operator?.name}</Button>
        </div>
    </div>;
};

export const TripViewSkeleton = ({index}: { index: number }) => {
    return <div className={'trip_view_skeleton'} key={index}/>;
};
