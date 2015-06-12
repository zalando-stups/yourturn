import BaseView from 'common/src/base-view';
import Template from './violation-list.hbs';
import 'common/asset/less/violation/violation-list.less';

class ViolationList extends BaseView {
    constructor(props) {
        props.className = 'violationList';
        props.events = {
            'submit form': 'resolveViolation',
            'click [data-action="show-resolved"]': 'showResolved',
            'click [data-action="show-unresolved"]': 'showUnresolved'
        };
        props.stores = {
            fullstop: props.flux.getStore('fullstop'),
            user: props.globalFlux.getStore('user')
        };
        super(props);
        this.state = {
            showingResolved: false
        };
    }

    showResolved() {
        if (this.state.showingResolved) {
            // nothing to do
            return;
        }
        this.state.showingResolved = true;
        this.update();
        this.render();
    }

    showUnresolved() {
        if (!this.state.showingResolved) {
            // nothing to do
            return;
        }
        this.state.showingResolved = false;
        this.update();
        this.render();
    }

    resolveViolation(evt) {
        evt.preventDefault();
        let {$el} = this,
            $form = $el.find(evt.target),
            message = $form.find('input').val(),
            violationId = parseInt($form.attr('data-violation-id'), 10);

        this
        .props
        .flux
        .getActions('fullstop')
        .resolveViolation(
            violationId,
            message);
    }

    update() {
        let accountIds = this.stores.user.getUserCloudAccounts().map(a => a.id),
            unresolvedViolations = this.stores.fullstop.getViolations(accountIds, false),
            resolvedViolations = this.stores.fullstop.getViolations(accountIds, true);
        this.data = {
            violations: this.state.showingResolved ? resolvedViolations : unresolvedViolations,
            unresolvedViolations: unresolvedViolations,
            resolvedViolations: resolvedViolations,
            showingResolved: this.state.showingResolved
        };
    }

    render() {
        this.$el.html(Template(this.data));
        return this;
    }
}

export default ViolationList;