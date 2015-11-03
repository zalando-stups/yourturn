import React from 'react';
import Select from 'react-select';
import Infinite from 'react-infinite-scroll';
import Icon from 'react-fa';
import 'common/asset/less/violation/violation-list.less';
import 'common/asset/css/react-select.css';

const InfiniteList = Infinite(React);

class ViolationList extends React.Component {
    constructor() {
        super();
    }

    _filterViolationType(type) {
        this.props.onConfigurationChange({
            violationType: type
        });
    }

    render() {
        return <div className='violationList'>
                <small>Filter by violation type</small>
                <Select
                    placeholder='EC2_WITH_KEYPAIR'
                    value={this.props.violationType}
                    onChange={this._filterViolationType.bind(this)}
                    options={Object.keys(this.props.violationTypes).sort().map(vt => ({label: vt, value: vt}))} />
                <div
                    data-block='violation-list'
                    className='violation-list'>
                    <InfiniteList
                        loadMore={this.props.loadMore.bind(this)}
                        hasMore={this.props.last}
                        loader={<Icon spin name='circle-o-notch u-spinner' />}>
                        {this.props.children}
                    </InfiniteList>
                </div>
                </div>;
    }
}
ViolationList.displayName = 'ViolationList';
ViolationList.propTypes = {
    onConfigurationChange: React.PropTypes.func,
    violationType: React.PropTypes.string,
    violationTypes: React.PropTypes.array,
    loadMore: React.PropTypes.func,
    last: React.PropTypes.bool,
    children: React.PropTypes.oneOf([React.PropTypes.array, React.PropTypes.object])
};

export default ViolationList;