/* globals expect, TestUtils, reset, render, sinon, Promise, $, React */
import KioStore from 'common/src/data/kio/kio-store';
import KioTypes from 'common/src/data/kio/kio-types';
import * as KioGetter from 'common/src/data/kio/kio-getter';
import * as KioActions from 'common/src/data/kio/kio-actions';

import UserStore from 'common/src/data/user/user-store';
import * as UserGetter from 'common/src/data/user/user-getter';

import VersionForm from 'application/src/version-form/version-form.jsx';
import {bindGettersToState} from 'common/src/util';

const APP_ID = 'kio',
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

describe('The version form view', () => {
    var actionSpy,
        props,
        form;

    describe('in create mode', () => {
        beforeEach(() => {
            reset();

            let kioActions = Object.assign({}, KioActions),
                kioSetup = [{
                    type: KioTypes.FETCH_APPLICATION,
                    payload: TEST_APP
                }, {
                    type: KioTypes.FETCH_APPLICATION_VERSION,
                    payload: TEST_VERSION
                }, {
                    type: KioTypes.FETCH_APPROVALS,
                    payload: [APP_ID, VER_ID, TEST_APPROVALS]
                }],
                kioState = kioSetup.reduce((state, action) => KioStore(state, action), KioStore());

            actionSpy = sinon.stub(kioActions, 'saveApplicationVersion', function () {
                return Promise.resolve();
            });

            props = {
                applicationId: APP_ID,
                versionId: VER_ID,
                edit: false,
                kioStore: bindGettersToState(kioState, KioGetter),
                kioActions,
                userStore: bindGettersToState(UserStore(), UserGetter)
            };
            form = render(VersionForm, props);
        });

        it('should call the correct action', () => {
            let f = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'form');
            TestUtils.Simulate.submit(f);
            expect(actionSpy.calledOnce).to.be.true;
        });
    });

    describe('in edit mode', () => {
        beforeEach(() => {
            reset();

            let kioActions = Object.assign({}, KioActions),
                kioSetup = [{
                    type: KioTypes.FETCH_APPLICATION,
                    payload: TEST_APP
                }, {
                    type: KioTypes.FETCH_APPLICATION_VERSION,
                    payload: TEST_VERSION
                }, {
                    type: KioTypes.FETCH_APPROVALS,
                    payload: [APP_ID, VER_ID, TEST_APPROVALS]
                }],
                kioState = kioSetup.reduce((state, action) => KioStore(state, action), KioStore());

            actionSpy = sinon.stub(kioActions, 'saveApplicationVersion', function () {
                return Promise.resolve();
            });

            props = {
                applicationId: APP_ID,
                versionId: VER_ID,
                edit: true,
                kioStore: bindGettersToState(kioState, KioGetter),
                kioActions,
                userStore: UserStore()
            };
            form = render(VersionForm, props);
        });

        it('should call the correct action', () => {
            let f = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'form');
            TestUtils.Simulate.submit(f);
            expect(actionSpy.calledOnce).to.be.true;
        });

        it('should prepend docker:// prefix to artifact', () => {
            let id = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'id-input');
            id.value = VER_ID;
            TestUtils.Simulate.change(id);
            let artifact = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'artifact-input');
            expect($(React.findDOMNode(artifact)).val()).to.equal(`docker.io/stups/${APP_ID}:${VER_ID}`);
            let f = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'form');
            TestUtils.Simulate.submit(f);
            expect(actionSpy.calledOnce).to.be.true;
            expect(actionSpy.firstCall.args[0]).to.equal(APP_ID);
            expect(actionSpy.firstCall.args[1]).to.equal(VER_ID);
            expect(actionSpy.firstCall.args[2].artifact).to.equal('docker://docker.io/stups/' + `${APP_ID}:${VER_ID}`);
        });

        it('should display a warning when there are approvals', () => {
            TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'warning');
        });
    });

});