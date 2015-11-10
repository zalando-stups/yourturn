import React from 'react';
import Icon from 'react-fa';
import FetchResult from 'common/src/fetch-result';
import DefaultError from 'common/src/error.jsx';
import Violation from 'violation/src/violation-card/violation-card.jsx';
import 'common/asset/less/violation/violation-detail.less';

class ViolationDetail extends React.Component {
    constructor(props) {
        super();
        this.stores = {
            fullstop: props.fullstopStore,
            user: props.userStore
        };
        this.actions = props.fullstopActions;
    }

    resolveViolation(violation, message) {
        return this
                .actions
                .resolveViolation(violation.id, message);
    }

    render() {
        let {violationId} = this.props,
            accounts = this.stores.user.getUserCloudAccounts().map(a => a.id),
            violation = this.stores.fullstop.getViolation(violationId);
        if (violation instanceof FetchResult) {
            return violation.isPending() ?
                    <Icon name='circle-o-notch u-spinner' spin /> :
                    <DefaultError error={violation.getResult()} />;
        }
        return <div className='violationDetail'>
                    <Violation
                        flux={this.props.flux}
                        editable={accounts.indexOf(violation.account_id) >= 0}
                        onResolve={this.resolveViolation.bind(this)}
                        violation={violation} />
                </div>;
    }
}
ViolationDetail.displayName = 'ViolationDetail';
ViolationDetail.propTypes = {
    violationId: React.PropTypes.string.isRequired,
    flux: React.PropTypes.object.isRequired
};
export default ViolationDetail;
