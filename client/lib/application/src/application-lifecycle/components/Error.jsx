import React from 'react';

const Error = (props) => {
    return (
        <div style={{borderColor: '#EE3333', borderStyle: 'solid', borderWidth: '5px'}}>
            <h3>
                An error occured: {props.error}
            </h3>
        </div>)
};

Error.dispalyName = 'Error';

Error.propTypes = {
    error: React.PropTypes.string
};

export default Error;