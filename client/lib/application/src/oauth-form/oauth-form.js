import BaseView from 'common/src/base-view';
import Template from './oauth-form.hbs';
import Flux from 'application/src/flux';

class OAuthForm extends BaseView {
    constructor(props) {
        this.className = 'applicationOAuth';
        this.store = Flux.getStore('resource');
        super(props);
    }

    update() {
        let scopes = this.store.getAllScopes();

        this.data = {
            applicationId: this.props.applicationId,
            scopes: scopes,
            ownerScopes: scopes.filter(s => s.ownerScope),
            nonOwnerScopes: scopes.filter(s => !s.ownerScope)
        };
    }

    render() {
        this.$el.html(Template(this.data));
        return this;
    }
}

export default OAuthForm;
