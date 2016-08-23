/* globals expect */

import reducer from '../../../src/data/alice/alice-reducer'
import * as types from '../../../src/data/alice/alice-action-types';

describe('alice reducer', () => {
    describe('for action type FETCHED_INSTANCE_COUNT', () => {
        it('returns correct state', () => {
            const testAction = {
                instanceCountData: {someProp: 'someValue'},
                error: undefined,
                type: types.FETCHED_INSTANCE_COUNT
            };
            const testPreviousState = {};
            const newState = reducer(testPreviousState, testAction);

            expect(newState.error).to.equal(undefined);
            expect(newState.instanceCountData).to.equal(testAction.instanceCountData);
            expect(newState.isLoading).to.equal(false);
        });
    });
    describe('for action type BEGIN_FETCH_INSTANCE_COUNT', () => {
        it('returns correct state', () => {
            const testAction = {
                instanceCountData: undefined,
                error: undefined,
                type: types.BEGIN_FETCH_INSTANCE_COUNT
            };
            const testPreviousState = {};
            const newState = reducer(testPreviousState, testAction);

            expect(newState.error).to.equal(undefined);
            expect(newState.instanceCountData).to.eql([]);
            expect(newState.isLoading).to.equal(true);
        });
    });
    describe('for action type FAIL_FETCH_INSTANCE_COUNT', () => {
        it('returns correct state', () => {
            const testAction = {
                instanceCountData: undefined,
                error: 'someValue',
                type: types.FAIL_FETCH_INSTANCE_COUNT
            };
            const testPreviousState = {};
            const newState = reducer(testPreviousState, testAction);

            expect(newState.error).to.equal(testAction.error);
            expect(newState.instanceCountData).to.eql([]);
            expect(newState.isLoading).to.equal(false);
        });
    });
});
