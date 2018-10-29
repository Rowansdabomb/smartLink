import React from 'react';
import {render} from 'react-dom';
import {Store} from 'react-chrome-redux';
import {connect} from 'react-redux';
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
    this.props.resetAttributes()
    chrome.runtime.onMessage.addListener(request => {
      console.log(request.type)
      switch(request.type) {
        case 'GET-SELECTION':
          let data = getSelection()
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
        case 'RESET-ATTRIBUTE':
          nodeList = document.getElementsByClassName(SL_CLASS)
          for (let i = nodeList.length - 1; i >= 0; i--) {
            removeHighlight(nodeList[i])
          }
          break
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.state.removeSelection !== null)
    if (this.newSelection) {
      console.log('before here', this.props.attributes.attributes[this.props.attributes.length - 1])
      const selection = this.props.attributes.attributes[this.props.attributes.attributes.length - 1]
      console.log(selection[selection.length - 1], selection)
      wrapSelection(selection[selection.length - 1], selection)
      this.highlight()
      this.newSelection = false
    } if (this.state.removeSelection !== null) {
      let nodeList = document.getElementsByClassName(SL_CLASS + '-' + this.state.removeSelection)
      console.log(SL_CLASS + '-' + this.state.removeSelection)
      console.log(nodeList)
      for (let i = nodeList.length - 1; i >= 0; i--) {
        // console.log(request.index, nodeList[i])
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
  resetAttributes: () => dispatch(resetAttributes()),
  incrementTotalSelection: () => dispatch(incrementTotalSelection())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Highlight);