/* globals expect */
import {Flummox} from 'flummox';
import KioStore from 'common/src/data/kio/kio-store';
import KioActions from 'common/src/data/kio/kio-actions';
import List from 'application/src/version-list/version-list.jsx';

const FLUX_ID = 'kio',
      APP_ID = 'kio';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(FLUX_ID, KioActions);
        this.createStore(FLUX_ID, KioStore, this);
    }
}

describe('The version list view', () => {
    var flux,
        props,
        list;

    beforeEach(done => {
        reset(() => {
            flux = new MockFlux();
            props = {
                flux: flux,
                applicationId: APP_ID
            };
            list = render(List, props);
            done();
        });
    });

    it('should not display a list without versions', () => {
        expect(() => {
            TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'versions');
        }).to.throw();
    });

    it('should display a list of application versions', () => {
        flux
        .getStore(FLUX_ID)
        .receiveApplicationVersions([{
            id: '0.1',
            application_id: APP_ID
        }, {
            id: 'many-squirrels',
            application_id: APP_ID
        }]);
        list = render(List, props);
        TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'versions');
    });

    it('should display a filtered list of application versions', () => {
        flux
        .getStore(FLUX_ID)
        .receiveApplicationVersions([{
            id: 'few-squirrels',
            application_id: APP_ID
        }, {
            id: 'many-squirrels',
            application_id: APP_ID
        }]);
        list = render(List, props);
        let input = TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'search-input');
        TestUtils.Simulate.change(input, { target: { value: 'few' } });
        let versions = TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'versions');
        expect($(React.findDOMNode(versions)).children().length).to.equal(1);
    });
});