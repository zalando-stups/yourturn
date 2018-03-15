/* global expect */

import Immutable from 'immutable';
import Types from 'common/src/data/clusters/clusters-types';
import * as Getter from 'common/src/data/clusters/clusters-getter';
import Store from 'common/src/data/clusters/clusters-store';

const clusters = [
  {
    'alias': 'st',
    'environment': 'pg',
    'id': 'c-1'
  },
  {
    'alias': 'st-t',
    'environment': 't',
    'id': 'c-2'
  },
  {
    'alias': 'st',
    'environment': 'production',
    'id': 'c-3'
  },
  {
    'alias': 'ovra',
    'environment': 'production',
    'id': 'c-4'
  },
  {
    'alias': 'database',
    'environment': 'production',
    'id': 'c-5'
  },
  {
    'alias': 'f-store',
    'environment': 'production',
    'id': 'c-6'
  },
  {
    'alias': 'f-store-test',
    'environment': 't',
    'id': 'c-7'
  },
  {
    'alias': 'dist',
    'environment': 'production',
    'id': 'c-8'
  },
  {
    'alias': 'dist-test',
    'environment': 't',
    'id': 'c-9'
  },
  {
    'alias': 'tp',
    'environment': 't',
    'id': 'c-10'
  }  
];

describe('The redux clusters store', () => {
    it('should receive clusters', () => {
        let state = Store(Store(), {
                type: Types.FETCH_CLUSTERS,
                payload: [null, {items:clusters}]
            }),
            clstrs = Getter.getAllClusters(state);
        expect(clstrs.length).to.equal(10);
    });
});
