import React from 'react';
import Violation from 'violation/src/violation-card/violation-card.jsx';
import 'common/asset/less/violation/violation-detail.less';

class ViolationDetail extends React.Component {
    constructor(props) {
        super();
        this.stores = {
            fullstop: props.flux.getStore('fullstop')
        };
    }

    render() {
        let {violationId} = this.props,
            violation = this.stores.fullstop.getViolation(violationId);
        return <div className='violationDetail'>
                    <Violation
                        flux={this.props.flux}
                        autoFocus={violation && violation.comment != null}
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
