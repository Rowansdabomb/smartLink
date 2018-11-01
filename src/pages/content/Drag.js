import React from 'react';
import {render} from 'react-dom';
import {Store} from 'react-chrome-redux';
import {connect} from 'react-redux';

import './drag.css';

import {
  setOrigin, 
  removeAttribute,
} from "../background/actions";

import {
  SL_URL,
  goToLocation,
} from '../../utils';

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
      open: this.props.attributes.length > 0,
    }
  }

  componentDidMount() {
    let url = new URLSearchParams(window.location.search)
    if(url.has(SL_URL)) {
      this.setState({
        open: true
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if ( this.props.attributes.length > prevProps.attributes.length) {
      this.setState({
        open: true
      })
    }
    if (this.state.dragging && !prevState.dragging) {
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('mouseup', this.onMouseUp)
    } else if (!this.state.dragging && prevState.dragging) {
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

  closeDragElement = () => {
    this.setState({
      open: false
    })
  }

  renderItem = (index, selection) => {
    const at = this.props.attributes[index][0]
    const ai = this.props.attributes[index][2]
    // console.log(selection, selection[selection.length - 1])
    return(
      <div key={index} className='oc-d-li'>
        <span onClick={() => {goToLocation(true, at, ai)}}>{selection}{' '}{index}</span>
        <i className='fa fa-trash' 
          onClick={() => { this.props.removeAttribute(selection[selection.length - 1])}}></i>  
      </div>
    )
  } 

  render() {
    console.log(this.props)
    const originStyle = {top: this.state.pos.y, left: this.state.pos.x}
    return(
      <div id='oc-d-wrapper'>
        {this.state.open && 
          <div id='oc-d-container' 
            ref={this.dragElement}
            style={originStyle}>
            <div id='oc-d-header' onMouseDown={(e) => this.onMouseDown(e)}>
              <div className="oc-d-title">Highlight Selections</div>
              <i className="oc-d-close fa fa-times" onClick={() => {this.closeDragElement()}}></i>
            </div>
            <div className="oc-d-ol">
              {this.props.attributes.map((selection, index) => {
                return(this.renderItem(index, selection))
              })}
            </div>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  origin : state.dragElement.origin,
  attributes: state.attributes.attributes,
  // isOpen : state.dragElement.isOpen
});

const mapDispatchToProps = dispatch => ({
  setOrigin: (top, left) => dispatch(setOrigin(top, left)),
  removeAttribute: (index) => dispatch(removeAttribute(index))
  // close: () => dispatch(closeDragElement()),
  // open: () => dispatch(openDragElement())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Drag);
