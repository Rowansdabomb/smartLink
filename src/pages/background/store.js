import { applyMiddleware, createStore } from 'redux'
import { wrapStore, alias } from 'react-chrome-redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import reducer from './reducers'
import throttle from 'lodash/throttle';
import { saveState, loadState } from './localstorage';
const store = createStore(
  reducer,
  loadState(),
);

store.subscribe(throttle(() => {
  saveState({
    pageData: store.getState().pageData,
    colors: store.getState().colors,
    flyout: store.getState().flyout,
    // selection: store.getState().selection,
  })
}), 1000);

wrapStore(store, {
  portName: 'OCTOCOMPARE',
}) 

export default store;