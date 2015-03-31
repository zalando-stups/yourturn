import {View} from 'backbone';

class ApplicationView extends View {
    constructor() {
        super();
    }

    render() {
        this.$el.html('<h1>YO</h1>');
        return this;
    }
}

export default ApplicationView;