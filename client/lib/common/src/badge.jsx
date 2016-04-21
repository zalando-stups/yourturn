import React from 'react';
import 'common/asset/less/common/badge.less';

class Badge extends React.Component {
    constructor() {
        super();
    }
    render() {
        return <span
                    style={this.props.style}
                    className={'badge' + (this.props.isDanger ? ' is-danger' : ' is-info')}>
                    {this.props.children}
                </span>;
    }
}
Badge.displayName = 'Badger'; // mushroom mushroom
Badge.propTypes = {
    isDanger: React.PropTypes.bool
};

export default Badge;