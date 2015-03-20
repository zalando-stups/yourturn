import React from 'react';
import {State} from 'react-router';
import FluxComponent from 'flummox/component';
import Application from './ApplicationView.jsx';

const ACTION_ID = 'applications',
      STORE_ID = 'applications';

export default React.createClass({
    mixins: [ State ],
    componentWillMount: function() {
        var {id} = this.getParams();
        this.props.flux.getActions(ACTION_ID).getApplication(id);
    },
    render: function() {
        var {id} = this.getParams();
        return  <FluxComponent
                    flux={this.props.flux}
                    connectToStores={STORE_ID}>
                    <Application application={id}/>
                </FluxComponent>
    }
})