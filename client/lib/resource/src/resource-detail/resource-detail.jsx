import React from 'react';
import Icon from 'react-fa';
import {Link} from 'react-router';
import * as Routes from 'resource/src/routes';
import Markdown from 'common/src/markdown.jsx';
import Placeholder from './placeholder.jsx';
import FetchResult from 'common/src/fetch-result';
import DefaultError from 'common/src/error.jsx';
import 'common/asset/less/resource/resource-detail.less';

const ResourceDetail = (props) => {
    const {resourceId, canEdit, resource, scopes} = props,
        appScopes = scopes.filter(s => !s.is_resource_owner_scope),
        ownerScopes = scopes.filter(s => s.is_resource_owner_scope);

    const LINK_PARAMS = {resourceId};
    if (resource instanceof FetchResult) {
        return resource.isPending() ?
                <Placeholder
                    resourceId={resourceId} /> :
                <DefaultError
                    error={resource.getResult()} />;
    }

    return <div className='resourceDetail'>
                <h2>{resource.name || resourceId}</h2>
                <div className='btn-group'>
                    <Link
                        to={Routes.resList(LINK_PARAMS)}
                        className='btn btn-default'>
                        <Icon name='chevron-left' /> Resource Types
                    </Link>
                    <Link
                        to={Routes.resEdit(LINK_PARAMS)}
                        className={`btn btn-default ${ canEdit ? '' : 'btn-disabled'}`}>
                        <Icon name='edit' /> Edit {resource.name}
                    </Link>
                    <Link
                        to={Routes.scpCreate(LINK_PARAMS)}
                        className={`btn btn-primary ${ canEdit ? '' : 'btn-disabled'}`}>
                        <Icon name='plus' /> Create Scope
                    </Link>
                </div>
                <table className='table'>
                    <tbody>
                        <tr>
                            <th>ID</th>
                            <td>{resource.id}</td>
                        </tr>
                        <tr>
                            <th>Name</th>
                            <td>{resource.name}</td>
                        </tr>
                        <tr>
                            <th>Resource Owners</th>
                            <td>
                                {resource.resource_owners && resource.resource_owners.length ?
                                    resource.resource_owners.map(
                                        owner => <li key={owner}>{owner}</li>)
                                    :
                                    <span>Nobody owns {resource.name}.</span>}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className='grid with-gutter'>
                    <div className='grid-col'>
                        <h4 className='resourceDetail-appScopeTitle'>Application Scopes</h4>
                        {appScopes.length ?
                            <ul>
                                {appScopes.map(
                                    scope => <li key={scope.id}>
                                                <Link
                                                    to={Routes.scpDetail({
                                                        resourceId: resourceId,
                                                        scopeId: scope.id
                                                    })}>
                                                    {scope.id}
                                                </Link>
                                            </li>)}
                            </ul>
                            :
                            <span>No application scopes.</span>}
                    </div>
                    <div className='grid-col'>
                        <h4 className='resourceDetail-ownerScopeTitle'>Resource Owner Scopes</h4>
                        {ownerScopes.length ?
                            <ul>
                                {ownerScopes.map(
                                    scope => <li key={scope.id}>
                                                <Link
                                                    to={Routes.scpDetail({
                                                        resourceId: resourceId,
                                                        scopeId: scope.id
                                                    })}>
                                                    {scope.id}
                                                </Link>
                                            </li>)}
                            </ul>
                            :
                            <span>No resource owner scopes.</span>}
                    </div>
                </div>
                <h4 className='resourceDetail-descriptionTitle'>Description</h4>
                <Markdown
                    src={resource.description}
                    className='resourceDetail-description'
                    block='description' />
            </div>;
}

ResourceDetail.displayName = 'ResourceDetail';

// TODO go more into detail
ResourceDetail.propTypes = {
    canEdit: React.PropTypes.bool,
    resource: React.PropTypes.object.isRequired,
    resourceId: React.PropTypes.string.isRequired,
    scopes: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string,
        is_resource_owner_scope: React.PropTypes.bool
    }))
};

export default ResourceDetail;