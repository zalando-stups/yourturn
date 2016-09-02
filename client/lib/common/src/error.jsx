import React from 'react';
import 'common/asset/less/common/error.less';

const DefaultError = (props) => {
    const {status, name, message} = props.error;
    const headline = `${status ? status : ''}${(status && name) ? '-' : ''}${name ? name : ''}`;
    return (<div className='u-error'>
                <h2>{headline}</h2>
                <p>{message}</p>
            </div>)
};

DefaultError.displayName = 'DefaultError';

DefaultError.propTypes = {
    error: React.PropTypes.shape({
        status: React.PropTypes.string, 
        name: React.PropTypes.string, 
        message: React.PropTypes.string
    }).isRequired
};

export default DefaultError;