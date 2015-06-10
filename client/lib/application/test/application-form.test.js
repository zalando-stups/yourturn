/* globals expect, sinon, Promise */
import jsdom from 'jsdom';
import $ from 'jquery';
import React from 'react';
import {Flummox} from 'flummox';
import KioStore from 'common/src/data/kio/kio-store';
import KioActions from 'common/src/data/kio/kio-actions';
import UserStore from 'common/src/data/user/user-store';
import UserActions from 'common/src/data/user/user-actions';
import AppForm from 'application/src/application-form/application-form.jsx';

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
        reactElement,
        reactComponent,
        $form;

    beforeEach(() => {
        flux = new AppFlux();
        globalFlux = new GlobalFlux();
        actionSpy = sinon.stub(flux.getActions(FLUX), 'saveApplication', function () {
            return Promise.resolve();
        });
    });

    describe('in create mode', () => {

        function render(done) {
            let props = {
                flux: flux,
                globalFlux: globalFlux,
                applicationId: APP_ID,
                edit: false
            };
            reactComponent = new AppForm(props);
            reactElement = React.createElement(AppForm, props);
            jsdom.env(React.renderToString(reactElement), (err, wndw) => {
                $form = $(wndw.document.body).find('.applicationForm');
                done();
            });
        }

        beforeEach(done => {
            globalFlux.getStore('user').receiveUserTeams([{ id: 'stups' }]);
            render(done);
        });

        it('should not have a placeholder', () => {
            expect($form.hasClass('.u-placeholder')).to.be.false;
        });

        it('should have active checkbox preselected', () => {
            let $checkbox = $form.find('[data-block="active-checkbox"]').first();
            expect($checkbox.is(':checked')).to.be.true;
        });
    });

    describe('in edit mode', () => {
        function render(done) {
            let props = {
                flux: flux,
                globalFlux: globalFlux,
                applicationId: APP_ID,
                edit: true
            };
            reactComponent = new AppForm(props);
            reactElement = React.createElement(AppForm, props);
            jsdom.env(React.renderToString(reactElement), (err, wndw) => {
                $form = $(wndw.document.body).find('.applicationForm');
                done();
            });
        }

        beforeEach(done => {
            flux.getStore(FLUX).receiveApplication(TEST_APP);
            render(done);
        });

        it('should not check the active box if app is inactive', () => {
            let $checkbox = $form.find('[data-block="active-checkbox"]').first();
            expect($checkbox.is(':checked')).to.be.false;
        });

        it('should display the available symbol', () => {
            let $available = $form.find('[data-block="available-symbol"]').first();
            expect($available.length).to.equal(1);
        });

        it('should disable the ID input', () => {
            let $input = $form.find('[data-block="id-input"]').first();
            expect($input.is(':disabled')).to.be.true;
        });

        it('should call the correct action', () => {
            reactComponent.save();
            expect(actionSpy.calledOnce).to.be.true;
        });
    });

});
