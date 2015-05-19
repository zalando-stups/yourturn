/* globals ENV_TEST */
import BaseView from 'common/src/base-view';
import Template from './version-form.hbs';
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
        props.store = props.flux.getStore('application');
        super(props);
        this.actions = props.flux.getActions('application');
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
        let $idInput = this.$el.find('#version_id'),
            version_id = $idInput.val(),
            name = `${DOCKER_REGISTRY}/${this.data.application.team_id}/${this.data.application.id}:${version_id}`;
        this.$el.find('#version_artifactName').val(name);
    }

    /**
     * Checks if a version with the current id is already in the store. Sets icons accordingly.
     */
    checkVersionAvailability() {
        let $idInput = this.$el.find('#version_id'),
            version_id = $idInput.val(),
            storeVersion = this.store.getApplicationVersion(this.props.applicationId, version_id);

        if (storeVersion && version_id !== this.props.versionId) {
            if (!ENV_TEST) {
                $idInput[0].setCustomValidity('Version already exists.');
            }
            this.$el.find('.is-taken').css('display', 'inline-block');
            this.$el.find('.is-available').css('display', 'none');
        } else {
            if (!ENV_TEST) {
                $idInput[0].setCustomValidity('');
            }
            this.$el.find('.is-taken').css('display', 'none');
            this.$el.find('.is-available').css('display', 'inline-block');
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
            version_notes = $el.find('#version_notes').val(),

            version = {
                artifact: version_artifact ? 'docker://' + version_artifact : '',
                notes: version_notes
            };


        var verb = this.props.edit ? 'update' : 'create';

        this
        .actions
        .saveApplicationVersion(this.data.applicationId, version_id, version)
        .then(() => {
            history
            .navigate(
                constructLocalUrl(
                    'application-version',
                    [this.data.applicationId, version_id]),
                {trigger: true});
        })
        .catch(err => {
            this
            .props
            .notificationActions
            .addNotification(
                `Could not ${verb} version ${version_id} for ${this.data.application.name}. ${err.message}`,
                'error');
        });
    }

    update() {
        let {applicationId, versionId, edit} = this.props;
        this.data = {
            applicationId: applicationId,
            versionId: versionId,
            edit: edit,
            approvalCount: this.store.getApprovals(applicationId, versionId).length,
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