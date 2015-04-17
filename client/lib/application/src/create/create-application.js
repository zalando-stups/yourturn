import BaseView from 'common/src/base-view';
import Template from './create-application.hbs';
import Flux from 'application/src/flux';
import {history} from 'backbone';
import 'common/asset/scss/application/create-application.scss';

class CreateApp extends BaseView {
    constructor( props ) {
        this.className = 'createApplication';
        this.events = {
            'submit form': 'save',
            'keyup #team_id': 'fillServiceUrl',
            'keyup #app_id': 'fillServiceUrl'
        }
        super(props);
    }

    update() {}

    fillServiceUrl() {
        let {$el} = this;
        let team_id = $el.find('#team_id').val();
        let app_id = $el.find('#app_id').val();
        $el.find('#service_url').val(`${app_id}.${team_id}.zalan.do`);
    }

    save(e) {
        // prevent the form from actually be submitted
        e.preventDefault();
        let {$el} = this;
        // gather data from dom
        let active = !!$el.find('#active:checked').length,
            team_id = $el.find('#team_id').val(),
            id = $el.find('#app_id').val(),
            name = $el.find('#name').val(),
            subtitle = $el.find('#subtitle').val(),
            service_url = $el.find('#service_url').val(),
            scm_url = $el.find('#scm_url').val(),
            documentation_url = $el.find('#documentation_url').val(),
            specification_url = $el.find('#specification_url').val(),
            description = $el.find('#description').val();

        let app = {
            active: active,
            team_id: team_id,
            id: id,
            name: name,
            subtitle: subtitle,
            service_url: service_url,
            scm_url: scm_url,
            documentation_url: documentation_url,
            specification_url: specification_url,
            description: description
        };

        console.debug(app);
        Flux
        .getActions('application')
        .saveApplication(app)
        .then(() => {
            // redirect
            // we can't import the router directly because circular dependencies ensue
            // and window.location is ugly and probably aborts the PUT request from before
            history.navigate(`application/${app.id}`, { trigger: true });
        });
    }

    render() {
        this.$el.html(Template());
    }
}

export default CreateApp;