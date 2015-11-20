import React from 'react';
import 'common/asset/less/common/badge.less';

class Badge extends React.Component {
    constructor() {
        super();
    }
    render() {
        return <span className={'badge' + (this.props.isDanger ? ' is-danger' : '')}>
                    {this.props.children}
                </span>;
    }
}

export default Badge;