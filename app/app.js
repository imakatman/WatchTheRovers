/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import 'babel-polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { persistStore } from 'redux-persist';
import configureStore from './store';


import App from 'containers/App';

// Load the favicon, the manifest.json file and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
import '!file-loader?name=[name].[ext]!./favicon.ico';
import '!file-loader?name=[name].[ext]!./manifest.json';
import 'file-loader?name=[name].[ext]!./.htaccess';
/* eslint-enable import/no-unresolved, import/extensions */

// Import CSS reset, Global Styles, and fonts
import './global-styles';

// Import root routes
import createRoutes from './routes';
// Create redux store with history
// this uses the singleton browserHistory provided by react-router
// Optionally, this could be changed to leverage a created history
// e.g. `const browserHistory = useRouterHistory(createBrowserHistory)();`
// const initialState = {};
const store = configureStore();

// begin periodically persisting the store
// persistStore(store, {blacklist: "routing: routerReducer"});
// persistStore(store).purge();

const history = syncHistoryWithStore(browserHistory, store);

// Sync history and store, as the react-router-redux reducer
// is under the non-default key ("routing"), selectLocationState
// must be provided for resolving how to retrieve the "route" in the state
// const history = syncHistoryWithStore(browserHistory, store, {
//     selectLocationState: makeSelectLocationState(),
// });

// Set up the router, wrapping all Routes in the App component
const rootRoute = {
    component: App,
    childRoutes: createRoutes(store),
};

// const render = () => {
ReactDOM.render(
    <Provider store={store}>
       <Router
           history={history}
           routes={rootRoute}
       />
    </Provider>,
    document.getElementById('app')
);

// Hot reloadable translation json files
// if (module.hot) {
//   // modules.hot.accept does not accept dynamic dependencies,
//   // have to be constants at compile-time
//   module.hot.accept('./i18n', () => {
//     render(translationMessages);
//   });
// }

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
    require('offline-plugin/runtime').install(); // eslint-disable-line global-require
}
