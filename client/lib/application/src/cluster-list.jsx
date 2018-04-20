import React from 'react';
import Icon from 'react-fa';
import 'common/asset/less/application/scope-list.less';

class ClusterList extends React.Component {
    constructor(props) {
        super();
        this.state = {
            term: '',
            filtered: props.clusters || [],
            selected: props.selected || []
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.term.length) {
            this.setState({
                filtered: nextProps.clusters,
                selected: nextProps.selected
            });
        }
    }

    toggleSelection(cluster) {
        let clusterToAdd = cluster.id,
            idx = this.state.selected.indexOf(clusterToAdd);

        let selected = this.state.selected || [];
        if (idx < 0) {
          selected.push(clusterToAdd);
        } else {
          selected.splice(idx, 1);
        }
        this.setState({
            selected: selected
        });
        this.props.onSelect(selected);
    }

    filter(evt) {
        let term = evt.target.value.toLowerCase();
        this.setState({
            term: term,
            filtered: term.length ?
                        this.props.clusters.filter(c => c.alias.indexOf(term) >= 0 || (this.state.selected && this.state.selected.some(s => s === c.id))) :
                        this.props.clusters
        });
    }

    render() {
        let {term, selected, filtered} = this.state;
        return <div className='scopeList'>
                    <div className='input-group'>
                        <div className='input-addon'>
                            <Icon name='search' />
                        </div>
                        <input
                            onChange={this.filter.bind(this)}
                            placeholder='cluster'
                            defaultValue={term}
                            type='search' />
                    </div>
                    <small>Showing {filtered && filtered.length || 0} of {this.props.clusters.length} clusters.</small>
                    {filtered && filtered.map(
                            cluster =>
                                <div key={cluster.id} data-block='cluster-list-item'>
                                    <label>
                                        <input
                                            checked={ selected && selected.some(c => c === cluster.id) }
                                            onChange={this.toggleSelection.bind(this, cluster)}
                                            type='checkbox'
                                            value={cluster.id} /> {cluster.alias} <small>({cluster.environment})</small>
                                    </label>
                                </div>
                    )}
                </div>;
    }
}

ClusterList.displayName = 'ClusterList';

ClusterList.propTypes = {
    clusters: React.PropTypes.array.isRequired,
    onSelect: React.PropTypes.func.isRequired,
    selected: React.PropTypes.array
};

export default ClusterList;