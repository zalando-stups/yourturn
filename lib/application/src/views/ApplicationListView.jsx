import React from 'react';
import {Link} from 'react-router';
import HttpError from 'common/src/HttpError.jsx';
import FetchResult from 'common/src/FetchResult';

let Placeholder = React.createClass({
    render: function() {
        return  <ul className='applicationList u-placeholder'>
                    <li className='u-placeholder-text'>Thing</li>
                    <li className='u-placeholder-text'>Thing</li>
                    <li className='u-placeholder-text'>Thing</li>
                </ul>;
    }
});

export default React.createClass({
    propTypes: {
        applications: React.PropTypes.array.isRequired
    },
    render: function() {
        // TODO this should be done via stateGetter from flummox
        let {applications} = this.props;
        if (applications instanceof FetchResult) {
            return applications.isPending() ? <Placeholder /> : <HttpError error={applications.getResult()} />;
        }
        let apps = applications.toList().toJS();
        if (!apps.length) {
            return <div>There are no applications to display…</div>;
        }
        return  <ul className='applicationList'>
                    {apps
                        .sort( (a, b) => {
                            let aN = a.name.toLowerCase(),
                                bN = b.name.toLowerCase();
                            return aN < bN ?
                                    -1 : bN < aN ?
                                        1 : 0;
                        })
                        .map( app =>
                            <li key={app.id}>
                                <Link
                                    to='application-detail'
                                    params={{id: app.id}}
                                    key={app.id}>{app.name}</Link>
                            </li>
                    )}
                </ul>;
    }
});