import BaseView from 'common/src/base-view';
import Template from './oauth-form.hbs';
import Flux from 'application/src/flux';
import 'common/asset/scss/application/oauth-form.scss';

class OAuthForm extends BaseView {
    constructor(props) {
        props.className = 'oAuthForm';
        props.stores = {
            oauth: Flux.getStore('oauth'),
            resource: Flux.getStore('resource'),
            application: Flux.getStore('application')
        };
        props.events = {
            'submit': 'save'
        };
        super(props);
    }

    save(evt) {
        evt.preventDefault();
    }

    update() {
        let scopes = this.stores.resource.getAllScopes();

        this.data = {
            application: this.stores.application.getApplication(this.props.applicationId),
            scopes: scopes,
            ownerScopes: scopes.filter(s => s.ownerScope),
            nonOwnerScopes: scopes.filter(s => !s.ownerScope),
            oauth: this.stores.oauth.getOAuthConfig(this.props.applicationId)
        };
    }

    render() {
        this.$el.html(Template(this.data));
        return this;
    }
}

export default OAuthForm;
