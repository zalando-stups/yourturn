import BaseView from 'common/src/base-view';
import Template from './approval-card.hbs';
import Markdown from 'common/src/markdown';
import 'common/asset/scss/application/approval-card.scss';

class ApprovalCard extends BaseView {
    constructor(props) {
        this.className = 'approvalCard';
        this.state = {
            toggled: false
        };
        this.events = {
            'click': 'toggleDetails'
        };
        super(props);
    }

    toggleDetails() {
        this.state.toggled = !this.state.toggled;
        this.$el.find('.approvalCard-details').toggle(this.state.toggled);
    }

    render() {
        this.$el.html(Template(this.props));
        this.$el.find('.approvalCard-notes').html(Markdown.render(this.props.approval.notes));
        return this;
    }
}

export default ApprovalCard;
