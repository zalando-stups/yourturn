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
                    dangerouslySetInnerHTML={{
                        __html: html
                    }}
                    className='u-markdown' />;
    }
}

Markdown.propTypes = {
    src: React.PropTypes.string.isRequired
};

export default Markdown;