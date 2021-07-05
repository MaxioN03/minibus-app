import React, {useEffect, useState} from 'react';
import './index.css';
import {makeRequest} from "../../request/request";
import {IOperator, IStation} from "../SearchView/SearchView";
import {Button} from "../ui/Button";

export interface ITrip {
    from: string,
    to: string,
    date: string,
    departureTime: string,
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
    return <div className={'trips_view_container'}>
        <div className={'trips_view'}>
            {trips.map(trip => <TripView key={`${trip.departureTime}_${trip.agent}`}
                                         stations={stations} operators={operators} trip={trip}/>)}
        </div>
    </div>;
};

export default TripsView;

interface ITripViewProps {
    trip: ITrip,
    stations: IStation[],
    operators: IOperator[]
}

export const TripView = ({trip, stations, operators}: ITripViewProps) => {
    let {from, to, departureTime, agent} = trip;

    let fromStation = stations.find(station => station._id === from);
    let toStation = stations.find(station => station._id === to);
    let operator = operators.find(operator => operator._id === agent);

    return <div className={'trip_view'}>
            <div className={'trip_view__route_info'}>
                <div className={'trip_view__route_info_item'}>
                    <div className={'title'}>Отправление</div>
                    <div className={'time'}>{departureTime}</div>
                    <div className={'station'}>{fromStation?.name}</div>
                </div>
                <div className={'trip_view__route_info_item'}>
                    <div className={'title'}>Прибытие</div>
                    <div className={'time'}/>
                    <div className={'station'}>{toStation?.name}</div>
                </div>
            </div>
            <div className={'trip_view__buy_info'}>
                <div className={'info_for_customer'}>
                    <span className={'info_for_customer__cost'}>11 BYN</span>
                    <span className={'info_for_customer__places'}>5+ мест</span>
                </div>
                <Button className={'link_button'} onClick={() => {}}>{operator?.name}</Button>
            </div>
        </div>
};
