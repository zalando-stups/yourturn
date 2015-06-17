import React from 'react';
import Icon from 'react-fa';
import {Link} from 'react-router';
import Timestamp from 'react-time';
import {DATE_FORMAT} from 'common/src/config';
import ScmSourceWarning from './scm-source-warning.jsx';
import Markdown from 'common/src/markdown.jsx';
import {parseArtifact} from 'application/src/util';
import FetchResult from 'common/src/fetch-result';
import Placeholder from './placeholder.jsx';
import DefaultError from 'common/src/error.jsx';
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
                        <td>
                            <Icon name='circle-o-notch' spin />
                        </td>
                    </tr>;
        }
        // no fetch result
        if (scmSource) {
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
                        <td>
                            <Icon name='circle-o-notch' spin />
                        </td>
                    </tr>;
        }
        // no fetch result
        if (scmSource) {
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

        this._forceUpdate = this.forceUpdate.bind(this);
        this.stores.user.on('change', this._forceUpdate);
    }

    componentWillUnmount() {
        this.stores.user.off('change', this._forceUpdate);
    }

    render() {
        let {applicationId, versionId} = this.props,
            {kio, user, pierone} = this.stores,
            application = kio.getApplication(applicationId),
            version = kio.getApplicationVersion(applicationId, versionId),
            {team, artifact, tag} = parseArtifact(version.artifact),
            scmSource = pierone.getScmSource(team, artifact, tag),
            approvals = kio.getApprovals(applicationId, versionId),
            isOwnApplication = user.getUserTeams().map(t => t.id).indexOf(application.team_id) >= 0;

        const LINK_PARAMS = {
            applicationId: applicationId,
            versionId: versionId
        };

        if (version instanceof FetchResult) {
            return version.isPending() ?
                        <Placeholder
                                applicationId={applicationId}
                                versionId={versionId} /> :
                        <DefaultError error={version.getResult()} />;
        }
        return <div className='versionDetail'>
                    <h2>
                        <Link
                            to='application-appDetail'
                            params={LINK_PARAMS}>
                            {application.name || applicationId}
                        </Link> <span className='versionDetail-versionId'>{version.id}</span>
                    </h2>

                    <div className='btn-group'>
                        <Link
                            to='application-appDetail'
                            className='btn btn-default'
                            params={LINK_PARAMS}>
                            <Icon name='chevron-left' /> {application.name || applicationId} versions
                        </Link>
                        <Link
                            to='application-verEdit'
                            className={`btn btn-default ${isOwnApplication ? '' : 'btn-disabled'}`}
                            params={LINK_PARAMS}>
                            <Icon name='edit' /> Edit {versionId}
                        </Link>
                        <Link
                            to='application-verApproval'
                            className='btn btn-primary'
                            params={LINK_PARAMS}>
                            <Icon name='edit' /> Approvals <span className='badge'>{approvals.length}</span>
                        </Link>
                    </div>

                    <table className='table'>
                        <tbody>
                            <tr>
                                <th>ID</th>
                                <td>{version.id}</td>
                            </tr>
                            <tr>
                                <th>Last modified</th>
                                <td><Timestamp format={DATE_FORMAT} value={version.last_modified} /></td>
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
                        <Markdown
                            className='versionDetail-notes'
                            block='version-notes'
                            src={version.notes} />
                        :
                        <span>No version notes.</span>}
                </div>;
    }
}

export default VersionDetail;