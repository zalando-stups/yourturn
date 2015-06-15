import React from 'react';
import _ from 'lodash';
import 'common/asset/less/application/application-list.less';

class ApplicationList extends React.Component {
    constructor(props) {
        super();
        this.stores = {
            kio: props.flux.getStore('kio'),
            user: props.globalFlux.getStore('user')
        };
        this.state = {
            term: ''
        };

        this._forceUpdate = this.forceUpdate.bind(this);
        this.stores.user.on('change', this._forceUpdate);
    }

    componentWillUnmount() {
        this.stores.user.off('change', this._forceUpdate);
    }

    filter(evt) {
        this.setState({
            term: evt.target.value
        });
    }

    render() {
        const OTHER_APPS_COUNT = 20;
        let userTeamIds = _.pluck(this.stores.user.getUserTeams(), 'id'),
            otherApps = this.stores.kio.getOtherApplications(this.state.term, userTeamIds),
            otherAppsHiddenCount = otherApps.length - OTHER_APPS_COUNT < 0 ? 0 : otherApps.length - OTHER_APPS_COUNT,
            teamApps = this.stores.kio.getTeamApplications(this.state.term, userTeamIds),
            shortApps = otherApps.splice(0, OTHER_APPS_COUNT),
            term = this.state.term;

        return <div className='applicationList'>
                    <h2 className='applicationList-headline'>Applications</h2>
                    <div className='btn-group'>
                        <a href='/application/create' className='btn btn-primary'>
                        <i className='fa fa-plus'></i> Create Application</a>
                    </div>
                    <div className='form'>
                        <label htmlFor='yourturn-search'>Search:</label>
                        <div className='input-group'>
                            <div
                                className='input-addon'>
                                <span className='fa fa-search' />
                            </div>
                            <input
                                name='yourturn_search'
                                autoFocus={true}
                                value={term}
                                onChange={this.filter.bind(this)}
                                type='search'
                                aria-label='Enter your term'
                                placeholder='Kio' />
                        </div>
                    </div>
                    <h4>Your Applications</h4>
                    {teamApps.length ?
                        <ul data-block='team-apps'>
                            {teamApps.map(
                                (ta, i) =>
                                    <li key={i}>
                                        <a href={`/application/detail/${ta.id}`}>{ta.name}</a>
                                    </li>
                            )}
                        </ul> :
                        <span>No applications owned by your team.</span>
                    }

                    <h4>Other Applications</h4>
                    {shortApps.length ?
                        <div>
                            <ul data-block='other-apps'>
                                {shortApps.map(
                                    (oa, i) =>
                                        <li key={i}>
                                            <a href={`/application/detail/${oa.id}`}>{oa.name}</a>
                                        </li>
                                )}
                            </ul>
                            {otherAppsHiddenCount ?
                                <small>
                                    + <span data-block='other-apps-hidden-count'>{{otherAppsHiddenCount}}</span> hidden.
                                </small> :
                                null}
                        </div>
                        :
                        <span>No applications owned by other teams.</span>
                    }
                </div>;
    }
}

export default ApplicationList;