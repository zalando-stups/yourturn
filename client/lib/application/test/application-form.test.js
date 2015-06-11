/* globals expect, sinon, Promise */
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
        props,
        form;

    beforeEach(() => {
        flux = new AppFlux();
        globalFlux = new GlobalFlux();
        actionSpy = sinon.stub(flux.getActions(FLUX), 'saveApplication', function () {
            return Promise.resolve();
        });
    });

    describe('in create mode', () => {
        var props;

        beforeEach(done => {
            reset(() => {
                props = {
                    flux: flux,
                    globalFlux: globalFlux,
                    applicationId: APP_ID,
                    edit: false
                };
                globalFlux.getStore('user').receiveUserTeams([{ id: 'stups' }]);
                form = render(AppForm, props);
                done();
            });
        });

        it('should not have a placeholder', () => {
            let placeholders = TestUtils.scryRenderedDOMComponentsWithClass(form, 'u-placeholder');
            expect(placeholders.length).to.equal(0);
        });

        it('should have active checkbox preselected', () => {
            let checkbox = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'active-checkbox');
            expect($(React.findDOMNode(checkbox)).is(':checked')).to.be.true;
        });
    });

    describe('in edit mode', () => {
        beforeEach(done => {
            reset(() => {
                props = {
                    flux: flux,
                    globalFlux: globalFlux,
                    applicationId: APP_ID,
                    edit: true
                };
                globalFlux.getStore('user').receiveUserTeams([{ id: 'stups' }]);
                flux.getStore(FLUX).receiveApplication(TEST_APP);
                form = render(AppForm, props);
                done();
            });
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

        it('should call the correct action', () => {
            form.save();
            expect(actionSpy.calledOnce).to.be.true;
        });
    });

});
