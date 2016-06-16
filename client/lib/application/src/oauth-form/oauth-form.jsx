import React from 'react';
import Icon from 'react-fa';
import {Link} from 'react-router';
import * as Routes from 'application/src/routes';
import OAuthSyncInfo from 'application/src/oauth-sync-info.jsx';
import ScopeList from 'application/src/scope-list.jsx';
import 'common/asset/less/application/oauth-form.less';

class OAuthForm extends React.Component {
    constructor(props) {
        super();
        const {oauthConfig} = props;
        this.state = {
            scopes: oauthConfig.scopes,
            redirectUrl: oauthConfig.redirect_url,
            isClientConfidential: oauthConfig.is_client_confidential
        };
    }

    componentWillReceiveProps(newProps) {
        const {oauthConfig} = newProps;
        if (oauthConfig && !this.state.scopes && !this.state.scopes.length) {
            this.setState({
                scopes: oauthConfig.scopes
            });
        }
        if (oauthConfig && !this.state.redirectUrl && oauthConfig.redirect_url !== this.state.redirectUrl) {
            this.setState({
                redirectUrl: oauthConfig.redirect_url
            });
        }
    }

    updateScopes(selectedScopes) {
        this.setState({
            scopes: selectedScopes
        });
    }

    updateConfidentiality() {
        this.setState({
            isClientConfidential: !this.state.isClientConfidential
        });
    }

    updateRedirectUrl(evt) {
        this.setState({
            redirectUrl: evt.target.value
        });
    }

    /**
     * Save current state to backend
     */
    save(evt) {
        evt.preventDefault();

        let {applicationId, allScopes, oauthConfig} = this.props,
            ownerscopes = this.state.scopes,
            appscopes = oauthConfig
                            .scopes
                            .filter(s => allScopes.some(scp => scp.id === s.id &&
                                                                scp.resource_type_id === s.resource_type_id &&
                                                                !scp.is_resource_owner_scope ));

        oauthConfig.scopes = ownerscopes.concat(appscopes);
        oauthConfig.redirect_url = this.state.redirectUrl;
        oauthConfig.is_client_confidential = this.state.isClientConfidential;

        this.props.mintActions
        .saveOAuthConfig(applicationId, oauthConfig)
        .then(() => this.context.router.push(Routes.appDetail({applicationId})))
        .catch(e => {
            this.props.notificationActions
            .addNotification(
                'Could not save OAuth client configuration for ' + applicationId + '. ' + e.message,
                'error');
        });
    }

    onRenewCredentials() {
        return this.props.mintActions
                .renewCredentials(this.props.applicationId);
    }

    render() {
        const {
                applicationId,
                application,
                resourceOwnerScopes,
                oauthConfig,
                editable
            } = this.props,
            LINK_PARAMS = {applicationId};
        return <div className='oAuthForm'>
                    <h2>
                        <Link
                            to={Routes.appDetail(LINK_PARAMS)}>{application.name}</Link> OAuth Client
                    </h2>
                    <div className='btn-group'>
                        <Link
                            to={Routes.appDetail(LINK_PARAMS)}
                            className='btn btn-default'>
                            <Icon name='chevron-left' /> {application.name}
                        </Link>
                    </div>
                    <form
                        data-block='form'
                        onSubmit={this.save.bind(this)}
                        className='form'>
                        <div className='form-group'>
                            <label htmlFor='oauth_redirect_url'>Redirect URL</label>
                            <small>Where you expect users to come back to after logging in.</small>
                            <input
                                value={this.state.redirectUrl}
                                onChange={this.updateRedirectUrl.bind(this)}
                                id='oauth_redirect_url'
                                name='yourturn_oauth_redirect_url'
                                type='url' />
                        </div>
                        <div className='form-group'>
                            <label>
                                <input
                                    checked={!this.state.isClientConfidential}
                                    onChange={this.updateConfidentiality.bind(this)}
                                    data-block='confidentiality-checkbox'
                                    id='oauth_is_client_non_confidential'
                                    name='yourturn_oauth_is_client_non_confidential'
                                    type='checkbox' /> Client is non-confidential
                            </label>
                            <small>Non-confidential clients are only allowed to use the OAuth2 Implicit Flow.</small>
                        </div>
                        <div className='form-group'>
                            <label>Resource Owner Scopes</label>
                            <small>{application.name} can ask the resource owners for these scopes to be granted:</small>
                            <ScopeList
                                onSelect={this.updateScopes.bind(this)}
                                selected={this.state.scopes}
                                scopes={resourceOwnerScopes} />
                        </div>

                        <div className='btn-group'>
                            <button
                                type='submit'
                                className={`btn btn-primary ${editable ? '' : 'btn-disabled'}`}>
                                <Icon name='save' /> Save
                            </button>
                        </div>
                    </form>
                    <OAuthSyncInfo
                        onRenewCredentials={editable ? this.onRenewCredentials.bind(this) : false}
                        oauth={oauthConfig} />
                </div>;
    }
}
OAuthForm.displayName = 'OAuthForm';
OAuthForm.propTypes = {
    applicationId: React.PropTypes.string.isRequired,
    application: React.PropTypes.object.isRequired,
    resourceOwnerScopes: React.PropTypes.array.isRequired,
    allScopes: React.PropTypes.array.isRequired,
    oauthConfig: React.PropTypes.object.isRequired,
    editable: React.PropTypes.bool.isRequired,
    mintActions: React.PropTypes.object.isRequired,
    notificationActions: React.PropTypes.object.isRequired
};
OAuthForm.contextTypes = {
    router: React.PropTypes.object
};

export default OAuthForm;
