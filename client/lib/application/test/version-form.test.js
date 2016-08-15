/* globals expect, TestUtils, reset, render, sinon, Promise, $, React */
import * as KioActions from 'common/src/data/kio/kio-actions';
import VersionForm from 'application/src/version-form/version-form.jsx';

/*eslint-disable react/no-deprecated */
// TODO rework usage of React.findDOMNode
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
    };

describe('The version form view', () => {
    var actionSpy,
        props,
        form;

    describe('in create mode', () => {
        beforeEach(() => {
            reset();

            let kioActions = Object.assign({}, KioActions);
            actionSpy = sinon.stub(kioActions, 'saveApplicationVersion', function () {
                return Promise.resolve();
            });

            props = {
                applicationId: APP_ID,
                versionId: VER_ID,
                versionIds: ['foo'],
                edit: false,
                kioActions,
                application: TEST_APP,
                approvalCount: 0
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

            let kioActions = Object.assign({}, KioActions);
            actionSpy = sinon.stub(kioActions, 'saveApplicationVersion', function () {
                return Promise.resolve();
            });

            props = {
                applicationId: APP_ID,
                versionId: VER_ID,
                versionIds: [],
                edit: true,
                kioActions,
                version: TEST_VERSION,
                application: TEST_APP,
                approvalCount: 2
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
/*eslint-enable react/no-deprecated */
