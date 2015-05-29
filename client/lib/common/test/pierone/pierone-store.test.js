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
    },
    TAGS = [{
            created_by: 'npiccolotto',
            created: '2015-05-21T09:06:35.319+0000',
            name: '0.28'
        }, {
            created_by: 'npiccolotto',
            created: '2015-05-28T11:52:13.652+0000',
            name: '0.29'
        }];

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

    describe('tags', () => {
        it('should receive tags', () => {
            store.receiveTags([TEAM, ARTIFACT, TAGS]);
            let result = store.getTags(TEAM, ARTIFACT);
            expect(result.length).to.equal(2);
        });
    });

    describe('scm-source', () => {
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

        it('should return false when there is no scm-source', () => {
            let result = store.getScmSource(TEAM, ARTIFACT, TAG);
            expect(result).to.be.false;
        });

        it('should set a Failed result on eror', () => {
            let error = new Error();
            error.status = 404;
            error.team = TEAM;
            error.artifact = ARTIFACT;
            error.tag = TAG;
            store.failFetchScmSource(error);
            let result = store.getScmSource(TEAM, ARTIFACT, TAG);
            expect(result.isFailed()).to.be.true;
        });
    });
});