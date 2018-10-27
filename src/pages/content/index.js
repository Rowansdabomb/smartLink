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
  // settings : state.settings,
  // animation: state.animation
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