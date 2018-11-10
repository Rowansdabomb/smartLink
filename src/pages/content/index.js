import React from 'react';
import { render } from 'react-dom';
import {Store} from 'react-chrome-redux';
import {Provider} from 'react-redux'
import {connect} from 'react-redux';
import Highlight from './Highlight.js'
import Drag from './Drag.js';

import './index.css';
import './drag.css';

import {
  updateTabId,
  loadAttributes,
} from '../background/actions'

const store = new Store({
  portName: 'OCTOCOMPARE',
})

export default class InjectApp extends React.Component {

  constructor(props){
    super(props)
    // this.state = {
    //   removeSelection: null
    // }
  }
  componentDidMount() {
    console.log('INJECT-APP')
    // this.props.state
    // this.props.updateTabId()
    chrome.runtime.onMessage.addListener(request => {
      switch(request.type) {
        case 'TAB-CHANGED':
        console.log('TAB-CHANGED')
          // this.props.loadAttributes(request.currentTabId)
          this.props.loadAttributes(window.location.origin + window.location.pathname)
          
          // save attributes/url to localStorage

          // check local storage for attributes at url (request.currentTabId)

            // if in localStorage, this.props.setAttributes()
            // else this.props.resetAttributes(request.currentTabId)
          console.log(request.currentTabId)
          break
        case 'TAB-CREATED':
          console.log('TAB-CREATED')
      }
    });
  }
  render() {
    return(
      <div className='oc-inject-container'>
        <Highlight />
        <Drag />
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
  updateTabId: (url) => dispatch(updateTabId(url))
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