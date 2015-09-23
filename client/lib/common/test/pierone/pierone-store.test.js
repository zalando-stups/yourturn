/* globals expect */
import PieroneStoreWrapper, {PieroneStore} from 'common/src/data/pierone/pierone-store';
import PieroneActions from 'common/src/data/pierone/pierone-actions';
import Types from 'common/src/data/pierone/pierone-types';
import * as Getter from 'common/src/data/pierone/pierone-getter';
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
        this.createStore('pierone', PieroneStoreWrapper, this);
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
    });
});

describe('The pierone redux store', () => {
    describe('tags', () => {
        it('should receive tags', () => {
            let state = PieroneStore();
            state = PieroneStore(state, {
                type: Types.RECEIVE_TAGS,
                payload: [TEAM, ARTIFACT, TAGS]
            });
            let tags = Getter.getTags(state, TEAM, ARTIFACT);
            expect(tags.length).to.equal(2);
        });
    });

    describe('scm-source', () => {
        it('should receive a scm-source', () => {
            let state = PieroneStore();
            state = PieroneStore(state, {
                type: Types.RECEIVE_SCM_SOURCE,
                payload: [TEAM, ARTIFACT, TAG, SOURCE]
            });
            let result = Getter.getScmSource(state, TEAM, ARTIFACT, TAG);
            expect(result.url).to.equal(SOURCE.url);
            expect(result.author).to.equal(SOURCE.author);
            expect(result.revision).to.equal(SOURCE.revision);
        });

        it('should set a Pending result', () => {
            let state = PieroneStore();
            state = PieroneStore(state, {
                type: Types.BEGIN_FETCH_SCM_SOURCE,
                payload: [TEAM, ARTIFACT, TAG]
            });
            let result = Getter.getScmSource(state, TEAM, ARTIFACT, TAG);
            expect(result instanceof FetchResult).to.be.true;
            expect(result.isPending()).to.be.true;
        });

        it('should return false when there is no scm-source', () => {
            let result = Getter.getScmSource(PieroneStore(), TEAM, ARTIFACT, TAG);
            expect(result).to.be.false;
        });
    });
});