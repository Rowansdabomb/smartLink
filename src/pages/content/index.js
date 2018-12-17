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
  updateUrl,
  loadAttributes,
  resetAttributes
} from '../background/actions'

const store = new Store({
  portName: 'OCTOCOMPARE',
})

export default class InjectApp extends React.Component {

  constructor(props){
    super(props)
  }
  componentDidMount() {
    console.log('INJECT-APP')
    chrome.runtime.onMessage.addListener(request => {
      switch(request.type) {
        case 'TAB-CHANGED':
        console.log('TAB-CHANGED')
          this.props.loadAttributes(window.location.origin + window.location.pathname)
          break
        case 'TAB-CREATED':
          console.log('TAB-CREATED')
        case 'CLEAR-LOCAL-STORAGE':
          console.log('CLEAR-LOCAL-STORAGE')
          clearState()
      }
    });
  }
  componentDidUpdate() {
    console.log(this.props.current)
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
  loadAttributes: (url) => dispatch(loadAttributes(url)),
  updateUrl: (url) => dispatch(updateUrl(url)),
  resetAttributes: () => dispatch(resetAttributes())
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