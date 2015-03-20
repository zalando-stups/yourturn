import React from 'react';
import {State} from 'react-router';
import FluxComponent from 'flummox/component';
import ListView from './ApplicationListView.jsx';

const ACTION_ID = 'applications',
      STORE_ID = 'applications';

export default React.createClass({
    componentWillMount: function() {
        this.props.flux.getActions(ACTION_ID).getApplications();
    },
    render: function() {
        return  <FluxComponent
                    flux={this.props.flux}
                    connectToStores={STORE_ID}>
                    <ListView />
                </FluxComponent>
    }
})