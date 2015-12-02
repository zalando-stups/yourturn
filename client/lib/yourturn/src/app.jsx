import React from 'react';
import {RouteHandler} from 'react-router';
import FLUX from 'yourturn/src/flux';
import FlummoxComponent from 'flummox/component';
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
                            <FlummoxComponent
                                flux={FLUX}
                                connectToStores={['user']}>
                                <Sidebar
                                    fullstopStore={FLUX.getStore('fullstop')}
                                    userActions={FLUX.getActions('user')}
                                    userStore={FLUX.getStore('user')} />
                            </FlummoxComponent>
                        </div>
                        <div className='grid-col'>
                            <div className='yourturn-view'>
                                <RouteHandler />
                            </div>
                        </div>
                    </div>
                </div>;
    }
}
YourTurn.displayName = 'YourTurn';

export default YourTurn;
