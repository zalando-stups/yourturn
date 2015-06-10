import React from 'react';
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
        return <div className='versionList'>
                    <h2>
                        <a href={`/application/detail/${application.id}`}>{application.name || applicationId}</a> versions
                    </h2>
                    <div className='btn-group'>
                        <a href={`/application/detail/${applicationId}`} className='btn btn-default'>
                            <i className='fa fa-chevron-left'></i> {application.name || applicationId}
                        </a>
                        <a href={`/application/detail/${applicationId}/version/create`} className='btn btn-primary'>
                            <i className='fa fa-plus'></i> Create new version
                        </a>
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
                                        <div>
                                            <a  title={`Approve version ${v.id}`}
                                                className='btn btn-default btn-small'
                                                href={`/application/detail/${v.application_id}/version/approve/${v.id}`}>
                                                <i className='fa fa-check'></i>
                                            </a>
                                            <a href={`/application/detail/${v.application_id}/version/detail/${v.id}`}>
                                                {v.id}
                                            </a>
                                        </div>)}
                        </div>
                        :
                        <div>No versions.</div>}
                </div>;
    }
}

export default VersionList;