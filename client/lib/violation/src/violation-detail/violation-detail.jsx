import React from 'react';
import Violation from 'violation/src/violation-card/violation-card.jsx';
import 'common/asset/less/violation/violation-detail.less';

class ViolationDetail extends React.Component {
    constructor(props) {
        super();
        this.stores = {
            fullstop: props.flux.getStore('fullstop'),
            user: props.flux.getStore('user')
        };
        this.actions = props.flux.getActions('fullstop');
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
        return <div className='violationDetail'>
                    <Violation
                        flux={this.props.flux}
                        editable={accounts.indexOf(violation.account_id) >= 0}
                        onResolve={this.resolveViolation.bind(this)}
                        autoFocus={this.props.autoFocus || (violation && violation.comment != null)}
                        violation={violation} />
                </div>;
    }
}
ViolationDetail.displayName = 'ViolationDetail';
ViolationDetail.propTypes = {
    violationId: React.PropTypes.string.isRequired,
    flux: React.PropTypes.object.isRequired,
    autoFocus: React.PropTypes.bool
};
export default ViolationDetail;
