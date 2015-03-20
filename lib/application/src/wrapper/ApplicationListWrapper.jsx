import React from 'react';
import {State} from 'react-router';
import Flux from '../data/Flux';
import FluxComponent from 'flummox/component';
import ListView from '../views/ApplicationListView.jsx';
import {FLUX_ID} from '../config';

export default React.createClass({
    componentWillMount: function() {
        Flux.getActions(FLUX_ID).getApplications();
    },
    render: function() {
        return  <FluxComponent
                    flux={Flux}
                    connectToStores={FLUX_ID}>
                    <ListView />
                </FluxComponent>;
    }
})