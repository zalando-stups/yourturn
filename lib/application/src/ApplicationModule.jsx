import App from './Application.jsx';
import React from 'react';

/**
 * Exports application module as self-contained
 * function.
 */
export default class ApplicationModule {
    mount(node, cb) {
        React.render( <App />, node, cb );
    }

    unmount(node) {
        React.unmountComponentAtNode(node);
    }
}
