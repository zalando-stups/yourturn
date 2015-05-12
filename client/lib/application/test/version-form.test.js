/* globals expect, sinon, Promise */
import {Flummox} from 'flummox';
import ApplicationStore from 'common/src/data/application/application-store';
import ApplicationActions from 'common/src/data/application/application-actions';
import VersionForm from 'application/src/version-form/version-form';

const FLUX = 'application',
    APP_ID = 'kio',
    VER_ID = '0.1',
    TEST_APP = {
        documentation_url: 'https://github.com/zalando-stups/kio',
        scm_url: 'https://github.com/zalando-stups/kio.git',
        service_url: 'https://kio.example.org/',
        description: '# Kio',
        subtitle: 'STUPS application registry',
        name: 'Kio',
        active: false,
        team_id: 'stups',
        id: APP_ID
    },
    TEST_VERSION = {
        id: VER_ID,
        application_id: APP_ID,
        artifact: `docker://stups/${APP_ID}:${VER_ID}`,
        notes: '# Test'
    };

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(FLUX, ApplicationActions);
        this.createStore(FLUX, ApplicationStore, this);
    }
}

describe('The version form view', () => {
    var flux,
        actionSpy,
        form;

    beforeEach(() => {
        flux = new MockFlux();
        actionSpy = sinon.stub(flux.getActions(FLUX), 'saveApplicationVersion', function () {
            return Promise.resolve();
        });
    });

    describe('in create mode', () => {
        beforeEach(() => {
            flux.getStore(FLUX).receiveApplication(TEST_APP);
            flux.getStore(FLUX).receiveApplicationVersion(TEST_VERSION);
            form = new VersionForm({
                flux: flux,
                applicationId: APP_ID,
                versionId: VER_ID
            });
        });

        it('should not have a placeholder', () => {
            form.render();
            expect(form.$el.find('.u-placeholder').length).to.equal(0);
        });
    });

    describe('in edit mode', () => {
        beforeEach(() => {
            flux.getStore(FLUX).receiveApplication(TEST_APP);
            flux.getStore(FLUX).receiveApplicationVersion(TEST_VERSION);
            form = new VersionForm({
                flux: flux,
                applicationId: APP_ID,
                versionId: VER_ID,
                edit: true
            });
        });

        it('should not have a placeholder', () => {
            flux.getStore(FLUX).beginFetchApplicationVersion(APP_ID, VER_ID);
            expect(form.$el.find('.u-placeholder').length).to.equal(0);
        });

        it('should disable the ID input', () => {
            let $input = form.$el.find('[data-block="id-input"]').first();
            expect($input.is(':disabled')).to.be.true;
        });

        it('should call the correct action', () => {
            form.$el.find('form').submit();
            expect(actionSpy.calledOnce).to.be.true;
        });
    });

});