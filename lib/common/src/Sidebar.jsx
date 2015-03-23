import React from 'react';
import _ from 'lodash';

import 'common/asset/scss/common/sidebar.scss';

/**
 * Simple wrapper for items in the sidebar.
 */
var SidebarItem = React.createClass({
    render: function() {
        return  <div className='sidebar-item'>
                    {this.props.children}
                </div>;
    }
});

export default React.createClass({
    render: function() {
        var {children} = this.props;
        if (!_.isArray(children)) {
            children = [ children ];
        }
        return  <aside className='sidebar'>
                    <div className='sidebar-content'>
                        {children.map( (c, i) =>
                            <SidebarItem key={i}>{c}</SidebarItem>
                        )}
                    </div>
                </aside>;
    }
});