import React from 'react';
import {State} from 'react-router';
import Flux from '../data/Flux';
import FluxComponent from 'flummox/component';
import Application from '../views/ApplicationDetailView.jsx';
import {FLUX_ID} from '../config';

export default React.createClass({
    mixins: [ State ],
    componentWillMount: function() {
        var {id} = this.getParams();
        Flux.getActions(FLUX_ID).getApplication(id);
    },
    render: function() {
        var {id} = this.getParams();
        return  <FluxComponent
                    flux={Flux}
                    connectToStores={FLUX_ID}>
                    <Application application={id}/>
                </FluxComponent>;
    }
})