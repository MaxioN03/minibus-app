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
    trips: ITrip[]
}

const TripsView = ({trips}: ITripsViewProps) => {
    const [stations, setStations] = useState<IStation[]>([]);
    const [operators, setOperators] = useState<IOperator[]>([]);

    useEffect(() => {
        makeRequest('stations').then(stations => {
            setStations(stations);
        });
        makeRequest('operators').then(operators => {
            setOperators(operators);
        });

    }, []);

    const firstTrip = trips?.[0];
    let fromStation = stations.find(station => station._id === firstTrip?.from);
    let toStation = stations.find(station => station._id === firstTrip?.to);
    let departure = new Date(firstTrip?.departure);

    return <div className={'trips_view_container'}>
        {firstTrip
            ? <>
                <div
                    className={'direction-title'}>{fromStation?.name} - {toStation?.name}, {new Date(departure).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                })}</div>
                <div className={'trips_view'}>
                    {trips.map(trip => <TripView key={`${trip.departure}_${trip.agent}`}
                                                 stations={stations} operators={operators} trip={trip}/>)}
                </div>
            </>
            : <div className={'no-results'}>По запросу ничего не найдено</div>}
    </div>;
};

export default TripsView;

interface ITripViewProps {
    trip: ITrip,
    stations: IStation[],
    operators: IOperator[]
}

export const TripView = ({trip, stations, operators}: ITripViewProps) => {
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

    return <div className={'trip_view'}>
        <div className={'trip_view__route_info'}>
            <div className={'trip_view__route_info_item'}>
                <div className={'title'}>Отправление</div>
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
                <span className={'info_for_customer__places'}>{freeSeats} мест</span>
            </div>
            <Button className={'link_button'} onClick={moveToAgentSource}>{operator?.name}</Button>
        </div>
    </div>;
};
