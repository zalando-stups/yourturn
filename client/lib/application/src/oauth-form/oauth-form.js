import BaseView from 'common/src/base-view';
import Template from './oauth-form.hbs';
import SearchableList from './searchable-list/searchable-list';

import 'common/asset/scss/application/oauth-form.scss';

class OAuthForm extends BaseView {
    constructor(props) {
        props.className = 'oAuthForm';
        props.stores = {
            oauth: props.flux.getStore('oauth'),
            resource: props.flux.getStore('resource'),
            application: props.flux.getStore('application')
        };
        props.events = {
            'submit': 'save'
        };
        super(props);
    }

    save(evt) {
        evt.preventDefault();
        let appscopes = this.appscopeList
                            .getSelection()
                            .map(s => s.split('.'))
                            .map(([resourceId, id]) => ({
                                resourceId: resourceId,
                                id: id
                            }));
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
        this.appscopeList = new SearchableList({
            items: this.data.scopes,
            selected: this.data.oauth.scopes.map(s => `${s.resourceId}.${s.id}`)
        });
        this.$el
            .find('[data-action="appscope-list"]')
            .html(this.appscopeList.render().$el);
        return this;
    }
}

export default OAuthForm;
