import React from 'react';
import App from 'application/src/Application.jsx';

describe('The test test', () => {
    it('should work', () => {
        expect(true).to.equal(true);
    });
});

describe('The App', () => {
    it('should be defined', () => {
        expect(App).to.not.be.undefined;
        var html = React.renderToString( <App /> );
        // only <div because afterwards comes reactid and what not
        expect(html.startsWith('<div')).to.equal(true);
    });
});