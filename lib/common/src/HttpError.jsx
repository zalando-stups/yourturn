import React from 'react';

let codes = {
    404: 'Not found'
};

let messages = {
    404: 'The thing you were looking for does not exist.'
};

export default React.createClass({
    propTypes: {
        status: React.PropTypes.number.isRequired
    },
    render: function() {
        let {status} = this.props;
        return  <div className='u-error'>
                    <h2>{status}—{codes[status]}</h2>
                    <p>
                        {messages[status]}
                    </p>
                </div>;
    }
});