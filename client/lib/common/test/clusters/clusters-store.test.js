/* global expect */

import Immutable from 'immutable';
import Types from 'common/src/data/clusters/clusters-types';
import * as Getter from 'common/src/data/clusters/clusters-getter';
import Store from 'common/src/data/clusters/clusters-store';

const clusters = [
  {
    'alias': 'playground',
    'environment': 'playground',
    'id': 'c-1'
  },
  {
    'alias': 'stups-test',
    'environment': 'test',
    'id': 'c-2'
  },
  {
    'alias': 'stups',
    'environment': 'production',
    'id': 'c-3'
  },
  {
    'alias': 'overarching',
    'environment': 'production',
    'id': 'c-4'
  },
  {
    'alias': 'db',
    'environment': 'production',
    'id': 'c-5'
  },
  {
    'alias': 'fashion-store',
    'environment': 'production',
    'id': 'c-6'
  },
  {
    'alias': 'fashion-store-test',
    'environment': 'test',
    'id': 'c-7'
  },
  {
    'alias': 'distributed-commerce',
    'environment': 'production',
    'id': 'c-8'
  },
  {
    'alias': 'distributed-commerce-test',
    'environment': 'test',
    'id': 'c-9'
  },
  {
    'alias': 'teapot',
    'environment': 'test',
    'id': 'c-10'
  }  ];

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