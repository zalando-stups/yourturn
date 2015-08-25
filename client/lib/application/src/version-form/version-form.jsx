import React from 'react';
import Icon from 'react-fa';
import {Link} from 'react-router';
import {constructLocalUrl} from 'common/src/data/services';
import DOCKER_REGISTRY from 'DOCKER_REGISTRY';
import 'common/asset/less/application/version-form.less';

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
        let {kio} = this.stores,    // eslint-disable-line
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
        evt.preventDefault();

        let {applicationId} = this.props,
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
        .saveApplicationVersion(applicationId, version.id, version)
        .then(() => this.context.router.transitionTo(constructLocalUrl('application-version', [applicationId, version.id])))
        .catch(err => {
            this
            .props
            .flux
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

        const LINK_PARAMS = {
            applicationId: applicationId,
            versionId: versionId
        };

        return <div className='versionForm'>
                    <h2>
                        {edit ?
                            <span>Edit <Link to='application-appDetail' params={LINK_PARAMS}>{application.name || applicationId}</Link> <Link to='application-verDetail' params={LINK_PARAMS}>{versionId}</Link></span>
                            :
                            <span>Create new version for <Link to='application-appDetail' params={LINK_PARAMS}>{application.name || applicationId}</Link></span>}
                    </h2>
                    <div className='btn-group'>
                        {edit ?
                            <Link
                                to='application-verDetail'
                                params={LINK_PARAMS}
                                className='btn btn-default'>
                                <Icon name='chevron-left' /> {application.name} {version.id}
                            </Link>
                            :
                            <Link
                                to='application-verList'
                                params={LINK_PARAMS}
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
    flux: React.PropTypes.object.isRequired
};
VersionForm.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default VersionForm;
