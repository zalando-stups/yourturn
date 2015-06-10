import React from 'react';
import Timestamp from 'react-time';
import ScmSourceWarning from './scm-source-warning.jsx';
import Markdown from 'common/src/markdown.jsx';
import DefaultError from 'common/src/error.jsx';
import {parseArtifact} from 'application/src/util';
import FetchResult from 'common/src/fetch-result';
import 'common/asset/less/application/version-detail.less';

class ScmCommitInfo extends React.Component {
    constructor() {
        super();
    }

    render() {
        let {scmSource} = this.props;
        if (scmSource instanceof FetchResult) {
            return scmSource.isFailed() ?
                    <tr /> :
                    <tr>
                        <th>Artifact Source</th>
                        <td><i className='fa fa-spin fa-circle-o-notch'></i></td>
                    </tr>;
        }
        // no fetch result
        if (scmSource) {
            return <tr>
                        <th>Artifact Source</th>
                        <td>
                            <span>{scmSource.url}<br/>{scmSource.revision}</span>
                        </td>
                    </tr>;
        }

        return <tr />;
    }
}

class ScmAuthorInfo extends React.Component {
    constructor() {
        super();
    }

    render() {
        let {scmSource} = this.props;
        if (scmSource instanceof FetchResult) {
            return scmSource.isFailed() ?
                    <tr /> :
                    <tr>
                        <th>Artifact Author</th>
                        <td><i className='fa fa-spin fa-circle-o-notch'></i></td>
                    </tr>;
        }
        // no fetch result
        if (scmSource) {
            return <tr>
                        <th>Artifact Author</th>
                        <td>{scmSource.author}</td>
                    </tr>;
        }

        return <tr />;
    }
}

class VersionDetail extends React.Component {
    constructor(props) {
        super();
        this.stores = {
            kio: props.flux.getStore('kio'),
            pierone: props.flux.getStore('pierone'),
            user: props.globalFlux.getStore('user')
        };
    }

    render() {
        let {applicationId, versionId} = this.props,
            {kio, user, pierone} = this.stores,
            application = kio.getApplication(applicationId),
            version = kio.getApplicationVersion(applicationId, versionId),
            {team, artifact, tag} = parseArtifact(version.artifact),
            scmSource = pierone.getScmSource(team, artifact, tag),
            approvals = kio.getApprovals(applicationId, versionId);

        return <div className='versionDetail'>
                    <h2>
                        <a href='/application/detail/{applicationId}'>{application.name || applicationId}</a> <span className='versionDetail-versionId'>{version.id}</span>
                    </h2>

                    <div className='btn-group'>
                        <a href={`/application/detail/${applicationId}/version`} className='btn btn-default'>
                            <i className='fa fa-chevron-left'></i> {application.name || applicationId} versions
                        </a>
                        <a href={`/application/detail/${applicationId}/version/edit/${versionId}`} className='btn btn-default {#unless isOwnApplication}btn-disabled{/unless}'>
                            <i className='fa fa-edit'></i> Edit {versionId}
                        </a>
                        <a href={`/application/detail/${applicationId}/version/approve/${versionId}`} className='btn btn-primary'>
                            <i className='fa fa-check'></i> Approvals <span className='badge'>{approvals.length}</span>
                        </a>
                    </div>


                    <table className='table'>
                        <tbody>
                            <tr>
                                <th>ID</th>
                                <td>{version.id}</td>
                            </tr>
                            <tr>
                                <th>Last modified</th>
                                <td><Timestamp value={version.last_modified} /></td>
                            </tr>
                            <tr>
                                <th>Artifact</th>
                                <td>{version.artifact}</td>
                            </tr>
                            <ScmAuthorInfo
                                scmSource={scmSource} />
                            <ScmCommitInfo
                                scmSource={scmSource} />
                        </tbody>
                    </table>

                    <ScmSourceWarning
                        flux={this.props.flux}
                        scmSource={scmSource}
                        application={application}
                        version={version} />

                    <h4 className='versionDetail-notesTitle'>Notes</h4>
                    {version.notes ?
                        <p
                            className='versionDetail-notes'
                            data-block='version-notes'>
                            <Markdown src={version.notes} />
                        </p>
                        :
                        <span>No version notes.</span>}
                </div>;
    }
}

export default VersionDetail;