import BaseView from 'common/src/base-view';
import Template from './oauth-form.hbs';
import Placeholder from './placeholder.hbs';
import SearchableList from './searchable-list/searchable-list';
import EditableList from './editable-list/editable-list';
import FetchResult from 'common/src/fetch-result';
import {history} from 'backbone';
import {constructLocalUrl} from 'common/src/data/services';
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

    /**
     * Saves the OAuth configuration and return to the detail view
     * if successful. Shows notification otherwise.
     */
    save(evt) {
        evt.preventDefault();
        let {$el} = this;
        let appscopes = this.appscopeList
                            .getSelection()
                            .map(s => s.split('.'))
                            .map(([resourceId, id]) => ({
                                resource_type_id: resourceId,
                                scope_id: id
                            }));
        let ownerscopes = this.ownerscopeList
                            .getSelection()
                            .map(s => s.split('.'))
                            .map(([resourceId, id]) => ({
                                resource_type_id: resourceId,
                                scope_id: id
                            }));
        let buckets = this.bucketList.getSelection();
        let isConfidential = $el.find('#oauth_is_client_confidential:checked').length !== 0;
        let redirectUrl = $el.find('#oauth_redirect_url').val();

        let oauthConfig = {
            s3_buckets: buckets,
            scopes: appscopes.concat(ownerscopes),
            redirect_url: redirectUrl,
            is_client_confidential: isConfidential
        };

        let {applicationId} = this.props;

        this
        .props
        .flux
        .getActions('oauth')
        .saveOAuthConfig(applicationId, oauthConfig)
        .then(() => {
            history.navigate(constructLocalUrl('application', [applicationId]), { trigger: true });
        })
        .catch(e => {
            this
            .props
            .notificationActions
            .addNotification(
                'Could not save OAuth configuration for ' + applicationId,
                'error');
        });
    }

    /**
     * Makes new data available to templates.
     */
    update() {
        let scopes = this.stores.resource.getAllScopes();
        this.data = {
            applicationId: this.props.applicationId,
            application: this.stores.application.getApplication(this.props.applicationId),
            ownerScopes: scopes.filter(s => s.is_resource_owner_scope),
            appScopes: scopes.filter(s => !s.is_resource_owner_scope),
            oauth: this.stores.oauth.getOAuthConfig(this.props.applicationId)
        };
    }

    render() {
        if (this.data.oauth instanceof FetchResult) {
            this.$el.html(Placeholder(this.data));
            return this;
        }
        this.$el.html(Template(this.data));
        this.appscopeList = new SearchableList({
            items: this.data.appScopes,
            selected: this.data.oauth.scopes.map(s => `${s.resource_type_id}.${s.scope_id}`)
        });
        this.ownerscopeList = new SearchableList({
            items: this.data.ownerScopes,
            selected: this.data.oauth.scopes.map(s => `${s.resource_type_id}.${s.scope_id}`)
        });
        this.bucketList = new EditableList({
            items: this.data.oauth.s3_buckets,
            itemName: 'bucket'
        });
        this.$el
            .find('[data-action="appscope-list"]')
            .html(this.appscopeList.render().$el);
        this.$el
            .find('[data-action="ownerscope-list"]')
            .html(this.ownerscopeList.render().$el);
        this.$el
            .find('[data-action="editable-list"]')
            .html(this.bucketList.render().$el);
        return this;
    }
}

export default OAuthForm;
