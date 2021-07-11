import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './home/Home';

export default function Controller() {

    const baseUrl = "/api/v1/";

    return (
        <Router>
            <div className="main-container">
                <Route exact path="/" render={(props) => <Home {...props} baseUrl={baseUrl}/>}/>
            </div>
        </Router>
    );
}