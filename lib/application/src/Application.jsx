import React from 'react';
import {RouteHandler} from 'react-router';
import Flux from './data/Flux';

var appFlux = new Flux();

export default React.createClass({
    render: function() {
        return  <div className="yourturn-application">
                    <RouteHandler flux={appFlux} />
                </div>;
    }
});