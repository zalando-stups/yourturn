import React from 'react';
import Dimensions from 'react-dimensions';

class AutoWidthContainer extends React.Component {
    render() {
        const { containerWidth } = this.props;

        let childrenWithWidth = React.Children.map(this.props.children,
            (child, index) => {
                return React.cloneElement(child, {
                    key: `${index}`,
                    width: containerWidth
                });
            }
        );

        if (!containerWidth) {
            return (
                <div>
                    {this.props.childIfWidthNotSet}
                </div>
            )
        } else {
            return (
                <div>
                    {childrenWithWidth}
                </div>
            )
        }
    }
}

AutoWidthContainer.displayName = 'AutoWidthContainer';

AutoWidthContainer.propTypes = {
    childIfWidthNotSet: React.PropTypes.any,
    children: React.PropTypes.any,
    containerWidth: React.PropTypes.number
}

export default Dimensions()(AutoWidthContainer);