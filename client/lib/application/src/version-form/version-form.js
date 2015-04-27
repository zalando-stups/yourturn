import BaseView from 'common/src/base-view';
import Template from './version-form.hbs';
import Flux from 'application/src/flux';
import GlobalFlux from 'yourturn/src/flux';
import {history} from 'backbone';
import {constructLocalUrl} from 'common/src/data/services';
import DOCKER_REGISTRY from 'DOCKER_REGISTRY';
import 'common/asset/scss/application/version-form.scss';

class VersionForm extends BaseView {
    constructor(props) {
        props.edit = props.edit || false;
        props.className = 'versionForm';
        props.events = {
            'keyup #version_id': 'handleVersionId',
            'submit': 'save'
        };
        props.store = Flux.getStore('application');
        super(props);
        this.actions = Flux.getActions('application');
    }

    /**
     * Checks availability of version id and fills deployment artifact.
     */
    handleVersionId() {
        this.checkVersionAvailability();
        this.fillDeploymentArtifact();
    }

    /**
     * Fills deployment artifact according to schema [docker registry]/[app team]/[app id]:[version].
     */
    fillDeploymentArtifact() {
        let $idInput = this.$el.find('#version_id');
        let version_id = $idInput.val();
        let name = `${DOCKER_REGISTRY}/${this.data.application.team_id}/${this.data.application.id}:${version_id}`;
        this.$el.find('#version_artifactName').val(name);
    }

    /**
     * Checks if a version with the current id is already in the store. Sets icons accordingly.
     */
    checkVersionAvailability() {
        let $idInput = this.$el.find('#version_id');
        let version_id = $idInput.val();
        if (this.store.getApplicationVersion(this.props.applicationId, version_id) && version_id !== this.props.versionId) {
            $idInput[0].setCustomValidity('Version already exists.');
            this.$el.find('.is-taken').show();
            this.$el.find('.is-available').hide();
        } else {
            $idInput[0].setCustomValidity('');
            this.$el.find('.is-taken').hide();
            this.$el.find('.is-available').show();
        }
    }

    /**
     * Reads data from view, creates a save action.
     */
    save(evt) {
        evt.preventDefault();

        // gather data
        let {$el} = this,
            version_id = $el.find('#version_id').val(),
            version_artifact = $el.find('#version_artifactName').val(),
            version_notes = $el.find('#version_notes').val();

        let version = {
            application_id: this.data.application.id,
            id: version_id,
            artifact: version_artifact ? 'docker://' + version_artifact : '',
            notes: version_notes
        };


        let verb = this.props.edit ? 'update' : 'create';
        this
        .actions
        .saveApplicationVersion(version)
        .then(() => {
            history.navigate(constructLocalUrl('application-version', [version.application_id, version.id]), { trigger: true });
        })
        .catch(() => {
            GlobalFlux
            .getActions('notification')
            .addNotification([`Could not ${verb} version ${version.id} for ${this.data.application.name}.`, 'error']);
        });
    }

    update() {
        let {applicationId, versionId, edit} = this.props;
        this.data = {
            applicationId: applicationId,
            versionId: versionId,
            edit: edit,
            application: this.store.getApplication(applicationId)
        };
        if (edit) {
            this.data.version = this.store.getApplicationVersion(applicationId, versionId);
            this.data.version.artifact = this.data.version.artifact ?
                                            this.data.version.artifact.substring('docker://'.length) :
                                            '';
        }
    }


    render() {
        let {edit} = this.props,
            {data, $el} = this;

        $el.html(Template(data));

        if (edit) {
            this.checkVersionAvailability();
        } else {
            this.handleVersionId();
        }
    }
}

export default VersionForm;