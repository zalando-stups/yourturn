import React from 'react';
import Icon from 'react-fa';
import {Link} from 'react-router';
import OAuthSyncInfo from 'application/src/oauth-sync-info.jsx';
import ScopeList from 'application/src/scope-list.jsx';
import EditableList from 'application/src/editable-list.jsx';
import {constructLocalUrl} from 'common/src/data/services';
import 'common/asset/less/application/access-form.less';

class AccessForm extends React.Component {
    constructor(props) {
        super();
        this.stores = {
            kio: props.flux.getStore('kio'),
            mint: props.flux.getStore('mint'),
            essentials: props.flux.getStore('essentials'),
            user: props.globalFlux.getStore('user')
        };
        let oauth = this.stores.mint.getOAuthConfig(props.applicationId);
        this.state = {
            s3_buckets: oauth.s3_buckets,
            scopes: oauth.scopes
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

    updateBuckets(s3_buckets) {
        this.setState({
            s3_buckets: s3_buckets
        });
    }

    onRenewCredentials() {
        return this
                .props
                .flux
                .getActions('mint')
                .renewCredentials(this.props.applicationId);
    }

    save(evt) {
        evt.preventDefault();

        let {applicationId} = this.props,
            scopes = this.stores.essentials.getAllScopes(),
            appscopes = this.state.scopes,
            oauthConfig = this.stores.mint.getOAuthConfig(applicationId),
            ownerscopes = oauthConfig
                            .scopes
                            .filter(s => scopes.some(scp => scp.id === s.id &&
                                                            scp.resource_type_id === s.resource_type_id &&
                                                            scp.is_resource_owner_scope ));

        oauthConfig.scopes = ownerscopes.concat(appscopes);
        oauthConfig.s3_buckets = this.state.s3_buckets;

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
        let {applicationId} = this.props,
            {kio, user, mint, essentials} = this.stores,
            allAppScopes = essentials.getAllScopes().filter(s => !s.is_resource_owner_scope),
            application = kio.getApplication(applicationId),
            isOwnApplication = user.getUserCloudAccounts().some(t => t.name === application.team_id),
            oauth = mint.getOAuthConfig(applicationId);

        const LINK_PARAMS = {
            applicationId: applicationId
        };

        return <div className='accessForm'>
                    <h2>
                        <Link
                            to='application-appDetail'
                            params={LINK_PARAMS}>
                            {application.name}
                        </Link> Access Control
                    </h2>
                    <div className='btn-group'>
                        <Link
                            to='application-appDetail'
                            className='btn btn-default'
                            params={LINK_PARAMS}>
                            <Icon name='chevron-left' /> {application.name}
                        </Link>
                    </div>
                    <form
                        data-block='form'
                        onSubmit={this.save.bind(this)}
                        className='form'>
                        <div className='form-group'>
                            <label>Application Scopes</label>
                            <small>{application.name} has the permission to access data with these scopes:</small>
                            <ScopeList
                                selected={oauth.scopes}
                                scopes={allAppScopes}
                                onSelect={this.updateScopes.bind(this)} />
                        </div>
                        <div className='form-group'>
                            <label>Credential Distribution</label>
                            <small>Activate credential distribution into these S3 buckets (<a href='http://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html'>Naming Conventions</a>):</small>
                            <EditableList
                                placeholder='my-s3-bucket'
                                itemName={'bucket'}
                                minlength={3}
                                maxlength={64}
                                onChange={this.updateBuckets.bind(this)}
                                items={oauth.s3_buckets}
                                pattern={'^[a-z0-9][a-z0-9\-\.]*[a-z0-9]$'} />
                        </div>
                        <div className='btn-group'>
                            <button
                                type='submit'
                                data-block='save-button'
                                className={`btn btn-primary ${isOwnApplication ? '' : 'btn-disabled'}`}>
                                <Icon name='save' /> Save
                            </button>
                        </div>
                    </form>
                    <OAuthSyncInfo
                        onRenewCredentials={isOwnApplication ? this.onRenewCredentials.bind(this) : false}
                        oauth={oauth} />
                </div>;
    }
}
AccessForm.displayName = 'AccessForm';
AccessForm.propTypes = {
    applicationId: React.PropTypes.string.isRequired,
    flux: React.PropTypes.object.isRequired,
    globalFlux: React.PropTypes.object.isRequired
};
AccessForm.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default AccessForm;