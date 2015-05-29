/* globals expect */
import PieroneStore from 'common/src/data/pierone/pierone-store';
import PieroneActions from 'common/src/data/pierone/pierone-actions';
import {Flummox} from 'flummox';
import FetchResult from 'common/src/fetch-result';

const TEAM = 'stups',
    ARTIFACT = 'kio',
    TAG = '1.0',
    SOURCE = {
        url: 'url',
        revision: 'abcd',
        author: 'npiccolotto',
        status: ''
    };

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions('pierone', PieroneActions);
        this.createStore('pierone', PieroneStore, this);
    }
}

describe('The pierone store', () => {
    var store,
        flux = new MockFlux();

    beforeEach(() => {
        store = flux.getStore('pierone');
    });

    afterEach(() => {
        store._empty();
    });

    it('should receive a scm-source', () => {
        store.receiveScmSource([TEAM, ARTIFACT, TAG, SOURCE]);
        let result = store.getScmSource(TEAM, ARTIFACT, TAG);
        expect(result.url).to.equal(SOURCE.url);
        expect(result.author).to.equal(SOURCE.author);
        expect(result.revision).to.equal(SOURCE.revision);
    });

    it('should set a Pending result', () => {
        store.beginFetchScmSource(TEAM, ARTIFACT, TAG);
        let result = store.getScmSource(TEAM, ARTIFACT, TAG);
        expect(result instanceof FetchResult).to.be.true;
        expect(result.isPending()).to.be.true;
    });

    it('should set a Failed result on non-404', () => {
        let error = new Error();
        error.status = 503;
        error.team = TEAM;
        error.artifact = ARTIFACT;
        error.tag = TAG;
        store.failFetchScmSource(error);
        let result = store.getScmSource(TEAM, ARTIFACT, TAG);
        expect(result instanceof FetchResult).to.be.true;
        expect(result.isFailed()).to.be.true;
    });

    it('should return false on 404', () => {
        let error = new Error();
        error.status = 404;
        error.team = TEAM;
        error.artifact = ARTIFACT;
        error.tag = TAG;
        store.failFetchScmSource(error);
        let result = store.getScmSource(TEAM, ARTIFACT, TAG);
        expect(result).to.be.false;
    });
});