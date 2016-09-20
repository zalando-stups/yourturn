import React from 'react';
import Icon from 'react-fa';
import _ from 'lodash';
import {Link} from 'react-router';
import * as Routes from 'application/src/routes';
import OAuthSyncInfo from 'application/src/oauth-sync-info.jsx';
import ScopeList from 'application/src/scope-list.jsx';
import EditableList from 'application/src/editable-list.jsx';
import 'common/asset/less/application/access-form.less';
import MINT_BUCKET_TEMPLATE from 'MINT_BUCKET_TEMPLATE';

function getDefaultBucket(account) {
    return MINT_BUCKET_TEMPLATE
            .replace('${id}', account);
}

class AccessForm extends React.Component {
    constructor(props) {
        super();
        const {oauthConfig} = props;
        this.state = {
            s3_buckets: oauthConfig.s3_buckets,
            scopes: oauthConfig.scopes
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

        let {applicationId, allScopes, oauthConfig} = this.props,
            appscopes = this.state.scopes,
            ownerscopes = oauthConfig
                            .scopes
                            .filter(s => allScopes.some(scp => scp.id === s.id &&
                                                            scp.resource_type_id === s.resource_type_id &&
                                                            scp.is_resource_owner_scope ));

        oauthConfig.scopes = ownerscopes.concat(appscopes);
        oauthConfig.s3_buckets = this.state.s3_buckets;

        this.props.mintActions
        .saveOAuthConfig(applicationId, oauthConfig)
        .then(() => this.context.router.push(Routes.appDetail({ applicationId })))
        .catch(e => {
            this.props.notificationActions
            .addNotification(
                'Could not save OAuth client configuration for ' + applicationId + '. ' + e.message,
                'error');
        });
    }

    render() {
        const {
            applicationId,
            application,
            applicationScopes,
            oauthConfig,
            defaultAccount,
            editable } = this.props,
            LINK_PARAMS = {applicationId};
        return <div className='accessForm'>
                    <h2>
                        <Link to={Routes.appDetail(LINK_PARAMS)}>
                            {application.name}
                        </Link> Access Control
                    </h2>
                    <div className='btn-group'>
                        <Link
                            to={Routes.appDetail(LINK_PARAMS)}
                            className='btn btn-default'>
                            <Icon name='chevron-left' /> {application.name}
                        </Link>
                    </div>
                    <OAuthSyncInfo
                        onRenewCredentials={editable ? this.onRenewCredentials.bind(this) : false}
                        oauth={oauthConfig} />
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
                                markedItems={_.difference(this.state.s3_buckets, oauthConfig.s3_buckets)}
                                pattern={'^(gs://)?[a-z0-9][a-z0-9\-\.]*[a-z0-9]$'} />
                        </div>
                        <div className='btn-group'>
                            <button
                                type='submit'
                                data-block='save-button'
                                className={`btn btn-primary ${editable ? '' : 'btn-disabled'}`}>
                                <Icon name='save' /> Save
                            </button>
                        </div>
                        <div className='form-group'>
                            <label>Application Scopes</label>
                            <small>{application.name} has the permission to access data with these scopes:</small>
                            <ScopeList
                                selected={this.state.scopes}
                                scopes={applicationScopes}
                                onSelect={this.updateScopes.bind(this)} />
                        </div>
                        <div className='btn-group'>
                            <button
                                type='submit'
                                data-block='save-button'
                                className={`btn btn-primary ${editable ? '' : 'btn-disabled'}`}>
                                <Icon name='save' /> Save
                            </button>
                        </div>
                    </form>

                </div>;
    }
}

AccessForm.displayName = 'AccessForm';

AccessForm.propTypes = {
    allScopes: React.PropTypes.array.isRequired,
    application: React.PropTypes.object.isRequired,
    applicationId: React.PropTypes.string.isRequired,
    applicationScopes: React.PropTypes.array.isRequired,
    defaultAccount: React.PropTypes.string.isRequired,
    editable: React.PropTypes.bool.isRequired,
    mintActions: React.PropTypes.object.isRequired,
    notificationActions: React.PropTypes.object.isRequired,
    oauthConfig: React.PropTypes.object.isRequired
};

AccessForm.contextTypes = {
    router: React.PropTypes.object
};

export default AccessForm;
