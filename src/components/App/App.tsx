import React from 'react';
import './index.css';
import SearchView from '../SearchView/SearchView';
import {
    BrowserRouter as Router,
} from "react-router-dom";

const App = () => {
    return <div>
        <Router>
            <SearchView/>
        </Router>
    </div>;
};

export default App;
