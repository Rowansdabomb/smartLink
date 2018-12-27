import React from "react";
import { connect } from "react-redux";

import "./app.css";

import {
  setColor
} from "../background/actions";

class ColorSelect extends React.Component {
  selectColor = () => {
    this.props.setColor(this.props.color)
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, {type: 'NEW-HIGHLIGHT-COLOR'});
    });
  }
  render() {
    const backgroundColor = {backgroundColor: this.props.color}
    return (
      <label className='column'>
        <div className='colorChoice' style={backgroundColor}></div>
        <input className='colorChoice'
              name='colorPick' 
              type='radio'
              checked={this.props.color === this.props.highlightColor ? true: false}
              onClick={() => this.selectColor()} 
              value={this.props.color}/>
      </label>
    )
  }
}

const mapStateToProps = state => ({
  highlightColor: state.colors.highlightColor
});

const mapDispatchToProps = dispatch => ({
  setColor: (value) => dispatch(setColor(value))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ColorSelect);
