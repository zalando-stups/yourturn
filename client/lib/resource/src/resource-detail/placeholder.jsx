import React from 'react';
import Icon from 'react-fa';
import {Link} from 'react-router';
import 'common/asset/less/resource/resource-detail.less';

class ResourceDetailPlaceholder extends React.Component {
    constructor() {
        super();
    }

    render() {
        let {resourceId} = this.props;
        const LINK_PARAMS = {
            resourceId: resourceId
        };
        return <div className='resourceDetail u-placeholder'>
                    <h2>{resourceId}</h2>
                    <div className='btn-group'>
                        <Link
                            to='resource-resList'
                            className='btn btn-default'>
                            <Icon name='chevron-left' /> Resource Types
                        </Link>
                        <Link
                            to='resource-resEdit'
                            params={LINK_PARAMS}
                            className='btn btn-default btn-disabled'>
                            <Icon name='edit' /> Edit {resourceId}
                        </Link>
                        <Link
                            to='resource-scpCreate'
                            params={LINK_PARAMS}
                            className='btn btn-default btn-disabled'>
                            <Icon name='plus' /> Create Scope
                        </Link>
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
ResourceDetailPlaceholder.displayName = 'ResourceDetailPlaceholder';
ResourceDetailPlaceholder.propTypes = {
    resourceId: React.PropTypes.string.isRequired
};
ResourceDetailPlaceholder.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default ResourceDetailPlaceholder;