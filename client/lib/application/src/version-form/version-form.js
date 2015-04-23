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
        this.className = 'versionForm';
        this.store = Flux.getStore('application');
        this.actions = Flux.getActions('application');
        this.events = {
            'keyup #version_id': 'handleVersionId',
            'submit': 'save'
        };
        super(props);
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
        if (this.store.getApplicationVersion(this.props.applicationId, version_id)) {
            $idInput[0].setCustomValidity('Version ID already exists.');
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
            version_artifact = 'docker://' + $el.find('#version_artifactName').val(),
            version_notes = $el.find('#version_notes').val();

        let version = {
            application_id: this.data.application.id,
            id: version_id,
            artifact: version_artifact,
            notes: version_notes
        };

        this
        .actions
        .saveApplicationVersion(version)
        .then(() => {
            history.navigate(constructLocalUrl('application-version', [version.application_id, version.id]), { trigger: true });
        })
        .catch(() => {
            GlobalFlux
            .getActions('notification')
            .addNotification([`Could not save version ${version.id} for ${this.data.application.name}.`, 'error']);
        });
    }

    update() {
        this.data = {
            application: this.store.getApplication(this.props.applicationId)
        };
    }


    render() {
        this.$el.html(Template(this.data));
        this.handleVersionId();
    }
}

export default VersionForm;