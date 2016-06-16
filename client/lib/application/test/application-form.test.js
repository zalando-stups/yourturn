/* globals expect, $, TestUtils, reset, render, React, sinon, Promise */
import * as KioActions from 'common/src/data/kio/kio-actions';
import AppForm from 'application/src/application-form/application-form.jsx';

const APP_ID = 'kio',
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

describe('The application form view', () => {
    var actionSpy,
        props,
        form;

    describe('in create mode', () => {
        beforeEach(() => {
            reset();
            let kioActions = Object.assign({}, KioActions);
            actionSpy = sinon.stub(kioActions, 'saveApplication', function () {
                return Promise.resolve();
            });

            props = {
                applicationId: APP_ID,
                edit: false,
                application: TEST_APP,
                applicationIds: ['foo'],
                userTeams: ['stups'],
                kioActions
            };

            form = render(AppForm, props);
        });

        it('should not have a placeholder', () => {
            let placeholders = TestUtils.scryRenderedDOMComponentsWithClass(form, 'u-placeholder');
            expect(placeholders.length).to.equal(0);
        });

        it('should have active checkbox preselected', () => {
            let checkbox = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'active-checkbox');
            expect($(React.findDOMNode(checkbox)).is(':checked')).to.be.true;
        });

        it('should disable save button without teams', () => {
            form = render(AppForm, {...props, userTeams: []});
            let btn = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'save-button');
            expect($(React.findDOMNode(btn)).is('[disabled="true"]')).to.be.false;
        });
    });

    describe('in edit mode', () => {
        beforeEach(() => {
            reset();
            let kioActions = Object.assign({}, KioActions);

            actionSpy = sinon.stub(kioActions, 'saveApplication', function () {
                return Promise.resolve();
            });

            props = {
                applicationId: APP_ID,
                edit: true,
                application: TEST_APP,
                applicationIds: ['foo'],
                userTeams: ['stups'],
                kioActions
            };

            form = render(AppForm, props);
        });

        it('should not check the active box if app is inactive', () => {
            let checkbox = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'active-checkbox');
            expect($(React.findDOMNode(checkbox)).is(':checked')).to.be.false;
        });

        it('should display the available symbol', () => {
            let available = TestUtils.scryRenderedDOMComponentsWithAttributeValue(form, 'data-block', 'available-symbol');
            expect(available.length).to.equal(1);
        });

        it('should disable the ID input', () => {
            let input = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'id-input');
            expect($(React.findDOMNode(input)).is(':disabled')).to.be.true;
        });

        it('should allow to edit the team', () => {
            TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'team-input');
        });

        it('should call the correct action', () => {
            let f = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'form');
            TestUtils.Simulate.submit(f);
            expect(actionSpy.calledOnce).to.be.true;
        });
    });

});
