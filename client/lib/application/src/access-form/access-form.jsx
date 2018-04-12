import React from 'react';
import Immutable from 'immutable';
import Icon from 'react-fa';
import _ from 'lodash';
import {Link} from 'react-router';
import * as Routes from 'application/src/routes';
import OAuthSyncInfo from 'application/src/oauth-sync-info.jsx';
import FoldedScopeList from 'application/src/folded-scope-list.jsx';
import ClusterList from 'application/src/cluster-list.jsx';
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
            kubernetes_clusters: oauthConfig.kubernetes_clusters,
            s3_buckets: oauthConfig.s3_buckets,
            scopes: oauthConfig.scopes,
            applicationScopes: props.applicationScopes
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

    updateKubernetesClusters(selectedClusters) {
        this.setState({
          kubernetes_clusters: selectedClusters
        });
    }

    onRenewCredentials() {
        return this.props.mintActions
                .renewCredentials(this.props.applicationId);
    }

    save(evt) {
        evt.preventDefault();

        let {applicationId, oauthConfig} = this.props,
            appscopes = this.state.scopes,
            ownerscopes = oauthConfig
                            .scopes
                            .filter(s => this.state.applicationScopes.some(scp => scp.id === s.id &&
                                                            scp.resource_type_id === s.resource_type_id &&
                                                            scp.is_resource_owner_scope)),
            clusters = this.state.kubernetes_clusters;

        oauthConfig.scopes = ownerscopes.concat(appscopes);
        oauthConfig.kubernetes_clusters = clusters;
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

    fetchScopes(resourceType) {
      this.props.essentialsActions.fetchScopes(resourceType).then(val => {
        const state = this.state;
        state.applicationScopes = state.applicationScopes.set(val[0], val[1].reduce((map, res) => map.set(res.id, Immutable.fromJS(res)), Immutable.Map()));
        this.setState(state);
      });
    }

    render() {
        const {
            applicationId,
            application,
            allClusters,
            allResources,
            oauthConfig,
            defaultAccount,
            editable } = this.props,
            applicationScopes = this.state.applicationScopes,
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
                            <label>Kubernetes Clusters</label>
                            <ClusterList
                                selected={this.state.kubernetes_clusters}
                                clusters={allClusters}
                                onSelect={this.updateKubernetesClusters.bind(this)} />
                        </div>
                        <div className='btn-group'>
                            <button
                                type='submit'
                                data-block='save-button'
                                className={`btn btn-primary ${editable ? '' : 'btn-disabled'}`}>
                                <Icon name='save' /> Save
                            </button>
                        </div>
                        <div className='form-group' data-block='folded-scope-list'>
                            <label>Application Scopes</label>
                            <small>{application.name} has the permission to access data with these scopes:</small>
                            <FoldedScopeList
                                allResources={allResources}
                                selected={this.state.scopes}
                                saved={this.props.oauthConfig.scopes.map(s => {s.saved = true; return s;})}
                                scopes={applicationScopes}
                                onFold={this.fetchScopes.bind(this)}
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
    allClusters: React.PropTypes.array.isRequired,
    allResources: React.PropTypes.object.isRequired,
    allScopes: React.PropTypes.array.isRequired,
    application: React.PropTypes.object.isRequired,
    applicationId: React.PropTypes.string.isRequired,
    applicationScopes: React.PropTypes.object.isRequired,
    defaultAccount: React.PropTypes.string.isRequired,
    editable: React.PropTypes.bool.isRequired,
    essentialsActions: React.PropTypes.object.isRequired,
    kubernetesClusters: React.PropTypes.array,
    mintActions: React.PropTypes.object.isRequired,
    notificationActions: React.PropTypes.object.isRequired,
    oauthConfig: React.PropTypes.object.isRequired
};

AccessForm.contextTypes = {
    router: React.PropTypes.object
};

export default AccessForm;
