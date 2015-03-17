import React from 'react';

import 'common/asset/scss/application.scss';

export default React.createClass({
    getInitialState: function() {
        return {
            count: 0
        };
    },
    _handleClick: function() {
        this.setState({
            count: this.state.count + 1
        });
    },
    render: function() {
        return  <div>
                    <h1>Hello World {this.state.count}!</h1>
                    <button onClick={this._handleClick}>
                        More
                    </button>
                </div>;
    }
});