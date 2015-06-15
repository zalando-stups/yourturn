import React from 'react';

export default class VersionFormPlaceholder extends React.Component {
    constructor() {
        super();
    }

    render() {
        let {applicationId, versionId} = this.props;
        return <div className='versionDetail u-placeholder'>
                    <h2>
                        <a href='/application/detail/{applicationId}'>{applicationId}</a> 
                        <span className='u-placeholder-text'>0.10.0</span>
                    </h2>

                    <div className='btn-group'>
                        <a href='/application/detail/{applicationId}/version' className='btn btn-default'>
                            <i className='fa fa-chevron-left'></i> {applicationId} versions
                        </a>
                        <a href='/application/detail/{applicationId}/version/edit/{versionId}' className='btn btn-default btn-disabled'>
                            <i className='fa fa-edit'></i> Edit {versionId}
                        </a>
                        <a href='/application/detail/{applicationId}/version/approve/{versionId}' className='btn btn-primary'>
                            <i className='fa fa-check'></i> Approvals <span className='badge'>?</span>
                        </a>
                    </div>

                    <table className='table'>
                        <tbody>
                            <tr>
                                <th>ID</th>
                                <td className='u-placeholder-text'>0.10.0</td>
                            </tr>
                            <tr>
                                <th>Last modified</th>
                                <td className='u-placeholder-text'>May 28th 2025</td>
                            </tr>
                            <tr>
                                <th>Artifact</th>
                                <td className='u-placeholder-text'>docker://whatever.io</td>
                            </tr>
                        </tbody>
                    </table>
                    <h4 className='versionDetail-notesTitle'>Notes</h4>
                    <p className='u-placeholder-text'>
                        These are some version notes.
                    </p>
                </div>
    }
}