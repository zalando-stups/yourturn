import $ from 'jquery';
import {history} from 'backbone';
import BaseView from 'common/src/base-view';
import Template from './sidebar.hbs';
import {Provider} from 'common/src/oauth-provider';
import 'common/asset/scss/yourturn/sidebar.scss';

class SidebarView extends BaseView {
    constructor(props) {
        super({
            tagName: 'aside',
            className: 'sidebar',
            events: {
                'click [data-action="logout"]': 'logout',
                'click .sidebar-item': 'transition'
            },
            store: props.flux.getStore('tokeninfo')
        });
        this.interval = false;
        this.actions = props.flux.getActions('tokeninfo');
    }

    /**
     * Checks if this sidebar item has a data-route
     * attribute. If it does, navigates to this route.
     */
    transition(evt) {
        let $target = $(evt.currentTarget),
            route = $target.attr('data-route') || false;
        if (route) {
            history.navigate(route, {
                trigger: true
            });
        }
    }

    logout() {
        this.actions.deleteTokenInfo();
        this.update();
        this.render();
    }

    update() {
        let info = this.store.getTokenInfo();
        console.log(info);
        this.data = {
            tokeninfo: info
        };
    }

    render() {
        this.$el.html(Template(this.data));
        if (this.interval) {
            clearInterval(this.interval);
        }
        // this.interval = setInterval(() => this.$el.html(Template(this.data)), 5000);
        return this;
    }
}

export default SidebarView;