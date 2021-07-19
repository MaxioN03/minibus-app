import React from 'react';
import './index.css';
import SearchView from '../SearchView/SearchView';
import {
    HashRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Footer from "../Footer/Footer";
import ErrorViewNotFound from "../ErrorViewNotFound";
import ErrorViewGlobalError from "../ErrorViewGlobalError";

export default class App extends React.Component<{}, { error: Error | null }> {
    state = {
        error: null
    };

    componentDidCatch(error: any, errorInfo: any) {
        console.log('error', error);
        console.log('errorInfo', errorInfo);
    }

    static getDerivedStateFromError(error: Error) {
        return {error};
    }

    render() {
        if (this.state.error) {
            console.log('this.state.error', this.state.error);
        }

        return <>
            <Router>
                {this.state.error
                    ? <ErrorViewGlobalError/>
                    : <Switch>
                        <Route path={'/'} exact component={SearchView}/>
                        <Route component={ErrorViewNotFound}/>
                    </Switch>}
            </Router>
            <Footer/>
        </>;
    }
};
