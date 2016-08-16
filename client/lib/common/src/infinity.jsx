import React from 'react';
import _ from 'lodash';

class Infinity extends React.Component {
    constructor() {
        super();
        this.state = {
            listener: null
        };
    }

    _scrollHandler() {
        let rect = this.refs.container.getBoundingClientRect(),
            {innerHeight} = window;

        if (rect.bottom - (this.props.scrollOffset || 0) < innerHeight && this.props.hasMore) {
            this.props.onLoad(this.props.lastPage + 1);
        }
    }

    /*eslint-disable react/no-did-mount-set-state */
    // TODO does it have to be this way?
    componentDidMount() {
        let boundListener = _.debounce(this._scrollHandler.bind(this), this.props.debounceMs || 100);
        window.addEventListener('scroll', boundListener);
        this._scrollHandler();
        this.setState({
            listener: boundListener
        });
    }
    /*eslint-enable react/no-did-mount-set-state */

    componentWillUnmount() {
        window.removeEventListener('scroll', this.state.listener);
    }

    render() {
        return <div ref='container' className='infinity'>
                {this.props.children}
                {this.props.hasMore ? this.props.loader : null}
            </div>;
    }
}
var {PropTypes} = React,
    {func, number, object, bool} = PropTypes;
Infinity.displayName = 'Infinity';
Infinity.propTypes = {
    children: React.PropTypes.any,
    debounceMs: number,
    hasMore: bool,
    lastPage: number,
    loader: object,
    onLoad: func,
    scrollOffset: number
};
export default Infinity;
