import React from 'react';
import ScopeList from './scope-list.jsx';
import Icon from 'react-fa';
import 'common/asset/less/application/scope-list.less';

class OwnerScopeList extends ScopeList {
    constructor(props) {
        super(props);
        const {allResources, scopes: filtered, selected} = props;
        this.state = {
            allResources: allResources,
            foldings:{},
            term: '',
            filtered,
            selected: selected || []
        };

      }

      componentWillMount(){
        
        this.state.selected.map(selected => {
          if (!this.state.foldings || !this.state.foldings[selected.resource_type_id]) this.toggleFolding(selected.resource_type_id);
        });
      }

    componentWillReceiveProps(nextProps) {
      const term = this.state.term;
      this.setState({
        filtered: term.length ?
        nextProps.scopes.filter(
          (s, key) => key.toLowerCase().indexOf(term) >= 0 
          || s.some(item => item.get('id').toLowerCase().indexOf(term) >= 0 
          || item.get('resource_type_id').toLowerCase().indexOf(term) >= 0 
          || this.state.selected.some(selected => selected.scope_id && selected.resource_type_id === item.get('resource_type_id') && selected.scope_id === item.get('id')))) :
          nextProps.scopes,
          selected: nextProps.selected,
          allResources: nextProps.allResources
      });
    }

    toggleFolding(resourceType) {
      let state = Object.assign({}, this.state);
      if (! state.foldings[resourceType]){
        state.foldings[resourceType] = true;
        this.props.onFold(resourceType);
      } else {
        delete state.foldings[resourceType];
      }
      this.setState(state);
  }

    filter(evt) {
        const term = evt.target.value;
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

    renderScopesByFilter ({isSaved}){
      let {selected, filtered, allResources, foldings} = this.state;
      const { saved } = this.props;
      return allResources
        .valueSeq()
        .map(
            rt => filtered.get(rt.get('id')) && isSaved === saved.some( s => s.resource_type_id === rt.get('id') && s.saved) && (<div className='resource-type-item' key={rt.get('id')}>
                    
                      {!foldings[rt.get('id')] && (<a className='scope' onClick={this.toggleFolding.bind(this, rt.get('id'))}><span>+</span></a>)}
                      { foldings[rt.get('id')] && (<a className='scope' onClick={this.toggleFolding.bind(this, rt.get('id'))}><span>−</span></a>)}
                    
                    <strong>{rt.get('name')}</strong>
                    {foldings[rt.get('id')] && (!filtered.get(rt.get('id')) || !filtered.get(rt.get('id')).size) && (<span>Loading...</span>)}
                    {foldings[rt.get('id')] && filtered.get(rt.get('id')) && filtered.get(rt.get('id'))
                        .map(
                            scope => scope.get &&
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
      )
    }

    render() {
      let {term} = this.state;
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
              { this.renderScopesByFilter({isSaved:true})}
              { this.renderScopesByFilter({isSaved:false})}
          </div>;
    }
}

OwnerScopeList.displayName = 'OwnerScopeList';

OwnerScopeList.propTypes = {
    allResources: React.PropTypes.object.isRequired,
    onFold: React.PropTypes.func.isRequired,
    onSelect: React.PropTypes.func.isRequired,
    saved: React.PropTypes.array,
    scopes: React.PropTypes.object.isRequired,
    selected: React.PropTypes.array
};

export default OwnerScopeList;