import React from 'react'
import Multiselect from 'react-widgets/lib/Multiselect'
import 'react-widgets/lib/less/react-widgets.less';

const OUTER_STYLE = {display: 'flex', justifyContent: 'flex-start'};
const SELECTOR_DIV_STYLE = {minWidth: '200px', marginRight: '5px'};

const ComboBox = (props) => {
    const {title, resetButtonTitle, onReset, ...otherProps} = props;
    return (
        <h4 style = {OUTER_STYLE}>
            <span style = {{marginRight: '5px'}}>{title}:</span>
            <div style = {SELECTOR_DIV_STYLE}>
                <Multiselect
                    {...otherProps}
                />
            </div>
            <div className='btn btn-primary'
                 onClick = {onReset}>
                {resetButtonTitle}
            </div>
        </h4>
    )
};

ComboBox.propTypes = {
    data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    onChange: React.PropTypes.func.isRequired,
    onReset: React.PropTypes.func.isRequired,
    resetButtonTitle: React.PropTypes.string,
    textField: React.PropTypes.string.isRequired,
    title: React.PropTypes.string,
    value: React.PropTypes.arrayOf(React.PropTypes.object),
    valueField: React.PropTypes.string.isRequired
};

ComboBox.defaultProps = {
    resetButtonTitle: 'Reset',
    title: 'Select',
    valueField: 'id',
    textField: 'id'
}

export default ComboBox;
