import React from 'react';
import Icon from 'react-fa';
import {Link} from 'react-router';
import Markdown from 'common/src/markdown.jsx';
import Placeholder from './placeholder.jsx';
import FetchResult from 'common/src/fetch-result';
import DefaultError from 'common/src/error.jsx';
import 'common/asset/less/resource/scope-detail.less';

class ScopeDetail extends React.Component {
    constructor(props) {
        super();
        this.stores = {
            essentials: props.flux.getStore('essentials'),
            user: props.flux.getStore('user')
        };
    }

    render() {
        let {resourceId, scopeId} = this.props,
            {user, essentials} = this.stores,
            scope = essentials.getScope(resourceId, scopeId),
            applications = essentials.getScopeApplications(resourceId, scopeId),
            whitelisted = user.isWhitelisted();
        const LINK_PARAMS = {
            resourceId: resourceId,
            scopeId: scopeId
        };
        if (scope instanceof FetchResult) {
            return scope.isPending() ?
                    <Placeholder
                        resourceId={resourceId}
                        scopeId={scopeId} /> :
                    <DefaultError error={scope.getResult()} />;
        }
        return <div className='scopeDetail'>
                    <h2>
                        <Link
                            to='resource-resDetail'
                            params={LINK_PARAMS}>
                            {resourceId}
                        </Link>.{scope.id || scopeId}
                    </h2>
                    <div className='btn-group'>
                        <Link
                            to='resource-resDetail'
                            params={LINK_PARAMS}
                            className='btn btn-default'>
                            <Icon name='chevron-left' /> {resourceId}
                        </Link>
                        <Link
                            to='resource-scpEdit'
                            params={LINK_PARAMS}
                            className={`btn btn-primary ${whitelisted ? '' : 'btn-disabled'}`}>
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
                                    {applications.length ?
                                        <ul data-block='app-list'>
                                            {applications.map(
                                                app => <li key={app.id}>
                                                            <Link
                                                                to='application-appDetail'
                                                                params={{
                                                                    applicationId: app.id
                                                                }}>
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
                </div>;
    }
}
ScopeDetail.displayName = 'ScopeDetail';
ScopeDetail.propTypes = {
    resourceId: React.PropTypes.string.isRequired,
    scopeId: React.PropTypes.string.isRequired
};
export default ScopeDetail;