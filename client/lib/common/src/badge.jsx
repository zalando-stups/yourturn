import React from 'react';
import 'common/asset/less/common/badge.less';

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

class Badge extends React.Component {
    constructor() {
        super();
    }
    render() {
        return <span className={'badge' + (this.props.isDanger ? ' is-danger' : '')}>
                    {format(this.props.number)}
                </span>;
    }
}

export default Badge;