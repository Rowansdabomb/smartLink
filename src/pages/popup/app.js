import React from "react";
import { connect } from "react-redux";
import ColorSelect from "./ColorSelect";

import "./app.css";

import {
  toggleFlyout,
} from "../background/actions";

const colors = {
  'orange': '#ff670099',
  'yellow': '#ffd30099',
  'green': '#43ae3999',
  'blue': '#aad5ff99',
  'red': '#c92e2e99',
  'none': 'transparent'
}

class App extends React.Component {
  clearLocalStorage = () => {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, {type: 'CLEAR-LOCAL-STORAGE'});
    });
  }

  reset = () => {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, {type: 'RESET'});
    });
  }

  render() {
    return (
      <div className='container'>
        <h3>This exstension is in Beta</h3>
        <p>Some features may not work as expected...</p>

        <h3>Highlight Color</h3>
        <div className='row'>
          {Object.keys(colors).map((key, index) => <ColorSelect key={index} color={colors[key]}/> )}
        </div>
        <div className='row'>
          <div id='toggle-flyout' 
                  className='button'
                  onClick={() => this.props.toggleFlyout()}>
                    {this.props.flyoutHide ? 'Show Flyout': 'Hide Flyout'}
              </div>
            <div id='clear-data' 
                className='button'
                onClick={() => this.clearLocalStorage()}>Reset All</div>

        </div>

      </div>
    )
  }
}

const mapStateToProps = state => ({
  flyoutHide: state.flyout.hide
});

const mapDispatchToProps = dispatch => ({
  toggleFlyout: () => dispatch(toggleFlyout()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

// export default App;