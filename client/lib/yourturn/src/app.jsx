import React from 'react';
import Sidebar from './sidebar/sidebar.jsx';
import NotificationBar from './notification-bar/notification-bar.jsx';
import DeprecationWarning from '../../common/src/components/DeprecationWarning.jsx'

const YourTurn = (props) => {
    return (<div className='yourturn'>
        <NotificationBar />
        <div className='grid with-gutter'>
            <div className='grid-col col-1-4'>
                <Sidebar activeRoute={props.location.pathname} />
            </div>
            <div className='grid-col'>
                {props.location.pathname === '/' ?
                    <DeprecationWarning /> : null
                }
                <div className='yourturn-view'>
                    {props.children}
                </div>
            </div>
        </div>
    </div>);
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
