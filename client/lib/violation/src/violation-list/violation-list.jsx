import React from 'react';
import Violation from 'violation/src/violation-card/violation-card.jsx';
import 'common/asset/less/violation/violation-list.less';

class ViolationList extends React.Component {
    constructor(props) {
        super();
        this.stores = {
            fullstop: props.flux.getStore('fullstop'),
            user: props.globalFlux.getStore('user')
        };
        this.state = {
            showingResolved: false
        };
    }

    showResolved(showResolved) {
        this.setState({
            showingResolved: showResolved
        });
    }

    render() {
        let {showingResolved} = this.state,
            accountIds = this.stores.user.getUserCloudAccounts().map(a => a.id),
            unresolvedViolations = this.stores.fullstop.getViolations(accountIds, false),
            resolvedViolations = this.stores.fullstop.getViolations(accountIds, true),
            violations = showingResolved ? resolvedViolations : unresolvedViolations;
        return <div className='violationList'>
                    <h2 className='violationList-headline'>Violations</h2>
                    <div className='u-info'>
                        Violations of the STUPS policy and bad practices in accounts you have access to.
                    </div>

                    <div className='tabs'>
                        <div
                            onClick={this.showResolved.bind(this, false)}
                            className={'tab ' + (showingResolved ? '' : 'is-active')}>
                            Unresolved <span className='badge'>{unresolvedViolations.length}</span>
                        </div>
                        <div
                            onClick={this.showResolved.bind(this, true)}
                            className={'tab ' + (showingResolved ? 'is-active' : '')}>
                            Resolved <span className='badge'>{resolvedViolations.length}</span>
                        </div>
                    </div>
                    {violations.length ?
                        violations.map((v, i) => <Violation
                                                    key={v.id}
                                                    autoFocus={i === 0}
                                                    flux={this.props.flux}
                                                    violation={v} />)
                        :
                        <span>Wow, no violations! You are a good person.</span>}
                </div>;
    }
}
ViolationList.displayName = 'ViolationList';
ViolationList.propTypes = {
    flux: React.PropTypes.object.isRequired
};

export default ViolationList;