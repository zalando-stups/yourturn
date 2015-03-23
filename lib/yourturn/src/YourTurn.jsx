import React from 'react';
import Sidebar from 'common/src/Sidebar.jsx';
import {Link, RouteHandler} from 'react-router';

import 'common/asset/scss/grid.scss';
import 'common/asset/scss/yourturn/yourturn.scss';

export default React.createClass({
    render: function() {
        return  <div className='yourturn'>
                    <div className='grid with-gutter'>
                        <div className='grid-col col-1-4'>
                            <Sidebar>
                                <Link to='application'>
                                    Applications
                                </Link>
                            </Sidebar>
                        </div>
                        <div className='grid-col'>
                            <div className='yourturn-view'>
                                <RouteHandler />
                            </div>
                        </div>
                    </div>
                </div>;
    }
});