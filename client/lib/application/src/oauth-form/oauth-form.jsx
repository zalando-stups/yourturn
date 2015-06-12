import React from 'react';
import OAuthSyncInfo from 'application/src/oauth-sync-info.jsx';
import ScopeList from 'application/src/scope-list.jsx';
import {constructLocalUrl} from 'common/src/data/services';
import 'common/asset/less/application/oauth-form.less';

class OAuthForm extends React.Component {
    constructor(props) {
        super();
        this.stores = {
            kio: props.flux.getStore('kio'),
            mint: props.flux.getStore('mint'),
            user: props.globalFlux.getStore('user'),
            essentials: props.flux.getStore('essentials')
        };

        let oauthConfig = this.stores.mint.getOAuthConfig(props.applicationId);
        this.state = {
            scopes: oauthConfig.scopes,
            redirectUrl: oauthConfig.redirect_url,
            isClientConfidential: oauthConfig.is_client_confidential
        };

        this._forceUpdate = this.forceUpdate.bind(this);
        this.stores.user.on('change', this._forceUpdate);
    }

    componentWillUnmount() {
        this.stores.user.off('change', this._forceUpdate);
    }

    updateScopes(selectedScopes) {
        this.setState({
            scopes: selectedScopes
        });
    }

    updateConfidentiality(evt) {
        this.setState({
            isClientConfidential: !evt.target.checked
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
        if (evt) {
            evt.preventDefault();
        }
        let {applicationId} = this.props,
            scopes = this.stores.essentials.getAllScopes(),
            ownerscopes = this.state.scopes,
            oauthConfig = this.stores.mint.getOAuthConfig(applicationId),
            appscopes = oauthConfig
                            .scopes
                            .filter(s => scopes.some(scp => scp.id === s.id && 
                                                            scp.resource_type_id === s.resource_type_id &&
                                                            !scp.is_resource_owner_scope ));
        
        oauthConfig.scopes = ownerscopes.concat(appscopes);
        oauthConfig.redirect_url = this.state.redirectUrl;
        oauthConfig.is_client_confidential = this.state.isClientConfidential;

        this
        .props
        .flux
        .getActions('mint')
        .saveOAuthConfig(applicationId, oauthConfig)
        .then(() => this.context.router.transitionTo(constructLocalUrl('application', [applicationId])))
        .catch(e => {
            this
            .props
            .globalFlux
            .getActions('notification')
            .addNotification(
                'Could not save OAuth client configuration for ' + applicationId + '. ' + e.message,
                'error');
        });
    }

    render() {
        let {kio, mint, user, essentials} = this.stores,
            {applicationId} = this.props,
            application = kio.getApplication(applicationId),
            isOwnApplication = user.getUserTeams().some(t => t.id === application.team_id),
            allRoScopes = essentials.getAllScopes().filter(s => s.is_resource_owner_scope),
            oauth = mint.getOAuthConfig(applicationId);

        return  <div className='oAuthForm'>    
                    <h2><a href={`/application/detail/${application.id}`}>{application.name}</a> OAuth Client</h2>
                    <div className='btn-group'>
                        <a href={`/application/detail/${application.id}`} className='btn btn-default'>
                            <i className='fa fa-chevron-left'></i> {application.name}
                        </a>
                    </div>
                    <form
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
                                    defaultChecked={this.state.isClientConfidential ? null : 'checked'}
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
                                selected={oauth.scopes}
                                scopes={allRoScopes} />
                        </div>
                        
                        <div className='btn-group'>
                            <button
                                type='submit'
                                className={`btn btn-primary ${isOwnApplication ? '' : 'btn-disabled'}`}>
                                <i className='fa fa-save'></i> Save
                            </button>
                        </div>
                    </form>
                    <OAuthSyncInfo oauth={oauth} />
                </div>;
    }
}

OAuthForm.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default OAuthForm;