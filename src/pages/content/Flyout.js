import React from 'react';
import {render} from 'react-dom';
import {Store} from 'react-chrome-redux';
import {connect} from 'react-redux';

import './flyout.css';

import {
  setOrigin, 
  toggleFlyout,
  removeRangeData,
} from "../background/actions";

import {
  SL_URL,
  SL_CLASS,
  goToLocation,
} from '../../utils';

const store = new Store({
  portName: 'SMARTLINK',
})

const icons = {
  'trash': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGsSURBVGhD7dq/K0VxGMfxm19FoSQpm4lB2FHKRBJlMtiUxWJAFpuN7Fb/gQmLVVlMFoVsiuRHIT/eT91vPenp3HM7v255PvVa7nPP934/0b3nnnNLKWUGJ3jBTwyfOMcKGlAT2YK12biO0IhCM4pvWBusxhoKzT70hr5wh6sI13iHPu4SheYCekNjiJMOPEAf245M0oZJzEe4h97MAqznWeSvo49dhvU8MYseVJ1W/H2hor1iGLHSjSXswFqsaIeQ/Q0hMiOwFqg164iMF8lZxSKdsN41ak0f/memcVwDNpAo8iFl/Y/m7QCJ4kVS5kVCKhV5gpzFisfyY8EHwky8Qc+foefyFUDPtcyLDCBETsP1TM6LdORDTM+noHMDPde8SIgXgRcxeJEQLwIvYvAiIV4EXsTgRUK8CLyIwYuEeBF4EYMXCalUZBXhCvli+bFAfhCgr6DLZvR8G3r+936klnmRvHiRkDlYC+dtF4kid7Dk0qe1eJ7kfn/i7MFaPC9nqEPiNOMU1otk7Ra9SC1N2ETUW2Sa5Mq9/GCnC5mkHv0Yx0RGBtGCKlIq/QI+C+St9GvhtAAAAABJRU5ErkJggg==',
  'close': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEHSURBVEhL7ZVNCsIwEIXrz1HUYwiuBA8jbkU8h4ILxZ14J0X0DoKI+p5mIAzNJLZ1IfTBh3Uw81EzTbM6v0jbfaamCRqfy/SMwQ0sQIuFSLrgCA6gx0JKJuDpsQGWjJIzkN9fQAeYYcM78EUkJGNDXyIsQTQroBcSLQtJrqAPomEzNtUNiMgsyRAkx5LtQSUSiSXTFJZIUmSlJRLKdiBP8gAjUElCGy/IgJRKTCKUkuknXuDfpWukkCwk4cZzT9ZezecrmSWR6WKz0DQmyXjM8xTWi/NG2JLNgBm+U07AX2Q9JyHZFETD9wmP+phEomVbV0sKx5pH/eD9LR425l3M3XWdv0uWvQDq/6w9IEeDKwAAAABJRU5ErkJggg==',
}

class Flyout extends React.Component {
  constructor(props) {
    super(props);
    this.flyout = React.createRef();
    this.state = {
      pos: {
        x: this.props.origin[1],
        y: this.props.origin[0]
      },
      dragging: false,
      rel: null,
    }
  }

  componentDidMount() {
    let url = new URLSearchParams(window.location.search)
    if(url.has(SL_URL) && this.props.flyoutHide) 
      this.props.toggleFlyout()
  }

  componentDidUpdate(prevProps, prevState) {
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
    let pos = this.flyout.current
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

  renderItem = (index, range) => {
    const at = this.props.rangeData[index][0]
    const ai = this.props.rangeData[index][2]
    const selection = document.getElementsByClassName(SL_CLASS + '-' + index)[0]
    const background = {
      backgroundImage: `url(${icons['trash']})`,
    }
    return(
      <div key={index} className='oc-d-li'>
        <span onClick={() => {goToLocation(true, at, ai)}}>{index + 1}{'. '}{selection ? selection.innerText : ''}</span>
        <div style={background} className="oc-d-icon" onClick={() => { this.props.removeRangeData(range[range.length - 1])}}></div>
      </div>
    )
  } 

  render() {
    const originStyle = {top: this.state.pos.y, left: this.state.pos.x}
    const background = {
      backgroundImage: `url(${icons['close']})`,
      margin: '6px'
    }
    return(
      <div id='oc-d-wrapper'>
        {!this.props.flyoutHide && this.props.rangeData.length > 0 &&
          <div id='oc-d-container' 
            ref={this.flyout}
            style={originStyle}>
            <div id='oc-d-header' onMouseDown={(e) => this.onMouseDown(e)}>
              <div className="oc-d-title">Highlight Selections</div>
              <div style={background} className="oc-d-icon" onClick={() => {this.props.toggleFlyout()}}></div>
            </div>
            <div className="oc-d-ol">
              {this.props.rangeData.map((range, index) => {
                return(this.renderItem(index, range))
              })}
            </div>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  origin : state.flyout.origin,
  rangeData: state.pageData.rangeData,
  flyoutHide : state.flyout.hide
});

const mapDispatchToProps = dispatch => ({
  setOrigin: (top, left) => dispatch(setOrigin(top, left)),
  toggleFlyout: () => dispatch(toggleFlyout()),
  removeRangeData: (index) => dispatch(removeRangeData(index))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Flyout);
