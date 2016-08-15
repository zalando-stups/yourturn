import React from 'react';
/*eslint-disable */
class ApplicationLifeCycle extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div>
                <div>
                    Here be dragons!
                </div>
                <div>
                    ..and some props: {JSON.stringify(this.props, (k, v) => v, 2)}
                </div>
            </div>
        )
    }
}
/*eslint-enable */

ApplicationLifeCycle.displayName = 'ApplicationLifeCycle';

export default ApplicationLifeCycle;