import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import Icon from 'react-fa';
import 'common/asset/less/application/scope-list.less';

const Folder = styled.a`
  span{
    display:inline-flex;
    width:15px;
    height:15px;
    font-weight:900;
    padding:2px;
  }
  text-decoration: none;
  background-image:none;
`;
class OwnerScopeList extends React.Component {
    constructor(props) {
        super();
        this.state = {
            allResources: props.allResources,
            foldings:{},
            term: '',
            filtered: props.scopes,
            selected: props.selected || []
        };

      }

      componentWillMount(){
        this.state.selected.map(selected => {
          this.toggleFolding(selected.resource_type_id);
        });
      }

    componentWillReceiveProps(nextProps) {
        if (!this.state.term.length) {
            this.setState({
                filtered: nextProps.scopes,
                selected: nextProps.selected,
                allResources: nextProps.allResources,
            });
        }
    }

    toggleSelection(scope) {
        let scopeToAdd = {
                scope_id: scope.id,
                resource_type_id: scope.resource_type_id
            },
            idx = _.findLastIndex(this.state.selected, scopeToAdd);

        if (idx < 0) {
            this.state.selected.push(scopeToAdd);
        } else {
            this.state.selected.splice(idx, 1);
        }
        this.setState({
            selected: this.state.selected
        });
        this.props.onSelect(this.state.selected);
    }

    toggleFolding(resourceType) {
      let state = this.state;
      if (! state.foldings[resourceType]){
        state.foldings[resourceType] = true;
        this.props.onFold(resourceType);
      } else {
        delete state.foldings[resourceType];
      }
      this.setState(state);
  }

    filter(evt) {
        let term = evt.target.value;
        this.setState({
            term: term,
            filtered: term.length ?
                this.props.scopes.filter(
                  (s, key) => key.toLowerCase().indexOf(term) >= 0 
                  || s.some(item => item.get('id').toLowerCase().indexOf(term) >= 0 
                  || item.get('resource_type_id').toLowerCase().indexOf(term) >= 0 
                  || this.state.selected.some(selected => selected.scope_id && selected.resource_type_id === item.get('resource_type_id') && selected.scope_id === item.get('id')))) :
                this.props.scopes
        });
    }

    render() {
      let {term, selected, filtered, allResources, foldings} = this.state;
            return <div className='scopeList'>
                    <div className='input-group'>
                        <div className='input-addon'>
                            <Icon name='search' />
                        </div>
                        <input
                            onChange={this.filter.bind(this)}
                            placeholder='customer'
                            defaultValue={term}
                            type='search' />
                    </div>
                    {allResources
                        .valueSeq()
                        .map(
                            rt =>
                            filtered.get(rt.get('id')) && (<div key={rt.get('id')}>
                                    
                                      {!foldings[rt.get('id')] && (<Folder href="javascript:void(0)" onClick={this.toggleFolding.bind(this, rt.get('id'))}><span>+</span></Folder>)}
                                      { foldings[rt.get('id')] && (<Folder href="javascript:void(0)" onClick={this.toggleFolding.bind(this, rt.get('id'))}><span>−</span></Folder>)}
                                    
                                    <strong>{rt.get('name')}</strong>
                                    {foldings[rt.get('id')] && (!filtered.get(rt.get('id')) || !filtered.get(rt.get('id')).size) && (<span>Loading...</span>)}
                                    {foldings[rt.get('id')] && filtered.get(rt.get('id')) && filtered.get(rt.get('id'))
                                        .map(
                                            scope =>
                                                <div key={scope.get('id')} data-block='scope-list-item'>
                                                    <label>
                                                        {!scope.get('is_resource_owner_scope') && <input
                                                            checked={
                                                                selected.some(
                                                                    s => s.scope_id === scope.get('id') &&
                                                                         s.resource_type_id === scope.get('resource_type_id'))
                                                            }
                                                            onChange={this.toggleSelection.bind(this, {id: scope.get('id'), resource_type_id: scope.get('resource_type_id')})}
                                                            type='checkbox'
                                                          value={scope.get('id')} />} 
                                                        {scope.get('id')} 
                                                        <small>({scope.get('summary')})</small>{scope.get('is_resource_owner_scope') && <span> &nbsp;you already own this scope</span>}
                                                    </label>
                                                </div>
                                        )}
                                </div>)
                    )}
                </div>;
    }
}

OwnerScopeList.displayName = 'OwnerScopeList';

OwnerScopeList.propTypes = {
    allResources: React.PropTypes.array.isRequired,
    onFold: React.PropTypes.func.isRequired,
    onSelect: React.PropTypes.func.isRequired,
    scopes: React.PropTypes.array.isRequired,
    selected: React.PropTypes.array
};

export default OwnerScopeList;