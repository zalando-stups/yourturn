import React from 'react';
import Icon from 'react-fa';
import 'common/asset/less/common/collapsible.less';

class Collapsible extends React.Component {
    constructor(props) {
        super();
        this.state = {
            collapsed: props.initialCollapsed || false
        };
    }

    _collapse() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render() {
        return <div className='collapsible' {...this.props}>
                    <header
                        onClick={this._collapse.bind(this)}>
                        {this.state.collapsed ?
                            <Icon fixedWidth name='caret-right' /> :
                            <Icon fixedWidth name='caret-down' />} {this.props.header}
                    </header>
                    <div style={{ display: this.state.collapsed ? 'none' : null}} {...this.props}>
                        {this.props.children}
                    </div>
                </div>;
    }
}
Collapsible.displayName = 'Collapsible';
Collapsible.propTypes = {
    header: React.PropTypes.object,
    children: React.PropTypes.oneOf([React.PropTypes.array, React.PropTypes.object])
};
export default Collapsible;
