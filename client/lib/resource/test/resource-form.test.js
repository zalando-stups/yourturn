/* globals expect, sinon, Promise */
import {Flummox} from 'flummox';
import EssentialsStore from 'common/src/data/essentials/essentials-store';
import EssentialsActions from 'common/src/data/essentials/essentials-actions';
import Form from 'resource/src/resource-form/resource-form';

const ESSENTIALS = 'essentials',
    RES_ID = 'sales_order',
    TEST_RES = {
        id: 'sales_order',
        name: 'Sales Order',
        description: 'Sales Orders',
        resource_owners: ['employees']
    };

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(ESSENTIALS, EssentialsActions);
        this.createStore(ESSENTIALS, EssentialsStore, this);
    }
}

describe('The resource form view', () => {
    var flux,
        actionSpy,
        form;

    beforeEach(() => {
        flux = new MockFlux();
        actionSpy = sinon.stub(flux.getActions(ESSENTIALS), 'saveResource', function () {
            return Promise.resolve();
        });
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
            flux.getStore(ESSENTIALS).beginFetchResource(RES_ID);
            expect(form.$el.find('.u-placeholder').length).to.equal(0);
        });

        it('should display the available symbol', () => {
            flux.getStore(ESSENTIALS).receiveResource(TEST_RES);
            let $available = form.$el.find('[data-block="available-symbol"]').first();
            expect($available.length).to.equal(1);
        });

        it('should disable the ID input', () => {
            flux.getStore(ESSENTIALS).receiveResource(TEST_RES);
            let $input = form.$el.find('[data-block="id-input"]').first();
            expect($input.is(':disabled')).to.be.true;
        });

        it('should call the correct action', () => {
            flux.getStore(ESSENTIALS).receiveResource(TEST_RES);
            let $input = form.$el.find('[data-block="name-input"]').first();
            $input.val('test');
            form.$el.find('form').submit();
            expect(actionSpy.calledOnce).to.be.true;
        });

    });
});
