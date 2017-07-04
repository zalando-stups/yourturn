import React from 'react';

class DeprecationWarning extends React.Component {

    render() {
        return (
            <div style={{backgroundColor: '#f08532'}}>
                <div style={{display: 'flex'}}>
                    <h4 style={{color: '#FFF', margin: '20px'}}>
                        Please note that the GitHub approval flow obsoletes Kio versions, i.e. you don't have to
                        maintain version information in Kio anymore. The corresponding API endpoints will be disabled on
                        July 31st, 2017.
                    </h4>
                </div>
            </div>
        )
    }
}

DeprecationWarning.displayName = 'DeprecationWarning';

export default DeprecationWarning;
