import React from "react";
import { connect } from "react-redux";
import ColorSelect from "./ColorSelect";

import "./app.css";

import {
  incrementCurrentSelection,
  decrementCurrentSelection,
  // incrementTotalSelection,
  // setTotalSelection,
  // setCurrentSelection,
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

  render() {
    // console.log(this.props)
    return (
      <div className='container'>
        <h3>This exstension is in Beta</h3>
        <p>Some features may not work as expected...</p>

        <h3>Highlight Color</h3>
        <div className='row'>
          {Object.keys(colors).map((key, index) => <ColorSelect key={index} color={colors[key]}/> )}
        </div>
        {/* <div className='row'>
            <div  id='prev' 
                className='button'
                onClick={() => this.props.decrement()}>Prev</div>
            <div id='anchorTracker'>{this.props.current}/{this.props.total}</div>
            <div id='next' 
                className='button'
                onClick={() => this.props.increment()}>Next</div>

        </div> */}
        {/* <div className='row'>
            <div  id='clear' 
                className='button'
                onClick={() => this.props.clear(0)}>Clear</div>
            <div  id='reset' 
                className='button'
                onClick={() => this.props.reset(0)}>Reset</div>
            <div id='up' 
                className='button'
                onClick={() => this.props.incrementTotal()}>+1</div>
        </div> */}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  // current: state.selection.current,
  // total: state.selection.total,
});

const mapDispatchToProps = dispatch => ({
  // increment: () => dispatch(incrementCurrentSelection()),
  // decrement: () => dispatch(decrementCurrentSelection()),
  // incrementTotal: () => dispatch(incrementTotalSelection()),
  // clear: (value) => dispatch(setTotalSelection(value)),
  // reset: (value) => dispatch(setCurrentSelection(value)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

// export default App;