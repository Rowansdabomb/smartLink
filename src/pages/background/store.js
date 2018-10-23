import { applyMiddleware, createStore } from 'redux'
import { wrapStore, alias } from 'react-chrome-redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import reducer from './reducers'
import throttle from 'lodash/throttle';
import { saveState, loadState } from './localStorage';
const store = createStore(
  reducer,
  loadState()
);

store.subscribe(throttle(() => {
  saveState({
    bookmark: store.getState().bookmark,
    settings: store.getState().settings,
    animation: store.getState().animation,

    // selection: store.getState().selection,
    colors: store.getState().colors,
    dragElement: store.getState().dragElement,
    // attributes: store.getState().attributes,
  })
}), 1000);

wrapStore(store, {
  portName: 'OCTOCOMPARE',
})

export default store;