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
    }

    filter(evt) {
        this.setState({
            term: evt.target.value
        });
    }

    render() {
        let userTeamIds = _.pluck(this.stores.user.getUserTeams(), 'id'),
            otherApps = this.stores.kio.getOtherApplications(this.state.term, userTeamIds),
            otherAppsHiddenCount = otherApps.length - 20 < 0 ? 0 : otherApps.length - 20,
            data = {
                teamApps: this.stores.kio.getTeamApplications(this.state.term, userTeamIds),
                otherApps: otherApps.splice(0, 20),
                otherAppsHiddenCount: otherAppsHiddenCount,
                term: this.state.term
            };

        return  <div className='applicationList'>
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
                                ref='filterInput'
                                name='yourturn_search'
                                autofocus='autofocus'
                                value={data.term}
                                onChange={this.filter.bind(this)}
                                type='search'
                                aria-label='Enter your term'
                                data-action='search'
                                placeholder='Kio' />
                        </div>
                    </div>
                    <h4>Your Applications</h4>
                    {data.teamApps.length ?
                        <ul data-block='team-apps'>
                            {data.teamApps.map(
                                (ta, i) => 
                                    <li key={i}>
                                        <a href={`/application/detail/${ta.id}`}>{ta.name}</a>
                                    </li>
                            )}
                        </ul> :
                        <span>No applications owned by your team.</span>
                    }

                    <h4>Other Applications</h4>
                    {data.otherApps.length ?
                        <ul data-block='other-apps'>
                            {data.otherApps.map(
                                (oa,i) =>
                                    <li key={i}>
                                        <a href={`/application/detail/${oa.id}`}>{oa.name}</a>
                                    </li>
                            )}
                             {data.otherAppsHiddenCount ?
                                <small data-block='other-apps-hidden-count'>
                                    + <span>{{otherAppsHiddenCount}}</span> hidden.
                                </small> :
                                null
                            }
                        </ul> :
                        <span>No applications owned by other teams.</span>
                    }
                </div>;
    }
}

export default ApplicationList;