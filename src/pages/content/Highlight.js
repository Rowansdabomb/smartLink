import React from 'react';
import {render} from 'react-dom';
import {Store} from 'react-chrome-redux';
import {connect} from 'react-redux';
import { saveState, loadState } from '../background/localstorage';
import {
  SL_CLASS,
  getSelection, 
  wrapSelection,
  removeHighlight
} from '../../utils'

import './highlight.css';

import {
  addAttribute,
  resetAttributes,
  incrementTotalSelection
} from '../background/actions'

const store = new Store({
  portName: 'OCTOCOMPARE',
})

class Highlight extends React.Component {
  constructor(props) {
    super(props)
    this.urlCopyRef = React.createRef()
    this.newSelection = false
    this.state = {
      url: '',
      index: 0,
      removeSelection: null
    }
  }

  componentDidMount() {
    chrome.runtime.onMessage.addListener(request => {
      switch(request.type) {
        case 'GET-SELECTION':
          let data = getSelection()
          console.log(data)
          if (data.length === 8) {
            this.props.addAttribute(data)
            this.props.incrementTotalSelection()
            this.newSelection = true
          } else {
            console.error("attribute length is not 8")
          }
          break
        case 'NEW-HIGHLIGHT-COLOR':
          this.highlight()
          break
        case 'REMOVE-ATTRIBUTE':
          this.setState({
            removeSelection: request.index
          })
          break
        case 'RESET-ATTRIBUTES':
          // console.log(nodeList)
          nodeList = document.getElementsByClassName(SL_CLASS)
          console.log('RESET then', nodeList)
          for (let i = nodeList.length - 1; i >= 0; i--) {
            removeHighlight(nodeList[i])
          }
          break
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.newSelection) {
      const selection = this.props.attributes.attributes[this.props.attributes.attributes.length - 1]
      wrapSelection(selection[selection.length - 1], selection)
      this.highlight()
      this.copyLinkToClipboard()
      this.newSelection = false
    } 
    if (this.state.removeSelection !== null) {
      let nodeList = document.getElementsByClassName(SL_CLASS + '-' + this.state.removeSelection)
      for (let i = nodeList.length - 1; i >= 0; i--) {
        removeHighlight(nodeList[i])
      }
      this.setState({
        removeSelection: null
      })
    }
  }
  
  copyLinkToClipboard = () => {
    let query = this.props.attributes.attributes.map((key, index) => {
      return this.props.attributes.attributes[index].join('_')
    }).join('.')
  
    let url = new URLSearchParams(window.location.search)
    url.delete('SL_URL')
    url.append('SL_URL', query)
    
    this.urlCopyRef.current.value = window.location.origin + window.location.pathname + '?' + url.toString();
    
    this.urlCopyRef.current.select();
    document.execCommand('copy');
    
    return this.urlCopyRef.current.value
  }

  highlight = () => {
    for (let selection of document.getElementsByClassName(SL_CLASS)) {
      selection.style.backgroundColor = this.props.highlightColor
    }
  }

  render() {
    
    return(
      <div id='oc-highlighter'>
        <textarea id='oc-textarea' ref={this.urlCopyRef} defaultValue={this.state.url}></textarea>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  attributes: state.attributes,
  highlightColor: state.colors.highlightColor
});

const mapDispatchToProps = dispatch => ({
  addAttribute: (attributes) => dispatch(addAttribute(attributes)),
  resetAttributes: (tabId) => dispatch(resetAttributes(tabId)),
  incrementTotalSelection: () => dispatch(incrementTotalSelection())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Highlight);