import React from 'react';
import Markdown from 'common/src/markdown.jsx';
import 'common/asset/less/resource/scope-detail.less';

class ScopeDetail extends React.Component {
    constructor(props) {
        super();
        this.stores = {
            essentials: props.flux.getStore('essentials'),
            user: props.globalFlux.getStore('user')
        };
        this._forceUpdate = this.forceUpdate.bind(this);
        this.stores.user.on('change', this._forceUpdate);
    }

    componentWillUnmount() {
        this.stores.user.off('change', this._forceUpdate);
    }

    render() {
        let {resourceId, scopeId} = this.props,
            {user, essentials} = this.stores,
            resource = essentials.getResource(resourceId),
            scope = essentials.getScope(resourceId, scopeId),
            applications = essentials.getScopeApplications(scopeId),
            whitelisted = user.isWhitelisted();
        return <div className='scopeDetail'>
                    <h2>
                        <a href='/resource/detail/{resourceId}'>{resourceId}</a>.{scope.id || scopeId}
                    </h2>
                    <div className='btn-group'>
                        <a
                            href='/resource/detail/{resourceId}'
                            className='btn btn-default'>
                            <i className='fa fa-chevron-left'></i> {resourceId}
                        </a>
                        <a
                            href='/resource/detail/{resourceId}/scope/edit/{scope.id}'
                            className={`btn btn-primary ${whitelisted ? '' : 'btn-disabled'}`}>
                            <i className='fa fa-pencil'></i> Edit {scope.id || scopeId}
                        </a>
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
                                        <i className='fa fa-check-square'></i>
                                        :
                                        <i className='fa fa-square-o'></i>}
                                </td>
                            </tr>
                            <tr>
                                <th>Applications</th>
                                <td>
                                    {applications.length ?
                                        <ul>
                                            applications.map(
                                                app => <li key={app.id}>
                                                            <a href='/application/detail/{this.id}'>
                                                                {app.id}
                                                            </a>
                                                        </li>)
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

export default ScopeDetail;