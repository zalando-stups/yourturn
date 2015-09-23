import Immutable from 'immutable';
import Types from './kio-types';

function approvalKey(apr) {
    return `${apr.user_id}.${apr.approved_at}.${apr.approval_type}`;
}

function ApprovalStore(state = Immutable.fromJS({
    approvals: {},
    approvalTypes: {}
}), action) {
    if (!action) {
        return state;
    }

    let {type, payload} = action;

    if (type === Types.RECEIVE_APPROVALS) {
        let [applicationId, versionId, approvals] = payload,
            aprState = approvals.reduce(
                        (map, approval) => {
                            // convert to timestamp
                            approval.timestamp = Date.parse(approval.approved_at);
                            return map.set(approvalKey(approval), Immutable.Map(approval));
                        },
                        Immutable.Map());
        return state.setIn(['approvals', applicationId, versionId], aprState);
    } else if (type === Types.RECEIVE_APPROVAL_TYPES) {
        let [applicationId, approvalTypes] = payload;
        return state.setIn(['approvalTypes', applicationId], Immutable.fromJS(approvalTypes));
    }

    return state;
}

export default ApprovalStore;