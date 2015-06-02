/* globals ENV_TEST */
import BaseView from 'common/src/base-view';
import Template from './violation-list.hbs';
import 'common/asset/less/violation/violation-list.less';
class ViolationList extends BaseView {
    constructor(props) {
        props.className = 'violationList';
        props.stores = {
            fullstop: props.flux.getStore('fullstop'),
            user: props.globalFlux.getStore('user')
        };
        super(props);
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
