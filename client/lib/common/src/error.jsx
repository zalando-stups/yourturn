import React from 'react';
import 'common/asset/less/common/error.less';

class DefaultError extends React.Component {
    constructor() {
        super();
    }

    render() {
        let {status, name, message} = this.props.error;
        return  <div className='u-error'>
                    <h2>{status}—{name}</h2>
                    <p>{message}</p>
                </div>;
    }
}

export default DefaultError;