import React from 'react';

import 'asset/scss/app.scss';


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        };
    }

    _handleClick() {
        this.setState({
            count: this.state.count + 1
        });
    }

    render() {
        return  <div>
                    <h1>Hello World {this.state.count}!</h1>
                    <button onClick={this._handleClick.bind(this)}>
                        More
                    </button>
                </div>;
    }
}