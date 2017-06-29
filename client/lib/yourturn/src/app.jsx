import React from 'react';
import Sidebar from './sidebar/sidebar.jsx';
import NotificationBar from './notification-bar/notification-bar.jsx';
import DeprecationWarning from '../../common/src/components/DeprecationWarning.jsx'

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
                        {this.props.location.pathname === '/' ?
                            <DeprecationWarning dismissable={false} /> : null
                        }
                        <div className='yourturn-view'>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>)
    }
}

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
