import React from 'react';

const Error = (props) => {
    console.log('Error %O', props);
    return (
        <div style={{backgroundColor: '#EE3333'}}>
            {props.error}
        </div>)
};

Error.dispalyName = 'Error';

Error.propTypes = {
    
};

export default Error;