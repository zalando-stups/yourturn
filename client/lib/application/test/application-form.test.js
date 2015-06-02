/* globals expect, sinon, Promise */
import {Flummox} from 'flummox';
import KioStore from 'common/src/data/kio/kio-store';
import KioActions from 'common/src/data/kio/kio-actions';
import UserStore from 'common/src/data/user/user-store';
import UserActions from 'common/src/data/user/user-actions';
import AppForm from 'application/src/application-form/application-form';

const FLUX = 'kio',
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

class AppFlux extends Flummox {
    constructor() {
        super();

        this.createActions(FLUX, KioActions);
        this.createStore(FLUX, KioStore, this);
    }
}

class GlobalFlux extends Flummox {
    constructor() {
        super();

        this.createActions('user', UserActions);
        this.createStore('user', UserStore, this);
    }
}

describe('The application form view', () => {
    var flux,
        globalFlux,
        actionSpy,
        form;

    beforeEach(() => {
        flux = new AppFlux();
        globalFlux = new GlobalFlux();
        actionSpy = sinon.stub(flux.getActions(FLUX), 'saveApplication', function () {
            return Promise.resolve();
        });
    });

    describe('in create mode', () => {
        beforeEach(() => {
            form = new AppForm({
                flux: flux,
                globalFlux: globalFlux
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
                edit: true,
                globalFlux: globalFlux
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

        it('should display the available symbol', () => {
            flux.getStore(FLUX).receiveApplication(TEST_APP);
            let $available = form.$el.find('[data-block="available-symbol"]').first();
            expect($available.length).to.equal(1);
        });

        it('should disable the ID input', () => {
            flux.getStore(FLUX).receiveApplication(TEST_APP);
            let $input = form.$el.find('[data-block="id-input"]').first();
            expect($input.is(':disabled')).to.be.true;
        });

        it('should call the correct action', () => {
            flux.getStore(FLUX).receiveApplication(TEST_APP);
            let $input = form.$el.find('[data-block="name-input"]').first();
            $input.val('test');
            form.$el.find('form').submit();
            expect(actionSpy.calledOnce).to.be.true;
        });
    });

});
