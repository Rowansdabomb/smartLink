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
  updateUrl,
  saveAttributes,
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
    console.log('INJECT-APP', this.props.current)
    this.props.resetAttributes()
    this.props.updateUrl(window.location.origin + window.location.pathname)
    chrome.runtime.onMessage.addListener(request => {
      switch(request.type) {
        case 'TAB-CHANGED':
          console.log('TAB-CHANGED')

          // this.props.saveAttributes()
          this.props.loadAttributes(window.location.origin + window.location.pathname)
          break
        case 'TAB-CREATED':
          console.log('TAB-CREATED')
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
  updateUrl: (url) => dispatch(updateUrl(url)),
  saveAttributes: () => dispatch(saveAttributes()),
  loadAttributes: (url) => dispatch(loadAttributes(url)),
  resetAttributes: () => dispatch(resetAttributes()),
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