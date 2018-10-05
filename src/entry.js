import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { getRegistry } from '@red-hat-insights/insights-frontend-components';
import App from './App';

// makes eslint exception for webpack variable RELEASE
/*global RELEASE:true*/
/*eslint no-undef: "error"*/

/**
 * Hooks up redux to app.
 *  https://redux.js.org/advanced/usage-with-react-router
 */
ReactDOM.render(
    <Provider store={getRegistry().getStore()}>
        <Router basename={'/' + RELEASE + '/platform/dashboard'}>
            <App />
        </Router>
    </Provider>,
    document.getElementById('root')
);
