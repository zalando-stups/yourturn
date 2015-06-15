import React from 'react';

export default class ScopeDetailPlaceholder extends React.Component {
    constructor() {
        super();
    }

    render() {
        let {resourceId, scopeId} = this.props;
        return <div className='scopeDetail u-placeholder'>
                    <h2>
                        <a href='/resource/detail/{resourceId}'>{resourceId}</a>.{scopeId}
                    </h2>
                    <div className='btn-group'>
                        <a
                            href='/resource/detail/{resourceId}'
                            className='btn btn-default'>
                            <i className='fa fa-chevron-left'></i> {resourceId}
                        </a>
                        <a
                            href='/resource/detail/{resourceId}/scope/edit/{scope.id}'
                            className='btn btn-primary btn-disabled'>
                            <i className='fa fa-pencil'></i> Edit {scopeId}
                        </a>
                    </div>
                    <table className='table'>
                        <tbody>
                            <tr>
                                <th>ID</th>
                                <td className='u-placeholder-text'>Name</td>
                            </tr>
                            <tr>
                                <th>Summary</th>
                                <td className='u-placeholder-text'>Summary of the scope</td>
                            </tr>
                            <tr>
                                <th>User Information</th>
                                <td className='u-placeholder-text'>User information for this scope</td>
                            </tr>
                            <tr>
                                <th>Resource Owner Scope</th>
                                <td>
                                    <i className='fa fa-square-o'></i>
                                </td>
                            </tr>
                            <tr>
                                <th>Applications</th>
                                <td>
                                    <ul>
                                        <li className='u-placeholder-text'>
                                            application 1
                                        </li>
                                        <li className='u-placeholder-text'>
                                            app two
                                        </li>
                                        <li className='u-placeholder-text'>
                                            app
                                        </li>

                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <h4 className='scopeDetail-descriptionTitle'>Description</h4>
                    <p className='u-placeholder-text'>
                        random scope notes
                    </p>
                </div>;
    }
}