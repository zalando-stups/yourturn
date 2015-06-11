import React from 'react';
import Remarkable from 'remarkable';

const MD = new Remarkable({
    linkify: true,
    typographer: false,
    quotes: '“”‘’'
});

class Markdown extends React.Component {
    constructor() {
        super();
    }

    render() {
        let html = MD.render(this.props.src);
        return <div
                    className={'u-markdown ' + this.props.className}
                    data-block={this.props.block || null}
                    dangerouslySetInnerHTML={{
                        __html: html
                    }} />;
    }
}

Markdown.propTypes = {
    src: React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
    block: React.PropTypes.string
};

export default Markdown;