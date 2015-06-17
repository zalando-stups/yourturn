import React from 'react';
import Icon from 'react-fa';
import {Link} from 'react-router';

class ScopeDetailPlaceholder extends React.Component {
    constructor() {
        super();
    }

    render() {
        let {resourceId, scopeId} = this.props;
        const LINK_PARAMS = {
            resourceId: resourceId,
            scopeId: scopeId
        };
        return <div className='scopeDetail u-placeholder'>
                    <h2>
                        <Link
                            to='resource-resDetail'
                            params={LINK_PARAMS}>
                            {resourceId}
                        </Link>.{scopeId}
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
                            className='btn btn-primary btn-disabled'>
                            <Icon name='edit' /> Edit {scopeId}
                        </Link>
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
                                    <Icon name='square-o' />
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
ScopeDetailPlaceholder.displayName = 'ScopeDetailPlaceholder';
ScopeDetailPlaceholder.propTypes = {
    resourceId: React.PropTypes.string.isRequired,
    scopeId: React.PropTypes.string.isRequired
};

export default ScopeDetailPlaceholder;