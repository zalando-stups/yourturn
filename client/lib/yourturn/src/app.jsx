import React from 'react';
import {RouteHandler} from 'react-router';
import REDUX from 'yourturn/src/redux';
import FLUX from 'yourturn/src/flux';
import FlummoxComponent from 'flummox/component';
import {Provider} from 'react-redux';
import Sidebar from './sidebar/sidebar.jsx';
import NotificationBar from './notification-bar/notification-bar.jsx';


class YourTurn extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <div className='yourturn'>
                    <Provider store={REDUX}>
                        {() => <NotificationBar />}
                    </Provider>
                    <div className='grid with-gutter'>
                        <div className='grid-col col-1-4'>
                            <FlummoxComponent
                                flux={FLUX}
                                connectToStores={['user']}>
                                <Sidebar
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