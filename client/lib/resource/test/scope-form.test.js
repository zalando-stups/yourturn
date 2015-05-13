/* globals expect */
import {Flummox} from 'flummox';
import ResourceStore from 'common/src/data/resource/resource-store';
import ResourceActions from 'common/src/data/resource/resource-actions';
import Form from 'resource/src/scope-form/scope-form';

const RES = 'resource',
      RES_ID = 'sales_order',
      SCP_ID = 'read';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(RES, ResourceActions);
        this.createStore(RES, ResourceStore, this);
    }
}


describe('The scope form view', () => {
    var flux,
        form;

    beforeEach(() => {
        flux = new MockFlux();
    });

    describe('in create mode', () => {
        beforeEach(() => {
            form = new Form({
                flux: flux
            });
        });

        it('should not have a placeholder', () => {
            form.render();
            expect(form.$el.find('.u-placeholder').length).to.equal(0);
        });

        it('should have application checkbox preselected', () => {
            form.render();
            let $checkbox = form.$el.find('[data-block="active-checkbox"]').first();
            expect($checkbox.is(':checked')).to.be.false;
        });

    });

    describe('in edit mode', () => {
        beforeEach(() => {
            form = new Form({
                flux: flux,
                resourceId: RES_ID,
                edit: true
            });
        });

        it('should not have a placeholder', () => {
            flux.getStore(RES).beginFetchScope(RES_ID, SCP_ID);
            expect(form.$el.find('.u-placeholder').length).to.equal(0);
        });

    });


});

