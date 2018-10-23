import React from 'react';
import {render} from 'react-dom';
import {Store} from 'react-chrome-redux';
import {connect} from 'react-redux';

import './drag.css';

import {
  setOrigin
} from "../background/actions";

const store = new Store({
  portName: 'OCTOCOMPARE',
})

class Drag extends React.Component {
  constructor(props) {
    super(props);
    this.dragElement = React.createRef();
    this.state = {
      pos: {
        x: this.props.origin[1],
        y: this.props.origin[0]
      },
      dragging: false,
      rel: null,
    }
  }

  componentDidUpdate(props, state) {
    if (this.state.dragging && !state.dragging) {
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('mouseup', this.onMouseUp)
    } else if (!this.state.dragging && state.dragging) {
      document.removeEventListener('mousemove', this.onMouseMove)
      document.removeEventListener('mouseup', this.onMouseUp)
    }
  }

  onMouseDown = (e) => {
    if (e.button !== 0) return
    let pos = this.dragElement.current
    this.setState({
      dragging: true,
      rel: {
        x: e.pageX - pos.offsetLeft,
        y: e.pageY - pos.offsetTop
      }
    })
    e.preventDefault()
  }

  onMouseMove = (e) => {
    if (!this.state.dragging) return
    this.setState({
      pos: {
        x: e.pageX - this.state.rel.x,
        y: e.pageY - this.state.rel.y
      }
    })
    e.preventDefault()
  }

  onMouseUp = (e) => {
    this.setState({
      dragging: false
    })
    e.preventDefault()
    this.props.setOrigin(this.state.pos.y, this.state.pos.x)
  }

  render() {
    const originStyle = {top: this.state.pos.y, left: this.state.pos.x}
    return(
      <div id='oc-d-wrapper'>
        {this.props.open && 
          <div id='oc-d-container' 
            ref={this.dragElement}
            style={originStyle}>
            <div id='oc-d-header' onMouseDown={(e) => this.onMouseDown(e)}>
              <div className="oc-d-title">Highlight Selections</div>
              <i className="oc-d-close fa fa-times"></i>
            </div>
            <div className="oc-d-ol">
              a list goes here
            </div>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  origin : state.dragElement.origin,
  open : state.dragElement.isDragOpen
});

const mapDispatchToProps = dispatch => ({
  setOrigin: (top, left) => dispatch(setOrigin(top, left))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Drag);

// export default Drag;