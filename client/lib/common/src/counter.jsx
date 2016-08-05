// based on https://github.com/saebekassebil/react-counter
// seems inactive :(
import React from 'react';
import raf from 'raf';
import ease from 'ease-component';

function format(number) {
    if (number > Math.pow(10, 9)) {
        return '∞';
    }
    if (number > Math.pow(10, 6)) {
        return `${(number / Math.pow(10, 6)).toFixed(2)}M`;
    } else if (number > 1000) {
        return `${(number / 1000).toFixed(2)}K`;
    }
    return String(number);
}

class Counter extends React.Component {
    constructor(props) {
        super();
        this.state = {
            value: props.begin,
            stop: false,
            start: Date.now(),
            easing: props.easing,
            time: props.time,
            begin: props.begin,
            end: props.end,
            mounted: false
        };
    }

    componentWillReceiveProps(nextProps) {
        let {time, begin, end, easing} = nextProps;
        if (begin !== this.props.begin || end !== this.props.end) {
            this.setState({
                time,
                begin,
                end,
                easing,
                start: Date.now(),
                stop: false
            });
            this._draw();
            raf(this._animate.bind(this));
        }
    }

    componentDidMount() {
        this.setState({
            mounted: true,
            start: Date.now(),
            stop: false
        });
        this._draw();
        raf(this._animate.bind(this));
    }

    _draw() {
        if (!this.state.mounted) {
            return;
        }
        let {time, begin, start, end, easing} = this.state,
            now = Date.now(),
            percentage = (now - start) / time;

        easing = easing && easing in ease ? easing : 'outCube';
        percentage = percentage > 1 ? 1 : percentage;
        let easeVal = ease[easing](percentage),
            val = begin + (end - begin) * easeVal;
        this.setState({
          value: val,
          stop: val >= end
        });
    }

    _animate() {
        if (this.state.stop) {
            return;
        }
        this._draw();
        raf(this._animate.bind(this));
    }

    render() {
        return <span className='counter'>{format(Math.round(this.state.value))}</span>;
    }
}

Counter.displayName = 'Counter';

Counter.propTypes = {
    begin: React.PropTypes.number,
    end: React.PropTypes.number,
    time: React.PropTypes.number
};

export default Counter;
