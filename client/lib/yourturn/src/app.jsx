import React from 'react';
import Sidebar from './sidebar/sidebar.jsx';
import NotificationBar from './notification-bar/notification-bar.jsx';

class YourTurn extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <div className='yourturn'>
                    <NotificationBar />
                    <div className='grid with-gutter'>
                        <div className='grid-col col-1-4'>
                            <Sidebar
                                activeRoute={this.props.location.pathname} />
                        </div>
                        <div className='grid-col'>
                            <div className='yourturn-view'>
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                </div>;
    }
}
YourTurn.displayName = 'YourTurn';

export default YourTurn;
