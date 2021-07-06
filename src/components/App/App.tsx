import React from 'react';
import './index.css';
import SearchView from '../SearchView/SearchView';
import {
    BrowserRouter as Router,
} from "react-router-dom";
import Footer from "../Footer/Footer";

const App = () => {
    return <div>
        <Router>
            <SearchView/>
            <Footer/>
        </Router>
    </div>;
};

export default App;
