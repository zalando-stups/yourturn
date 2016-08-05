import React from 'react';

var PropsExposer = (Wrapped, callback) => class PropsExposer extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        callback(this.props);
    }

    componentDidUpdate() {
        callback(this.props);
    }

    render() {
        return (
            <Wrapped
                {...this.props}
            />
        )
    }
};

export default PropsExposer;
