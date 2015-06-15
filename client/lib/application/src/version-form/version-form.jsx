import React from 'react';
import {constructLocalUrl} from 'common/src/data/services';
import DOCKER_REGISTRY from 'DOCKER_REGISTRY';

class VersionForm extends React.Component {
    constructor(props) {
        super();
        this.stores = {
            kio: props.flux.getStore('kio')
        };
        this.actions = props.flux.getActions('kio');

        let version = this.stores.kio.getApplicationVersion(props.applicationId, props.versionId),
            {edit} = props;
        this.state = {
            versionIdTaken: false,
            autocompleteArtifact: true,
            id: edit ? version.id : '',
            artifact: edit ? version.artifact : '',
            notes: edit ? version.notes : ''
        };
    }

    setCustomValidity(evt) {
        React.findDOMNode(evt.target).setCustomValidity(
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
        let {kio} = this.stores,
            {applicationId} = this.props,
            versions = kio.getApplicationVersions(applicationId),
            application = kio.getApplication(applicationId);

        this.state[field] = evt.target[prop];
        if (this.state.autocompleteArtifact) {
            this.state.artifact = `${DOCKER_REGISTRY}/${application.team_id}/${application.id}:${this.state.id}`;
        }

        if (field === 'id') {
            // check id availability
            this.state.versionIdTaken = versions.map(v => v.id).indexOf(this.state.id) >= 0;
        }

        this.setState({
            id: this.state.id,
            artifact: this.state.artifact,
            notes: this.state.notes
        });
    }

    save(evt) {
        if (evt) {
            evt.preventDefault();
        }
        let {applicationId, versionId} = this.props,
            {kio} = this.stores,
            application = kio.getApplication(applicationId),
            version = {
                id: this.state.id,
                notes: this.state.notes,
                artifact: this.state.artifact
            };
        var verb = this.props.edit ? 'update' : 'create';

        this
        .actions
        .saveApplicationVersion(applicationId, versionId, version)
        .then(() => this.context.router.transitionTo(constructLocalUrl('application-version', [applicationId, version.id])))
        .catch(err => {
            this
            .props
            .globalFlux
            .getActions('notification')
            .addNotification(
                `Could not ${verb} version ${version.id} of ${application.name}. ${err.message}`,
                'error');
        });
    }

    render() {
        let {applicationId, versionId, edit} = this.props,
            {kio} = this.stores,
            {versionIdTaken, id, notes, artifact} = this.state,
            application = kio.getApplication(applicationId),
            version = edit ? kio.getApplicationVersion(applicationId, versionId) : false,
            approvals = edit ? kio.getApprovals(applicationId, versionId) : false;
        return <div className='versionForm'>
                    <h2>
                        {edit ? 'Edit ' : 'Create new version for '} <a href={`/application/detail/${applicationId}`}>{application.name || applicationId}</a>
                    </h2>
                    <div className='btn-group'>
                        {edit ?
                            <a href='/application/detail/{application.id}/version/detail/{version.id}' className='btn btn-default'>
                                <i className='fa fa-chevron-left'></i> {application.name} {version.id}
                            </a>
                            :
                            <a href='/application/detail/{application.id}/version' className='btn btn-default'>
                                <i className='fa fa-chevron-left'></i> {application.name}
                            </a>}
                    </div>
                    <form
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
                                        <i data-block='taken-symbol'
                                            title='Version ID is already taken.'
                                            className='fa fa-close fa-fw is-taken'></i>
                                        :
                                        <i data-block='available-symbol'
                                        title='Version ID is available.'
                                        className='fa fa-check fa-fw is-available'></i>}
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
                            <textarea
                                id='version_notes'
                                placeholder='Fixes serious CSS race condition.'
                                name='yourturn_version_notes'
                                value={notes}
                                onChange={this.update.bind(this, 'notes', 'value')}
                                cols='30'
                                rows='10'></textarea>
                        </div>
                        { edit && approvals.length ?
                            <div
                                data-block='warning'
                                className='u-warning'>
                                <div>Existing approvals ({approvals.length}) will be deleted after you save!</div>
                            </div>
                            :
                            null}
                        <div className='btn-group'>
                            <button
                                type='submit'
                                className='btn btn-primary'>
                                <i className='fa fa-save'></i> Save
                            </button>
                        </div>
                    </form>
                </div>;
    }
}
VersionForm.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default VersionForm;