import React from 'react';
import ReactDOM from 'react-dom';
import Icon from 'react-fa';
import {Link} from 'react-router';
import * as Routes from 'application/src/routes';
import DOCKER_REGISTRY from 'DOCKER_REGISTRY';
import Markdown from 'common/src/markdown.jsx';
import 'common/asset/less/application/version-form.less';

class VersionForm extends React.Component {
    constructor(props) {
        super();

        let {version, edit} = props;
        this.state = {
            versionIdTaken: false,
            autocompleteArtifact: true,
            id: edit ? version.id : '',
            artifact: edit ?
                        (version.artifact.startsWith('docker://') ?
                                version.artifact.substring('docker://'.length) :
                                version.artifact) :
                        `${DOCKER_REGISTRY}/{team}/${props.applicationId}`,
            notes: edit ? version.notes : ''
        };
    }

    setCustomValidity(evt) {
        ReactDOM.findDOMNode(evt.target).setCustomValidity(
            this.state.versionIdTaken ?
                'Version ID is already taken' :
                '');
    }

    disableAutocomplete() {
        this.setState({
            autocompleteArtifact: false
        });
    }

    update(field, prop, evt) {
        const {applicationId, versionIds, application} = this.props;

        this.state[field] = evt.target[prop];
        if (this.state.autocompleteArtifact) {
            this.state.artifact = `${DOCKER_REGISTRY}/${application.team_id}/${application.id}:${this.state.id}`;
        }

        if (field === 'id') {
            // check id availability
            this.state.versionIdTaken = versionIds.indexOf(this.state.id) >= 0;
        }

        this.setState({
            id: this.state.id,
            artifact: this.state.artifact,
            notes: this.state.notes
        });
    }

    save(evt) {
        evt.preventDefault();

        let {applicationId, application} = this.props,
            versionId = this.state.id,
            version = {
                id: versionId,
                notes: this.state.notes,
                artifact: /^docker:\/\//.test(this.state.artifact) ?
                            this.state.artifact :
                            'docker://' + this.state.artifact
            };
        var verb = this.props.edit ? 'update' : 'create';

        this.props.kioActions
        .saveApplicationVersion(applicationId, version.id, version)
        .then(() => this.context.router.push(Routes.verDetail({applicationId, versionId})))
        .catch(err => {
            this.props.notificationActions
            .addNotification(
                `Could not ${verb} version ${version.id} of ${application.name}. ${err.message}`,
                'error');
        });
    }

    render() {
        const {applicationId, versionId, edit, application, approvalCount} = this.props,
            {versionIdTaken, id, notes, artifact} = this.state,
            version = edit ? this.props.version : false,
            LINK_PARAMS = {applicationId,versionId};

        return <div className='versionForm'>
                    <h2>
                        {edit ?
                            <span>Edit <Link to={Routes.appDetail(LINK_PARAMS)}>{application.name || applicationId}</Link> <Link to={Routes.verDetail(LINK_PARAMS)}>{versionId}</Link></span>
                            :
                            <span>Create new version for <Link to={Routes.appDetail(LINK_PARAMS)}>{application.name || applicationId}</Link></span>}
                    </h2>
                    <div className='btn-group'>
                        {edit ?
                            <Link
                                to={Routes.verDetail(LINK_PARAMS)}
                                className='btn btn-default'>
                                <Icon name='chevron-left' /> {application.name} {version.id}
                            </Link>
                            :
                            <Link
                                to={Routes.verList(LINK_PARAMS)}
                                className='btn btn-default'>
                                <Icon name='chevron-left' /> {application.name}
                            </Link>}
                    </div>
                    <form
                        data-block='form'
                        onSubmit={this.save.bind(this)}
                        className='form'>
                        <div className='form-group'>
                            <label>Application</label>
                            <input
                                disabled='disabled'
                                value={applicationId}
                                type='text' />
                        </div>
                        <div className='form-group versionForm-versionId'>
                            <label htmlFor='version_id'>Version ID</label>
                            <small>For instance <a href='http://semver.org/'>semantic versioning</a> or a codename like “pretty-squirrel”.</small>
                            <div className='input-group'>
                                <div className='input-addon'>
                                    {versionIdTaken && !edit ?
                                        <Icon
                                            data-block='taken-symbol'
                                            title='Version ID is already taken.'
                                            className='is-taken'
                                            fixedWidth
                                            name='close' />
                                        :
                                        <Icon
                                            data-block='available-symbol'
                                            title='Version ID is available.'
                                            className='is-available'
                                            fixedWidth
                                            name='check' />}
                                </div>
                                <input
                                    autoFocus={true}
                                    required={true}
                                    disabled={edit ? 'disabled' : null}
                                    placeholder='0.0.1'
                                    data-block='id-input'
                                    value={id}
                                    onKeyUp={this.setCustomValidity.bind(this)}
                                    onChange={this.update.bind(this, 'id', 'value')}
                                    title='Characters and numbers with dots, dashes or underscores in between.'
                                    pattern='[A-Za-z0-9]([A-Za-z0-9\._-]*[A-Za-z0-9])?'
                                    type='text'
                                    name='yourturn_version_id'
                                    id='version_id' />
                            </div>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='version_artifact'>Deployment Artifact</label>
                            <small>This is the tag of your Docker image.</small>
                            <div className='input-group'>
                                <div className='input-addon'>
                                    Docker
                                </div>
                                <input
                                    value={artifact}
                                    data-block='artifact-input'
                                    onKeyDown={this.disableAutocomplete.bind(this)}
                                    onChange={this.update.bind(this, 'artifact', 'value')}
                                    name='yourturn_version_artifactName'
                                    id='version_artifactName'
                                    type='text' />
                            </div>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='description'>Notes</label>
                            <small>A more elaborate description of what the version contains. You can use <a href='http://www.unexpected-vortices.com/sw/rippledoc/quick-markdown-example.html'>Markdown</a>.</small>
                            <Markdown
                                editable={true}
                                src={notes}
                                placeholder='Fixes serious CSS race condition.'
                                onChange={this.update.bind(this, 'notes', 'value')} />
                        </div>
                        { edit && approvalCount > 0 ?
                            <div
                                data-block='warning'
                                className='u-warning'>
                                <div>Existing approvals ({approvalCount}) will be deleted after you save!</div>
                            </div>
                            :
                            null}
                        <div className='btn-group'>
                            <button
                                type='submit'
                                className='btn btn-primary'>
                                <Icon name='save' /> Save
                            </button>
                        </div>
                    </form>
                </div>;
    }
}
VersionForm.displayName = 'VersionForm';
VersionForm.propTypes = {
    applicationId: React.PropTypes.string.isRequired,
    versionId: React.PropTypes.string,
    edit: React.PropTypes.bool,
    kioActions: React.PropTypes.object.isRequired,
    notificationActions: React.PropTypes.object.isRequired
};
VersionForm.contextTypes = {
    router: React.PropTypes.object
};

export default VersionForm;
