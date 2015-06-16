import React from 'react';
import {RouteHandler} from 'react-router';
import FlummoxComponent from 'flummox/component';
import Sidebar from './sidebar/sidebar.jsx';
import NotificationBar from './notification-bar/notification-bar.jsx';

class YourTurn extends React.Component {
    constructor() {
        super();
    }

    render() {
        let flux = this.props.globalFlux;
        return <div className='yourturn'>
                    <FlummoxComponent
                        flux={flux}
                        connectToStores={['notification']}>
                        <NotificationBar />
                    </FlummoxComponent>
                    <div className='grid with-gutter'>
                        <div className='grid-col col-1-4'>
                            <FlummoxComponent
                                flux={flux}
                                connectToStores={['user']}>
                                <Sidebar />
                            </FlummoxComponent>
                        </div>
                        <div className='grid-col'>
                            <div className='yourturn-view'>
                                <RouteHandler
                                    globalFlux={this.props.globalFlux} />
                            </div>
                        </div>
                    </div>
                </div>;
    }
}

export default YourTurn;