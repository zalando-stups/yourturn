/* globals expect */
import {Flummox} from 'flummox';
import ApplicationStore from 'common/src/data/application/application-store';
import ApplicationActions from 'common/src/data/application/application-actions';
import AppForm from 'application/src/application-form/application-form';

const FLUX = 'application',
    APP_ID = 'kio',
    TEST_APP = {
        documentation_url: 'https://github.com/zalando-stups/kio',
        scm_url: 'https://github.com/zalando-stups/kio.git',
        service_url: 'https://kio.example.org/',
        description: '# Kio',
        subtitle: 'STUPS application registry',
        name: 'Kio',
        active: false,
        team_id: 'stups',
        id: 'kio'
    };

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(FLUX, ApplicationActions);
        this.createStore(FLUX, ApplicationStore, this);
    }
}

describe('The application form view', () => {
    var flux,
        form;

    beforeEach(() => {
        flux = new MockFlux();
    });

    describe('in create mode', () => {
        beforeEach(() => {
            form = new AppForm({
                flux: flux
            });
        });

        it('should not have a placeholder', () => {
            // form is not automatically rendered because not connected to store
            form.render();
            expect(form.$el.find('.u-placeholder').length).to.equal(0);
        });

        it('should have active checkbox preselected', () => {
            form.render();
            let $checkbox = form.$el.find('[data-block="active-checkbox"]').first();
            expect($checkbox.is(':checked')).to.be.true;
        });
    });

    describe('in edit mode', () => {
        beforeEach(() => {
            form = new AppForm({
                flux: flux,
                applicationId: APP_ID,
                edit: true
            });
        });

        it('should not have a placeholder', () => {
            flux.getStore(FLUX).beginFetchApplication(APP_ID);
            expect(form.$el.find('.u-placeholder').length).to.equal(0);
        });

        it('should not check the active box if app is inactive', () => {
            flux.getStore(FLUX).receiveApplication(TEST_APP);
            let $checkbox = form.$el.find('[data-block="active-checkbox"]').first();
            expect($checkbox.is(':checked')).to.be.false;
        });

        it('should display the taken symbol bc the app exists', () => {
            flux.getStore(FLUX).receiveApplication(TEST_APP);
            let $taken = form.$el.find('[data-block="taken-symol"]').first();
            let $available = form.$el.find('[data-block="available-symol"]').first();
            expect($taken.css('display')).to.equal('inline-block');
            expect($available.css('display')).to.equal('none');
        });
    });

});