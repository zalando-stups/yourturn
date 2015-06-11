/* globals expect, sinon, Promise */
import {Flummox} from 'flummox';
import KioStore from 'common/src/data/kio/kio-store';
import KioActions from 'common/src/data/kio/kio-actions';
import VersionForm from 'application/src/version-form/version-form.jsx';

const FLUX = 'kio',
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
    },
    TEST_APPROVALS = [{
        application_id: APP_ID,
        version_id: VER_ID,
        approval_type: 'TESTED',
        user_id: 'npiccolotto',
        approved_at: '2015-04-25T16:25:00'
    }, {
        application_id: APP_ID,
        version_id: VER_ID,
        approval_type: 'TESTED',
        user_id: 'tobi',
        approved_at: '2015-04-25T16:40:00'
    }];

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(FLUX, KioActions);
        this.createStore(FLUX, KioStore, this);
    }
}

describe('The version form view', () => {
    var flux,
        actionSpy,
        props,
        form;

    beforeEach(() => {
        flux = new MockFlux();
        actionSpy = sinon.stub(flux.getActions(FLUX), 'saveApplicationVersion', function () {
            return Promise.resolve();
        });
    });

    describe('in create mode', () => {
        beforeEach(done => {
            reset(() => {
                flux.getStore(FLUX).receiveApplication(TEST_APP);
                flux.getStore(FLUX).receiveApplicationVersion(TEST_VERSION);
                props = {
                    flux: flux,
                    applicationId: APP_ID,
                    versionId: VER_ID,
                    edit: false
                };
                form = render(VersionForm, props);
                done();
            });
        });
    });

    describe('in edit mode', () => {
        beforeEach(done => {
            reset(() => {
                flux.getStore(FLUX).receiveApplication(TEST_APP);
                flux.getStore(FLUX).receiveApplicationVersion(TEST_VERSION);
                props = {
                    flux: flux,
                    applicationId: APP_ID,
                    versionId: VER_ID,
                    edit: true
                };
                form = render(VersionForm, props);
                done();
            });
        });

        it('should call the correct action', () => {
            form.save();
            expect(actionSpy.calledOnce).to.be.true;
        });

        it('should display a warning when there are approvals', () => {
            flux.getStore(FLUX).receiveApprovals([APP_ID, VER_ID, TEST_APPROVALS]);
            form = render(VersionForm, props);
            TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'warning');
        });
    });

});