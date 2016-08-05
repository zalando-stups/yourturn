import React from 'react';

class Test extends React.Component {
    render() {
        return (
            <div style = {{width: '100%', backgroundColor: '#808000'}}>
                {this.props.containerWidth}
                <div style = {{width: 600, backgroundColor: '#80A0A0'}}>
                    here be dragons
                </div>
            </div>
        )
    }
}

export default Test;