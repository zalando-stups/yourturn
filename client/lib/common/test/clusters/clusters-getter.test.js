/* global expect */

import Immutable from 'immutable';
import * as Getter from 'common/src/data/clusters/clusters-getter';

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
  }  ];

describe('The clusters getter function', () => {
    it('#getAllClusters should return 10 clusters', () => {
        let clstrs = Getter.getAllClusters({
          kubernetes_clusters:Immutable.fromJS(clusters)
        });
        expect(clstrs.length).to.equal(10);
    });
});