/* global expect */

import Immutable from 'immutable';
import * as Getter from 'common/src/data/clusters/clusters-getter';

const clusters = [
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

describe('The clusters getter function', () => {
    it('#getAllClusters should return 10 clusters', () => {
        let clstrs = Getter.getAllClusters({
          kubernetes_clusters:Immutable.fromJS(clusters)
        });
        console.log(clstrs); // eslint-disable-line
        expect(clstrs.length).to.equal(10);
    });
});