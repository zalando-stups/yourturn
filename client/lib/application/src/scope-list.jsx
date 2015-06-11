import React from 'react';
import _ from 'lodash';
import 'common/asset/less/application/searchable-list.less';

class OwnerScopeList extends React.Component {
    constructor(props) {
        super();
        this.state = {
            term: '',
            filtered: props.scopes,
            selected: props.selected || []
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.term.length) {
            this.setState({
                filtered: nextProps.scopes,
                selected: nextProps.selected
            });
        }
    }

    toggleSelection(scope, evt) {
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

    filter(evt) {
        let term = evt.target.value;
        this.setState({
            term: term,
            filtered: term.length ?
                        this.props.scopes.filter(s => s.id.indexOf(term) >= 0 || s.resource_type_id.indexOf(term) >= 0) :
                        this.props.scopes
        });
    }

    render() {
        let {term, selected, filtered} = this.state,
            resourceTypes = _.groupBy(filtered, 'resource_type_id');
        return <div className='ownerscopeList'>
                    <div className='input-group'>
                        <div className='input-addon'>
                            <i className='fa fa-search' />
                        </div>
                        <input
                            onChange={this.filter.bind(this)}
                            placeholder='customer'
                            defaultValue={term}
                            type='search' />
                    </div>
                    <small>Showing {filtered.length} of {this.props.scopes.length} scopes.</small>
                    {Object
                        .keys(resourceTypes)
                        .sort()
                        .map(
                            rt =>
                                <div key={rt}>
                                    <strong>{rt}</strong>
                                    {filtered
                                        .filter(s => s.resource_type_id === rt)
                                        .map(
                                            scope =>
                                                <div data-block='scope-list-item'>
                                                    <label> 
                                                        <input
                                                            checked={
                                                                selected.some(
                                                                    s => s.scope_id === scope.id &&
                                                                         s.resource_type_id === scope.resource_type_id)
                                                            }
                                                            onChange={this.toggleSelection.bind(this, scope)}
                                                            type='checkbox'
                                                            value={scope.id} /> {scope.id} <small>({scope.summary})</small>
                                                    </label>
                                                </div>
                                    )}
                                </div>
                    )}
                </div>;
    }
}
OwnerScopeList.propTypes = {
    scopes: React.PropTypes.array.isRequired,
    selected: React.PropTypes.array,
    onSelect: React.PropTypes.func.isRequired
};

export default OwnerScopeList;