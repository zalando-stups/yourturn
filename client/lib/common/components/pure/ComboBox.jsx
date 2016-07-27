import React from 'react'
import Multiselect from 'react-widgets/lib/Multiselect'
import 'react-widgets/lib/less/react-widgets.less';

const OUTER_STYLE = {display: 'flex'};
const SELECTOR_DIV_STYLE = {minWidth: '200px'};

const ComboBox = (props) => {
    const {title, resetButtonTitle, onReset, ...otherProps} = props;
    return (
        <div>
            <h3>{title}</h3>
            <div style = {OUTER_STYLE}>
                <div style = {SELECTOR_DIV_STYLE}>
                    <Multiselect
                        {...otherProps}
                    />
                </div>
                <div className='btn btn-danger'
                     onClick = {onReset}>
                    {resetButtonTitle}
                </div>
            </div>
        </div>
    )
};

ComboBox.propTypes = {
    valueField: React.PropTypes.string.isRequired,
    textField: React.PropTypes.string.isRequired,
    value: React.PropTypes.arrayOf(React.PropTypes.object),
    data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    onChange: React.PropTypes.func.isRequired,
    onReset: React.PropTypes.func.isRequired,
    resetButtonTitle: React.PropTypes.string,
    title: React.PropTypes.string
};

ComboBox.defaultProps = {
    resetButtonTitle: 'Reset',
    title: 'Select'
}

export default ComboBox;
