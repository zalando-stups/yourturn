/* globals ENV_TEST */
import BaseView from 'common/src/base-view';
import Template from './violation-list.hbs';
import 'common/asset/less/violation/violation-list.less';

class ViolationList extends BaseView {
    constructor(props) {
        props.className = 'violationList';
        props.events = {
            'submit form': 'resolveViolation',
            'click [data-action="show-checked"]': 'showChecked',
            'click [data-action="show-unchecked"]': 'showUnchecked',
        };
        props.stores = {
            fullstop: props.flux.getStore('fullstop'),
            user: props.globalFlux.getStore('user')
        };
        super(props);
        this.state = {
            showingChecked: false
        };
    }

    showChecked() {
        if (this.state.showingChecked) {
            // nothing to do
            return;
        }
        this.state.showingChecked = true;
        this.update();
        this.render();
    }

    showUnchecked() {
        if (!this.state.showingChecked) {
            // nothing to do
            return;
        }
        this.state.showingChecked = false;
        this.update();
        this.render();
    }

    resolveViolation(evt) {
        evt.preventDefault();
        let {$el} = this,
            $form = $el.find(evt.target),
            comment = $form.find('input').val(),
            violationId = parseInt($form.attr('data-violation-id'), 10);

        this
        .props
        .flux
        .getActions('fullstop')
        .resolveViolation(
            violationId,
            this.stores.fullstop.getViolation(violationId),
            comment);
    }

    update() {
        let accountIds = this.stores.user.getUserCloudAccounts().map(a => a.id),
            uncheckedViolations = this.stores.fullstop.getViolations(accountIds, false),
            checkedViolations = this.stores.fullstop.getViolations(accountIds, true);
        this.data = {
            violations: this.state.showingChecked ? checkedViolations : uncheckedViolations,
            uncheckedViolations: uncheckedViolations,
            checkedViolations: checkedViolations,
            showingChecked: this.state.showingChecked
        };
    }

    render() {
        this.$el.html(Template(this.data));
        return this;
    }
}

export default ViolationList;