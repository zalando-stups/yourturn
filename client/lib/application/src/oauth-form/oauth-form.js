import BaseView from 'common/src/base-view';
import Template from './oauth-form.hbs';
import Flux from 'application/src/flux';

class OAuthForm extends BaseView {
    constructor(props) {
        this.className = 'applicationOAuth';
        super(props);
    }

    update() {
        this.data = {
            applicationId: this.props.applicationId
        };
    }

    render() {
        this.$el.html(Template(this.data));
        return this;
    }
}

export default OAuthForm;
