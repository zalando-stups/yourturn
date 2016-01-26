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

    componentDidMount() {
        let boundListener = _.debounce(this._scrollHandler.bind(this), this.props.debounceMs || 100);
        window.addEventListener('scroll', boundListener);
        this._scrollHandler();
        this.setState({
            listener: boundListener
        });
    }

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
    debounceMs: number,
    scrollOffset: number,
    hasMore: bool,
    lastPage: number,
    onLoad: func,
    loader: object
};
export default Infinity;
