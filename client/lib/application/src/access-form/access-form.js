import BaseView from 'common/src/base-view';
import Template from './access-form.hbs';
import ErrorTpl from 'common/src/error.hbs';
import Placeholder from './placeholder.hbs';
import SearchableList from 'common/src/searchable-list/searchable-list';
import EditableList from 'common/src/editable-list/editable-list';
import FetchResult from 'common/src/fetch-result';
import {history} from 'backbone';
import {constructLocalUrl} from 'common/src/data/services';
import 'common/asset/scss/application/access-form.scss';

class AccessForm extends BaseView {
    constructor(props) {
        props.className = 'accessForm';
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
        let scopes = this.stores.resource.getAllScopes(),
            appscopes = this.appscopeList
                            .getSelection()
                            .map(s => s.split('.'))
                            .map(([resourceId, id]) => ({
                                resource_type_id: resourceId,
                                scope_id: id
                            })),
            buckets = this.bucketList.getSelection(),

        // appscopes contains selected application scopes in the
        // shape of { resource_type_id, scope_id }

        // we cannot just join this into oauth.scopes because
        // we would never remove unselected scopes

        // thus we need to identify RO scopes in oauth.scopes
            ownerscopes = this
                            .data
                            .oauth
                            .scopes
                            .filter(scope => scopes.some(scp => scp.resource_type_id === scope.resource_type_id &&
                                                             scp.id === scope.scope_id &&
                                                             scp.is_resource_owner_scope)),

        // we cannot filter oauth.scopes by is_resource_owner_scope
        // because it is not present there. we do not want to do
        // a http call for every scope to check

            oauthConfig = {
                s3_buckets: buckets,
                scopes: appscopes.concat(ownerscopes),
                redirect_url: this.data.oauth.redirect_url,
                is_client_confidential: this.data.oauth.is_client_confidential
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
                'Could not save access control configuration for ' + applicationId + '. ' + e.message,
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
        let {oauth} = this.data;
        if (oauth instanceof FetchResult) {
            this.$el.html(
                oauth.isPending() ?
                    Placeholder(this.data) :
                    ErrorTpl(oauth.getResult()));
            return this;
        }
        this.$el.html(Template(this.data));
        this.appscopeList = new SearchableList({
            items: this.data.appScopes,
            selected: oauth.scopes.map(s => `${s.resource_type_id}.${s.scope_id}`)
        });
        this.bucketList = new EditableList({
            items: oauth.s3_buckets,
            itemName: 'bucket'
        });
        this.$el
            .find('[data-action="appscope-list"]')
            .html(this.appscopeList.render().$el);
        this.$el
            .find('[data-action="editable-list"]')
            .html(this.bucketList.render().$el);
        return this;
    }
}

export default AccessForm;