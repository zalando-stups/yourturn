import BaseView from 'common/src/base-view';
import Template from './oauth-form.hbs';
import Placeholder from './placeholder.hbs';
import SearchableList from 'common/src/searchable-list/searchable-list';
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
        let {$el} = this,
            ownerscopes = this.ownerscopeList
                            .getSelection()
                            .map(s => s.split('.'))
                            .map(([resourceId, id]) => ({
                                resource_type_id: resourceId,
                                scope_id: id
                            })),
            appscopes = this
                            .data
                            .oauth
                            .scopes
                            .filter(scope => this
                                                .data
                                                .scopes
                                                .some(scp => scp.resource_type_id === scope.resource_type_id &&
                                                             scp.id === scope.scope_id &&
                                                             !scp.is_resource_owner_scope)),
            isNonConfidential = $el.find('#oauth_is_client_non_confidential:checked').length !== 0,
            redirectUrl = $el.find('#oauth_redirect_url').val(),
            oauthConfig = {
                s3_buckets: this.data.oauth.s3_buckets,
                scopes: ownerscopes.concat(appscopes),
                redirect_url: redirectUrl,
                is_client_confidential: !isNonConfidential
            },
            {applicationId} = this.props;

        this
        .props
        .flux
        .getActions('oauth')
        .saveOAuthConfig(applicationId, oauthConfig)
        .then(() => {
            history.navigate(constructLocalUrl('application', [applicationId]), {trigger: true});
        })
        .catch(e => {
            this
            .props
            .notificationActions
            .addNotification(
                'Could not save OAuth client configuration for ' + applicationId + '. ' + e.message,
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
            scopes: scopes,
            ownerScopes: scopes.filter(s => s.is_resource_owner_scope),
            appScopes: scopes.filter(s => !s.is_resource_owner_scope),
            oauth: this.stores.oauth.getOAuthConfig(this.props.applicationId)
        };
    }

    render() {
        let {oauth} = this.data;
        if (oauth instanceof FetchResult && oauth.isPending()) {
            this.$el.html(Placeholder(this.data));
            return this;
        }
        this.$el.html(Template(this.data));
        this.ownerscopeList = new SearchableList({
            items: this.data.ownerScopes,
            selected: oauth.scopes.map(s => `${s.resource_type_id}.${s.scope_id}`)
        });
        this.$el
            .find('[data-action="ownerscope-list"]')
            .html(this.ownerscopeList.render().$el);
        return this;
    }
}

export default OAuthForm;
