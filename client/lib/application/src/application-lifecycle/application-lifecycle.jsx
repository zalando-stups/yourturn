import React from 'react';
import Icon from 'react-fa';
import {Link} from 'react-router';
import * as Routes from 'application/src/routes';
import ComboBox from 'common/components/pure/ComboBox.jsx'

class ApplicationLifeCycle extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedVersions: []
        };

        this.onComboBoxSelect = this.onComboBoxSelect.bind(this);
        this.onComboBoxReset = this.onComboBoxReset.bind(this);
    }

    onComboBoxSelect(param) {
        this.setState({selectedVersions: param});
        console.log("onComboBoxSelect %O", param);
    }

    onComboBoxReset() {
        this.setState({selectedVersions: []});
    }

    render() {
        const {applicationId, kioStore} = this.props,
            application = kioStore.getApplication(applicationId);
        const LINK_PARAMS = {
            applicationId: applicationId
        };

        console.log("props: %O", this.props);
        console.log("state: %O", this.state);

        return (
            <div>
                <h2>
                    <Link
                        to={Routes.appDetail(LINK_PARAMS)}>
                        {application.name || applicationId}'s
                    </Link> application lifecycle
                </h2>
                <div className='btn-group'>
                    <Link
                        to={Routes.appDetail(LINK_PARAMS)}
                        className='btn btn-default'>
                        <Icon name='chevron-left' /> {application.name || applicationId}
                    </Link>
                </div>
                <div>
                    <ComboBox
                        valueField       = 'id'
                        textField        = 'id'
                        value            = {this.state.selectedVersions}
                        data             = {[]}
                        onChange         = {this.onComboBoxSelect}
                        onReset          = {this.onComboBoxReset}
                        resetButtonTitle = 'Reset'
                        title            = 'Select Versions'
                    />
                </div>
            </div>
        )
    }
}

export default ApplicationLifeCycle;