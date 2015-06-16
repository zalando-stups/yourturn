import React from 'react';
import {Link} from 'react-router';
import 'common/asset/less/application/version-list.less';

class VersionList extends React.Component {
    constructor(props) {
        super();
        this.stores = {
            kio: props.flux.getStore('kio')
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
        let {applicationId} = this.props,
            {kio} = this.stores,
            application = kio.getApplication(applicationId),
            {term} = this.state,
            versions = kio.getApplicationVersions(applicationId, term);
        const LINK_PARAMS = {
            applicationId: applicationId
        };
        return <div className='versionList'>
                    <h2>
                        <Link
                            to='application-appDetail'
                            params={LINK_PARAMS}>
                            {application.name || applicationId}
                        </Link> versions
                    </h2>
                    <div className='btn-group'>
                        <Link
                            to='application-appDetail'
                            params={LINK_PARAMS}
                            className='btn btn-default'>
                            <i className='fa fa-chevron-left'></i> {application.name || applicationId}
                        </Link>
                        <Link
                            to='application-verCreate'
                            params={LINK_PARAMS}
                            className='btn btn-primary'>
                            <i className='fa fa-plus'></i> Create new version
                        </Link>
                    </div>
                    <div className='form'>
                        <div className='input-group'>
                            <div
                                className='input-addon'>
                                <i className='fa fa-search' />
                            </div>
                            <input
                                name='yourturn_version_search'
                                autoFocus={true}
                                value={term}
                                onChange={this.filter.bind(this)}
                                type='search'
                                aria-label='Enter your search term'
                                data-block='search-input'
                                placeholder='1.0-squirrel' />
                        </div>
                    </div>
                    {versions.length ?
                        <div
                            className='versionList-list'
                            data-block='versions'>
                                {versions.map(
                                    v =>
                                        <div key={v.id}>
                                            <Link
                                                to='application-verApproval'
                                                className='btn btn-default btn-small'
                                                params={{
                                                    applicationId: applicationId,
                                                    versionId: v.id
                                                }}>
                                                <i className='fa fa-check'></i>
                                            </Link> <Link
                                                to='application-verDetail'
                                                params={{
                                                    applicationId: applicationId,
                                                    versionId: v.id
                                                }}>
                                                {v.id}
                                            </Link>
                                        </div>)}
                        </div>
                        :
                        <div>No versions.</div>}
                </div>;
    }
}

export default VersionList;