import React from 'react';
import Icon from 'react-fa';

class DeprecationWarning extends React.Component {
    constructor(props) {
        super(props);

        this.state = {show: true};
        this.handleDismiss = this.handleDismiss.bind(this);
    }

    handleDismiss() {
        this.setState({show:false});
    }


    render() {
        return (
            this.state.show ?
                <div style={{backgroundColor: '#f08532'}}>
                    <div style={{display:'flex'}}>
                        <h4 style={{color: '#FFF', margin: '20px'}}>
                            Please note that the GitHub approval flow obsoletes Kio versions, i.e. you don't have to maintain version information in Kio anymore. The corresponding API endpoints will be disabled on July 31st, 2017.
                        </h4>
                        {this.props.dismissable ?
                            <div onClick={this.handleDismiss} >
                                <Icon fixedWidth name='times' />
                            </div> : null}
                    </div>
                </div> : null
        )
    }
}

DeprecationWarning.displayName = 'DeprecationWarning';

DeprecationWarning.propTypes = {
    dismissable: React.PropTypes.bool
};

export default DeprecationWarning;