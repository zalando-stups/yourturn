/* globals ENV_TEST */
import BaseView from 'common/src/base-view';
import Template from './violation-list.hbs';
import 'common/asset/less/violation/violation-list.less';
class ViolationList extends BaseView {
    constructor(props) {
        props.className = 'violationList';
        props.events = {
            'submit form': 'resolveViolation'
        };
        props.stores = {
            fullstop: props.flux.getStore('fullstop'),
            user: props.globalFlux.getStore('user')
        };
        super(props);
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
        .resolveViolation(violationId, comment);
    }

    update() {
        this.data = {
            violations: this.stores.fullstop.getViolations()
        };
    }

    render() {
        this.$el.html(Template(this.data));
        return this;
    }
}

export default ViolationList;
