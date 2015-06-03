/* globals ENV_TEST */
import BaseView from 'common/src/base-view';
import Template from './violation-list.hbs';
import 'common/asset/less/violation/violation-list.less';

// import moment from 'moment';
// import 'pickadate/lib/picker.date';
// import 'pickadate/lib/picker.time';
// import 'pickadate/lib/themes/classic.css';
// import 'pickadate/lib/themes/classic.date.css';
// import 'pickadate/lib/themes/classic.time.css';

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
        let uncheckedViolations = this.stores.fullstop.getViolations(undefined, false),
            checkedViolations = this.stores.fullstop.getViolations(undefined, true);
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
        
        /**
         * Uncomment once we filter violations by date
         */

        // datetime pickers below
        // 
        // const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;
        // this
        // .$el
        // .find('[data-action="datepicker-start"]')
        // .pickadate({
        //     selectYears: true,
        //     selectMonths: true,
        //     max: true,
        //     clear: false,
        //     onStart: function() {
        //         var date = moment().subtract(7, 'days').toDate();
        //         this.set('select', [date.getFullYear(), date.getMonth(), date.getDate()]);
        //     }
        // });
        // this
        // .$el
        // .find('[data-action="datepicker-end"]')
        // .pickadate({
        //     selectYears: true,
        //     selectMonths: true,
        //     max: true,
        //     clear: false,
        //     onStart: function() {
        //         var date = new Date();
        //         this.set('select', [date.getFullYear(), date.getMonth(), date.getDate()]);
        //     }
        // });
        // this.$el.find('[data-action="timepicker-start"]')
        //     .pickatime({
        //         max: true,
        //         clear: false,
        //         onStart: function() {
        //             this.set('select', [8, 0]);
        //         }
        //     });
        // this.$el.find('[data-action="timepicker-end"]')
        //     .pickatime({
        //         max: true,
        //         clear: false,
        //         onStart: function() {
        //             var date = new Date();
        //             this.set('select', [date.getHours(), date.getMinutes()]);
        //         }
        //     });
    }
}

export default ViolationList;