import React from 'react';

let codes = {
    404: 'Not found'
};

let messages = {
    404: 'The thing you were looking for does not exist.'
};

export default React.createClass({
    propTypes: {
        error: React.PropTypes.object.isRequired
    },
    render: function() {
        let {error} = this.props;
        return  <div className='u-error'>
                    <h2>{error.status ? `${error.status}—${codes[error.status]}` : 'Error' }</h2>
                    <small>
                        {messages[error.status]}
                    </small>
                    <p>{error.message}</p>
                </div>;
    }
});