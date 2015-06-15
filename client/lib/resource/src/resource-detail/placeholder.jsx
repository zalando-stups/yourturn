import React from 'react';
import 'common/asset/less/resource/resource-detail.less';

export default class ResourceDetailPlaceholder extends React.Component {
    constructor() {
        super();
    }

    render() {
        let {resourceId} = this.props;
        return <div className='resourceDetail u-placeholder'>
                    <h2>{resourceId}</h2>
                    <div className='btn-group'>
                        <a href='/resource' className='btn btn-default'>
                            <i className='fa fa-chevron-left'></i> Resource Types
                        </a>
                        <a href='/resource/edit/{resourceId}' className='btn btn-default btn-disabled'>
                            <i className='fa fa-pencil'></i> Edit {resourceId}
                        </a>
                        <a href='/resource/detail/{resourceId}/create' className='btn btn-primary btn-disabled'>
                            <i className='fa fa-plus'></i> Create Scope
                        </a>
                    </div>
                    <table className='table'>
                        <tbody>
                            <tr>
                                <th>ID</th>
                                <td>{resourceId}</td>
                            </tr>
                            <tr>
                                <th>Name</th>
                                <td className='u-placeholder-text'>Sales Order</td>
                            </tr>
                            <tr>
                                <th>Resource Owners</th>
                                <td>
                                    <ul>
                                        <li className='u-placeholder-text'>Yo moma</li>
                                        <li className='u-placeholder-text'>Yo father</li>
                                        <li className='u-placeholder-text'>Yo moma again</li>
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className='grid with-gutter'>
                        <div className='grid-col'>
                            <h4 className='resourceDetail-appScopeTitle'>Application Scopes</h4>
                            <ul>
                                <li className='u-placeholder-text'>Scope 1</li>
                                <li className='u-placeholder-text'>Scope 2</li>
                            </ul>
                        </div>
                        <div className='grid-col'>
                            <h4 className='resourceDetail-ownerScopeTitle'>Resource Owner Scopes</h4>
                            <ul>
                                <li className='u-placeholder-text'>Scope 3</li>
                                <li className='u-placeholder-text'>Scope 4</li>
                            </ul>
                        </div>
                    </div>
                    <h4 className='resourceDetail-descriptionTitle'>Description</h4>
                </div>;
    }
}