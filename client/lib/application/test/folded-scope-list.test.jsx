/* globals expect, sinon */
import Immutable from 'immutable';
import FoldedScopeList from 'application/src/folded-scope-list.jsx';
import React from 'react';
import { shallow } from 'enzyme';
import { resourceTypes, resourceScopes } from '../../../../server/mocks/5003-essentials.js';

let scopes = Object.keys( resourceTypes ).map( k => resourceTypes[k] ).reduce((map, res) => map.set(res.id, Immutable.Map()), Immutable.Map());
const allResources = Object.keys( resourceTypes ).map( k => resourceTypes[k] ).reduce((map, res) => map.set(res.id, Immutable.Map(res)), Immutable.Map());
let props = {
  saved: [],
  selected: [],
  scopes: Immutable.Map(),
  onFold: () => {},
  onSelect: () => {},
  allResources: Immutable.Map()
};

describe('Folded scope list tests', () => {
    before(() => {
      Object.keys(resourceScopes).forEach(key => {
        const value = resourceScopes[key];
        scopes = allResources.set(key, Object.values(value).reduce((map, res) => map.set(res.id, Immutable.fromJS(res)), Immutable.Map()));
      });
      props = {
        saved: [
          {resource_type_id: 'customer', scope_id: 'read_all', saved: true},
          {scope_id: 'read', resource_type_id: 'sales_order', saved: true}
        ],
        selected: [
          {resource_type_id: 'customer', scope_id: 'read_all'},
          {scope_id: 'read', resource_type_id: 'sales_order'}
        ],
        scopes,
        onFold: () => {},
        onSelect: () => {},
        allResources
      };
  });
    it('component should be created successfully', () => {
        const props = {
            saved: [],
            selected: [],
            scopes: Immutable.Map(),
            onFold: () => {},
            onSelect: () => {},
            allResources: Immutable.Map()
        };
        const list = shallow(<FoldedScopeList {...props} />);
        expect(list).to.have.lengthOf(1);
    });
    it('should have 7 resoutce types', () => {
        const list = shallow(<FoldedScopeList {...props} />);
        expect(list.find('a.scope')).to.have.lengthOf(7);
    });
    it('first 2 resource types should be expanded, all the rest should be collapsed', () => {
        const list = shallow(<FoldedScopeList {...props} />);
        const values = list.find('a.scope span');
        expect(values).to.have.lengthOf(7);
        values.forEach((element, index) => {
          if(index < 2){
            expect(element.text()).to.equal('−');
          } else {
            expect(element.text()).to.equal('+');
          }
        });
    });
    it.skip('Sales Order should not have checkboxes for scopes', () => {
        const list = shallow(<FoldedScopeList {...props} />);
        let elements = list.find('a.scope');
        elements.at(2).simulate('click');
        elements = list.find('.resource-type-item input');
        expect(elements).to.have.lengthOf(12);

    });
    it('should call onFold 2 times', () => {
        const onFoldStub = sinon.stub(props, 'onFold').returns(Promise.resolve());
        const list = shallow(<FoldedScopeList {...props} />);
        expect(list).to.have.lengthOf(1);
        expect(onFoldStub.calledTwice).to.be.true;
    });
});
