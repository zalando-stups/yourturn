import React from 'react';
import Icon from 'react-fa';
import _ from 'lodash';
import {Link} from 'react-router';
import OAuthSyncInfo from 'application/src/oauth-sync-info.jsx';
import ScopeList from 'application/src/scope-list.jsx';
import EditableList from 'application/src/editable-list.jsx';
import {constructLocalUrl} from 'common/src/data/services';
import 'common/asset/less/application/access-form.less';
import MINT_BUCKET_TEMPLATE from 'MINT_BUCKET_TEMPLATE';

function getDefaultBucket(account) {
    return MINT_BUCKET_TEMPLATE
            .replace('${id}', account.id);
}

class AccessForm extends React.Component {
    constructor(props) {
        super();
        this.stores = {
            kio: props.kioStore,
            mint: props.mintStore,
            essentials: props.essentialsStore,
            user: props.userStore
        };
        let oauth = this.stores.mint.getOAuthConfig(props.applicationId);
        this.state = {
            s3_buckets: oauth.s3_buckets,
            scopes: oauth.scopes
        };
    }

    updateScopes(selectedScopes) {
        this.setState({
            scopes: selectedScopes
        });
    }

    addBucket(bucket) {
        this.setState({
            s3_buckets: this.state.s3_buckets.concat([bucket])
        });
    }

    updateBuckets(s3_buckets) {
        this.setState({
            s3_buckets: s3_buckets
        });
    }

    onRenewCredentials() {
        return this.props.mintActions
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

        this.props.mintActions
        .saveOAuthConfig(applicationId, oauthConfig)
        .then(() => this.context.router.transitionTo(constructLocalUrl('application', [applicationId])))
        .catch (e => {
            this.props.notificationActions
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
            defaultAccount = user.getUserCloudAccounts().filter(a => a.name === application.team_id)[0],
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
                    <OAuthSyncInfo
                        onRenewCredentials={isOwnApplication ? this.onRenewCredentials.bind(this) : false}
                        oauth={oauth} />
                    <form
                        data-block='form'
                        onSubmit={this.save.bind(this)}
                        className='form'>

                        <div className='form-group'>
                            <label>Credential Distribution</label>
                            <small>Activate credential distribution into these S3 buckets (<a href='http://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html'>Naming Conventions</a>). A <code>*</code> indicates unsaved changes.</small>
                            { this.state.s3_buckets.length === 0 && defaultAccount ?
                                <div data-block='mint-bucket-suggestion'>
                                    <small>Psst, your mint bucket is probably: </small>
                                    <span
                                        data-block='mint-bucket-add-suggestion'
                                        onClick={this.addBucket.bind(this, getDefaultBucket(defaultAccount))}
                                        className='btn btn-default btn-smaller'>
                                        <Icon name='plus' /> <span>{getDefaultBucket(defaultAccount)}</span>
                                    </span>
                                </div>
                                :
                                null}
                            <EditableList
                                placeholder='my-s3-bucket'
                                itemName={'bucket'}
                                minlength={3}
                                maxlength={64}
                                onChange={this.updateBuckets.bind(this)}
                                items={this.state.s3_buckets}
                                markedItems={_.difference(this.state.s3_buckets, oauth.s3_buckets)}
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
                        <div className='form-group'>
                            <label>Application Scopes</label>
                            <small>{application.name} has the permission to access data with these scopes:</small>
                            <ScopeList
                                selected={this.state.scopes}
                                scopes={allAppScopes}
                                onSelect={this.updateScopes.bind(this)} />
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

                </div>;
    }
}
AccessForm.displayName = 'AccessForm';
AccessForm.propTypes = {
    applicationId: React.PropTypes.string.isRequired,
    mintActions: React.PropTypes.object.isRequired,
    notificationActions: React.PropTypes.object.isRequired,
    kioStore: React.PropTypes.object.isRequired,
    mintStore: React.PropTypes.object.isRequired,
    userStore: React.PropTypes.object.isRequired,
    essentialsStore: React.PropTypes.object.isRequired
};
AccessForm.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default AccessForm;