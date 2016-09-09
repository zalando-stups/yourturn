import React from 'react';

const Conditional = (condition, ComponentIfTrue, ComponentIfFalse) => class C extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            conditionMet: condition(props)
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            conditionMet: condition(nextProps)
        })
    }

    render() {
        return (
            <div>
                {this.state.conditionMet ? <ComponentIfTrue {...this.props} /> : <ComponentIfFalse {...this.props} />}
            </div>
        );
    }
};

export default Conditional;