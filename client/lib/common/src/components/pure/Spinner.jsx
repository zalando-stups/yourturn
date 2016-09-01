import React from 'react';

import Icon from 'react-fa';

const Spinner = (props) => {
    return (
        <Icon spin size={props.size} name='circle-o-notch' />
    );
};

Spinner.displayName = 'Spinner';

Spinner.propTypes = {
    size: React.PropTypes.string
};

Spinner.defaultProps = {
    size: '1x'
};

export default Spinner;