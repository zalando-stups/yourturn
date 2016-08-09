import React from 'react';
import Icon from 'react-fa';
import {Link} from 'react-router';
import * as Routes from 'resource/src/routes';
import * as AppRoutes from 'application/src/routes';
import Markdown from 'common/src/markdown.jsx';
import Placeholder from './placeholder.jsx';
import FetchResult from 'common/src/fetch-result';
import DefaultError from 'common/src/error.jsx';
import 'common/asset/less/resource/scope-detail.less';

const ScopeDetail = (props) => {
    let {resourceId, scopeId, scope, scopeApps, canEdit} = props;
    const LINK_PARAMS = { resourceId, scopeId };

    if (scope instanceof FetchResult) {
        return (scope.isPending() ?
                <Placeholder
                    resourceId={resourceId}
                    scopeId={scopeId} /> :
                <DefaultError error={scope.getResult()} />)
    }

    return (<div className='scopeDetail'>
                <h2>
                    <Link
                        to={Routes.resDetail(LINK_PARAMS)}>
                        {resourceId}
                    </Link>.{scope.id || scopeId}
                </h2>
                <div className='btn-group'>
                    <Link
                        to={Routes.resDetail(LINK_PARAMS)}
                        className='btn btn-default'>
                        <Icon name='chevron-left' /> {resourceId}
                    </Link>
                    <Link
                        to={Routes.scpEdit(LINK_PARAMS)}
                        className={`btn btn-primary ${canEdit ? '' : 'btn-disabled'}`}>
                        <Icon name='edit' /> Edit {scope.id || scopeId}
                    </Link>
                </div>
                <table className='table'>
                    <tbody>
                        <tr>
                            <th>ID</th>
                            <td>{scope.id}</td>
                        </tr>
                        <tr>
                            <th>Summary</th>
                            <td>{scope.summary}</td>
                        </tr>
                        <tr>
                            <th>User Information</th>
                            <td>{scope.user_information}</td>
                        </tr>
                        <tr>
                            <th>Resource Owner Scope</th>
                            <td>
                                {scope.is_resource_owner_scope ?
                                    <Icon name='check-square' />
                                    :
                                    <Icon name='square-o' />}
                            </td>
                        </tr>
                        <tr>
                            <th>Applications</th>
                            <td>
                                {scopeApps.length ?
                                    <ul data-block='app-list'>
                                        {scopeApps.map(
                                            app => <li key={app.id}>
                                                        <Link
                                                            to={AppRoutes.appDetail({
                                                                applicationId: app.id
                                                            })}>
                                                            {app.id}
                                                        </Link>
                                                    </li>)}
                                    </ul>
                                    :
                                    <span>No applications with this scope.</span>}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <h4 className='scopeDetail-descriptionTitle'>Description</h4>
                <Markdown
                    className='scopeDetail-description'
                    block='description'
                    src={scope.description} />
            </div>)
};

ScopeDetail.displayName = 'ScopeDetail';

ScopeDetail.propTypes = {
    canEdit: React.PropTypes.bool,
    resourceId: React.PropTypes.string.isRequired,
    scope: React.PropTypes.object.isRequired,
    scopeApps:React.PropTypes.arrayOf(React.PropTypes.shape({
            id: React.PropTypes.string
    })),
    scopeId: React.PropTypes.string.isRequired
};

export default ScopeDetail;