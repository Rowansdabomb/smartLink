import React from 'react';
import { render } from 'react-dom';
import {Store} from 'react-chrome-redux';
import {Provider} from 'react-redux'
import {connect} from 'react-redux';
import Highlight from './Highlight.js'
import Drag from './Drag.js';

import './index.css';
import './drag.css';

const store = new Store({
  portName: 'OCTOCOMPARE',
})

export default class InjectApp extends React.Component {
  componentDidMount() {
    this.props.state
    chrome.runtime.onMessage.addListener(request => {
      console.log(request.type)
      switch(request.type) {
        // case 'GET-SELECTION':
        //   let data = getSelection()
        //   console.log(data)
        //   if (data.length === 8) {
        //     this.props.addAttribute(data)
        //     this.props.incrementTotalSelection()
        //     this.newSelection = true
        //   } else {
        //     console.error("attribute length is not 8")
        //   }
        //   break
        // case 'NEW-HIGHLIGHT-COLOR':
        //   this.highlight()
        //   break
        case 'REMOVE-ATTRIBUTE':
          this.setState({
            removeSelection: request.index
          })
          break
        case 'RESET-ATTRIBUTE':
          nodeList = document.getElementsByClassName(SL_CLASS)
          for (let i = nodeList.length - 1; i >= 0; i--) {
            removeHighlight(nodeList[i])
          }
          break
        case 'TAB-CHANGED':
          // save attributes/tabId to localStorage

          // check local storage for attributes at tabId (request.currentId)

            // if in localStorage, this.props.setAttributes()
            // else this.props.resetAttributes(request.currentId)
          console.log(request.currentId)
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
  state: state
});

const ConnectedInjectApp = connect(mapStateToProps)(InjectApp);

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