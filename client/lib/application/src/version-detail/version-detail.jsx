import React from 'react';
import Icon from 'react-fa';
import {Link} from 'react-router';
import * as Routes from 'application/src/routes';
import Timestamp from 'react-time';
import Config from 'common/src/config';
import ScmSourceWarning from './scm-source-warning.jsx';
import Markdown from 'common/src/markdown.jsx';
import FetchResult from 'common/src/fetch-result';
import Placeholder from './placeholder.jsx';
import DefaultError from 'common/src/error.jsx';
import Badge from 'common/src/badge.jsx';
import 'common/asset/less/application/version-detail.less';

const ScmCommitInfo = (props) =>{
    let {scmSource} = props;
    if (scmSource instanceof FetchResult) {
        return scmSource.isFailed() ?
                <tr /> :
                <tr>
                    <th>Artifact Source</th>
                    <td>
                        <Icon name='circle-o-notch u-spinner' spin />
                    </td>
                </tr>;
    }
    // no fetch result
    if (scmSource) {
        return <tr>
                    <th>Artifact Source</th>
                    <td>
                        <span>{scmSource.url}<br />{scmSource.revision}</span>
                    </td>
                </tr>;
    }

    return <tr />;
};
ScmCommitInfo.displayName = 'ScmCommitInfo';
ScmCommitInfo.propTypes = {
    scmSource: React.PropTypes.object.isRequired
};

const ScmAuthorInfo = (props) => {
    let {scmSource} = props;
    if (scmSource instanceof FetchResult) {
        return scmSource.isFailed() ?
                <tr /> :
                <tr>
                    <th>Artifact Author</th>
                    <td>
                        <Icon name='circle-o-notch u-spinner' spin />
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
};
ScmAuthorInfo.displayName = 'ScmAuthorInfo';
ScmAuthorInfo.propTypes = {
    scmSource: React.PropTypes.object.isRequired
};

const VersionDetail = (props) => {
    const {
        applicationId,
        versionId,
        application,
        version,
        approvalCount,
        editable,
        tags,
        artifactInfo,
        scmSource} = props,
    LINK_PARAMS = {applicationId, versionId};

    if (version instanceof FetchResult) {
        return version.isPending() ?
                    <Placeholder
                            applicationId={applicationId}
                            versionId={versionId} /> :
                    <DefaultError error={version.getResult()} />;
    }
    return (<div className='versionDetail'>
                <h2>
                    <Link
                        to={Routes.appDetail(LINK_PARAMS)}>
                        {application.name || applicationId}
                    </Link> <span className='versionDetail-versionId'>{version.id}</span>
                </h2>

                <div className='btn-group'>
                    <Link
                        to={Routes.verList(LINK_PARAMS)}
                        className='btn btn-default'>
                        <Icon name='chevron-left' /> {application.name || applicationId} versions
                    </Link>
                    <Link
                        to={Routes.verEdit(LINK_PARAMS)}
                        className={`btn btn-default ${editable ? '' : 'btn-disabled'}`}>
                        <Icon name='edit' /> Edit {versionId}
                    </Link>
                    <Link
                        to={Routes.verApproval(LINK_PARAMS)}
                        className='btn btn-primary'>
                        <Icon name='edit' /> Approvals <Badge>{approvalCount}</Badge>
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
                            <td><Timestamp format={Config.DATE_FORMAT} value={version.last_modified} /></td>
                        </tr>
                        <tr>
                            <th>Artifact</th>
                            <td>{version.artifact.indexOf('docker://') === 0 ?
                                    version.artifact.substring('docker://'.length) :
                                    version.artifact}</td>
                        </tr>
                        <ScmAuthorInfo
                            scmSource={scmSource} />
                        <ScmCommitInfo
                            scmSource={scmSource} />
                    </tbody>
                </table>

                <ScmSourceWarning
                    artifactInfo={artifactInfo}
                    tags={tags}
                    artifact={version.artifact}
                    scmSource={scmSource} />

                <h4 className='versionDetail-notesTitle'>Notes</h4>
                {version.notes ?
                    <Markdown
                        className='versionDetail-notes'
                        block='version-notes'
                        src={version.notes} />
                    :
                    <span>No version notes.</span>}
            </div>)
};

VersionDetail.displayName = 'VersionDetail';

VersionDetail.propTypes = {
    application: React.PropTypes.object.isRequired,
    applicationId: React.PropTypes.string.isRequired,
    approvalCount: React.PropTypes.number.isRequired,
    artifactInfo: React.PropTypes.object.isRequired,
    editable: React.PropTypes.bool.isRequired,
    scmSource: React.PropTypes.object,
    tags: React.PropTypes.array.isRequired,
    version: React.PropTypes.object.isRequired,
    versionId: React.PropTypes.string.isRequired
};

export default VersionDetail;
