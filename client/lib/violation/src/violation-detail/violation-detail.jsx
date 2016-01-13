import React from 'react';
import Icon from 'react-fa';
import FetchResult from 'common/src/fetch-result';
import DefaultError from 'common/src/error.jsx';
import Violation from 'violation/src/violation-card/violation-card.jsx';
import 'common/asset/less/violation/violation-detail.less';

class ViolationDetail extends React.Component {
    constructor(props) {
        super();
    }

    resolveViolation(violation, message) {
        return this.props.fullstopActions
                .resolveViolation(violation.id, message);
    }

    render() {
        let {violationId} = this.props,
            allAccounts = this.props.teamStore.getAccounts(),
            accounts = this.props.userStore.getUserCloudAccounts().map(a => a.id),
            violation = this.props.fullstopStore.getViolation(violationId);
        if (violation instanceof FetchResult) {
            return violation.isPending() ?
                    <Icon name='circle-o-notch u-spinner' spin /> :
                    <DefaultError error={violation.getResult()} />;
        }
        return <div className='violationDetail'>
                    <Violation
                        editable={accounts.indexOf(violation.account_id) >= 0}
                        onResolve={this.resolveViolation.bind(this)}
                        accounts={allAccounts}
                        violation={violation} />
                </div>;
    }
}
ViolationDetail.displayName = 'ViolationDetail';
ViolationDetail.propTypes = {
    violationId: React.PropTypes.string.isRequired
};
export default ViolationDetail;
