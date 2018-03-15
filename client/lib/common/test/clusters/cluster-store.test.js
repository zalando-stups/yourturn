/* global expect */

import Types from 'common/src/data/clusters/clusters-types';
import Store from 'common/src/data/clusters/clusters-store';
import * as Getter from 'common/src/data/clusters/clusters-getter';
import FetchResult from 'common/src/fetch-result';

var clusters = [
    {
      'alias': 'playground',
      'environment': 'playground',
      'id': 'c-1',
    },
    {
      'alias': 'stups-test',
      'environment': 'test',
      'id': 'c-2',
    },
    {
      'alias': 'stups',
      'environment': 'production',
      'id': 'c-3',
    },
    {
      'alias': 'overarching',
      'environment': 'production',
      'id': 'c-4',
    },
    {
      'alias': 'db',
      'environment': 'production',
      'id': 'c-5',
    },
    {
      'alias': 'fashion-store',
      'environment': 'production',
      'id': 'c-6',
    },
    {
      'alias': 'fashion-store-test',
      'environment': 'test',
      'id': 'c-7',
    },
    {
      'alias': 'distributed-commerce',
      'environment': 'production',
      'id': 'c-8',
    },
    {
      'alias': 'distributed-commerce-test',
      'environment': 'test',
      'id': 'c-9',
    },
    {
      'alias': 'teapot',
      'environment': 'test',
      'id': 'c-10',
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
        let err = new Error();
        err.id = 'cluster';
        let state = Store(Store(), {
          type: Types.BEGIN_FETCH_CLUSTERS,
          payload: [null, {items:clusters}]
      });
            console.log('state', state)
            resource = Getter.getAllClusters(state);
        expect(resource instanceof FetchResult).to.be.true;
        expect(resource.isFailed()).to.be.true;
    });
});