/* global expect */

import Types from 'common/src/data/clusters/clusters-types';
import Store from 'common/src/data/clusters/clusters-store';
import * as Getter from 'common/src/data/clusters/clusters-getter';
import FetchResult from 'common/src/fetch-result';

var clusters = [
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
  }  ];

describe('The redux cluster store', () => {
    it.skip('should set a pending fetch result for clusters', () => {
        let state = Store(Store(), {
                type: Types.BEGIN_FETCH_CLUSTERS,
                payload: [null, {items:clusters}]
            }),
            resource = Getter.getAllClusters(state);
        expect(resource instanceof FetchResult).to.be.true;
        expect(resource.isPending()).to.be.true;
    });

    it.skip('should set a failed fetch result for a clusters', () => {
      expect(true).to.be.true;
    });
});