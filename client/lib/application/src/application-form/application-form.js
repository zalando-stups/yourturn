/* globals ENV_PRODUCTION */
import BaseView from 'common/src/base-view';
import Template from './application-form.hbs';
import SERVICE_URL_TLD from 'SERVICE_URL_TLD';
import {history} from 'backbone';
import {constructLocalUrl} from 'common/src/data/services';
import FetchResult from 'common/src/fetch-result';
import 'common/asset/scss/application/application-form.scss';

class ApplicationForm extends BaseView {
    constructor(props) {
        props = props || {edit: false};
        props.className = 'applicationForm';
        props.stores = {
            user: props.globalFlux.getStore('user')
        };
        props.events = {
            'submit form': 'save',
            'change #team_id': 'fillServiceUrl',
            'keyup #app_id': 'handleAppId',
            'keyup #service_url': 'deactivateAutocomplete'
        };
        if (props.edit) {
            props.stores.application = props.flux.getStore('application');
        }
        this.state = {
            autocompleteServiceUrl: true
        };
        super(props);
    }

    handleAppId() {
        this.checkAppIdAvailability();
        this.fillServiceUrl();
    }

    deactivateAutocomplete() {
        this.state.autocompleteServiceUrl = false;
    }

    update() {
        if (this.props.edit) {
            this.data = {
                edit: !!this.props.edit,
                app: this.stores.application.getApplication(this.props.applicationId)
            };
            let {app} = this.data;
            if (!(app instanceof FetchResult) && app.service_url) {
                app.service_url = app.service_url.substring('https://'.length);
            }
        } else {
            this.data = {
                teams: this.stores.user.getUserTeams()
            };
        }
    }

    /**
     * Checks the application store if an app with this ID
     * already exists. Shows or hides according input-addon.
     */
    checkAppIdAvailability() {
        let $appInput = this.$el.find('#app_id'),
            app_id = $appInput.val();

        if (this.props.flux.getStore('application').getApplication(app_id)) {
            if (ENV_PRODUCTION) {
                $appInput[0].setCustomValidity('App ID already exists.');
            }
            this.$el.find('.is-taken').css('display', 'inline-block');
            this.$el.find('.is-available').css('display', 'none');
        } else {
            if (ENV_PRODUCTION) {
                $appInput[0].setCustomValidity('');
            }
            this.$el.find('.is-taken').css('display', 'none');
            this.$el.find('.is-available').css('display', 'inline-block');
        }
    }

    /**
     * Autocompletes the service url using the pattern {app}.{team}.{tld}
     */
    fillServiceUrl() {
        if (!this.state.autocompleteServiceUrl) {
            return;
        }
        let {$el} = this,
            team_id = $el.find('#team_id').val(),
            app_id = $el.find('#app_id').val();
        $el.find('#service_url').val(`${app_id}.${team_id}.${SERVICE_URL_TLD}`);
    }

    /**
     * Saves the application to kio.
     */
    save(evt) {
        // prevent the form from actually be submitted
        evt.preventDefault();
        let {$el} = this,
        // gather data from dom
            active = !!$el.find('#active:checked').length,
            team_id = $el.find('#team_id').val(),
            id = $el.find('#app_id').val(),
            name = $el.find('#name').val(),
            subtitle = $el.find('#subtitle').val(),
            service_url = 'https://' + $el.find('#service_url').val(),
            scm_url = $el.find('#scm_url').val(),
            documentation_url = $el.find('#documentation_url').val(),
            specification_url = $el.find('#specification_url').val(),
            description = $el.find('#description').val(),

            app = {
                active: active,
                team_id: team_id,
                name: name,
                subtitle: subtitle,
                service_url: service_url,
                scm_url: scm_url,
                documentation_url: documentation_url,
                specification_url: specification_url,
                description: description
            };

        this
        .props
        .flux
        .getActions('application')
        .saveApplication(id, app)
        .then(() => {
            // redirect
            // we can't import the router directly because circular dependencies ensue
            // and window.location is ugly and probably aborts the PUT request from before
            history.navigate(constructLocalUrl('application', [id]), {trigger: true});
        })
        .catch(() => {
            let verb = this.props.edit ? 'update' : 'create';
            this
            .props
            .globalFlux
            .getActions('notification')
            .addNotification(
                `Could not ${verb} application ${app.name}.`,
                'error'
            );
        });
    }

    render() {
        this.$el.html(Template(this.data));
        if (this.props.edit) {
            this.$el.find('.is-taken').css('display', 'none');
        } else {
            this.checkAppIdAvailability();
        }
    }
}

export default ApplicationForm;
