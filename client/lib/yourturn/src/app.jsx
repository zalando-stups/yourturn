import React from 'react';
import Sidebar from './sidebar/sidebar.jsx';
import NotificationBar from './notification-bar/notification-bar.jsx';

class YourTurn extends React.Component {

    constructor(props) {
        super(props);

        this.state = {show: true};
        this.dismiss = this.dismiss.bind(this);
    }

    dismiss() {
        this.setState({show:false});
    }

    render() {
    return (<div className='yourturn'>
                <NotificationBar />
        <div className='grid with-gutter'>
                    <div className='grid-col col-1-4'>
                        <Sidebar
                            activeRoute={this.props.location.pathname} />
                    </div>
                    <div className='grid-col'>
                        {this.state.show ?
                            <div style={{backgroundColor: '#f08532'}} onClick={this.dismiss}>
                                <h4 style={{color: '#FFF', margin: '20px'}}>
                                    Please note that the GitHub approval flow obsoletes Kio versions, i.e. you don't have to maintain version information in Kio anymore. The corresponding API endpoints will be disabled on July 31st, 2017.<br />
                                    Click to dismiss!
                                </h4>
                            </div> : null
                        }
                        <div className='yourturn-view'>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>)
    }
};

YourTurn.displayName = 'YourTurn';

YourTurn.propTypes = {
    children: React.PropTypes.any,
    location: React.PropTypes.shape(
        {
            pathname: React.PropTypes.string
        }
    ).isRequired
};

export default YourTurn;
