import React from 'react';
import { render } from 'react-dom';
import { Store } from 'react-chrome-redux';
import { Provider } from 'react-redux'
import { connect } from 'react-redux';
import Highlight from './Highlight.js'
import Flyout from './Flyout.js';
import { clearState } from '../background/localstorage.js';

import './index.css';
import './flyout.css';

import {
  reset,
  updateUrl,
  loadRangeData,
} from '../background/actions'

const store = new Store({
  portName: 'SMARTLINK',
})

export default class InjectApp extends React.Component {

  constructor(props){
    super(props)
  }
  componentDidMount() {
    chrome.runtime.onMessage.addListener(request => {
      switch(request.type) {
        case 'TAB-CHANGED':
          this.props.loadRangeData(window.location.origin + window.location.pathname)
          break
        case 'CLEAR-LOCAL-STORAGE':
          clearState()
        case 'RESET':
          this.props.reset()
          clearState()
          location.reload()
      }
    });
  }
  
  render() {
    return(
      <div className='oc-inject-container'>
        <Highlight />
        <Flyout />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  state: state,
  current: state.pageData
});

const mapDispatchToProps = dispatch => ({
  loadRangeData: (url) => dispatch(loadRangeData(url)),
  updateUrl: (url) => dispatch(updateUrl(url)),
  reset: () => dispatch(reset())
});

const ConnectedInjectApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(InjectApp);

window.addEventListener('load', () => {
  const injectDOM = document.createElement('div');
  injectDOM.className = 'oc-inject-wrapper';
  document.body.appendChild(injectDOM);
  render(
    <Provider store={store}>
      <ConnectedInjectApp />
    </Provider>
    , injectDOM);
});