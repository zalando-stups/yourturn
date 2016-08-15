import React from 'react';
import 'common/asset/less/common/badge.less';

const Badge = (props) => {
    return (<span
                style={props.style}
                className={'badge' + (props.isDanger ? ' is-danger' : ' is-info')}>
                {props.children}
            </span>)
};

Badge.displayName = 'Badger'; // mushroom mushroom

Badge.propTypes = {
    children: React.PropTypes.any,
    isDanger: React.PropTypes.bool,
    style: React.PropTypes.object
};

export default Badge;