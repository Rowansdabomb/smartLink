import React from 'react';
import {render} from 'react-dom';
import {Store} from 'react-chrome-redux';
import {connect} from 'react-redux';
import {
  getSelection, 
  // copyLinkToClipboard,
  wrapSelection,
  OC_CLASS
} from '../../utils'

import './highlight.css';

import {
  addAttribute,
  resetAttributes
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
      index: 0
    }
  }

  componentDidMount() {
    this.props.resetAttributes()
    chrome.runtime.onMessage.addListener(request => {
      if (request.type === 'GET-SELECTION') {
        let data = getSelection()
        if (data.length === 8) {
          this.props.addAttribute(data)
          this.newSelection = true
        } else {
          console.error("attribute length is not 8")
        }
      }
      if (request.type === 'NEW-HIGHLIGHT-COLOR') {
        console.log('new color selected')
        this.highlight()
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.props.attributes, this.state.index)
    console.log(this.copyLinkToClipboard())
    if (this.newSelection) {
      console.log(this.props.attributes[this.state.index])
      wrapSelection(this.state.index, this.props.attributes[this.state.index])
      this.highlight()
      this.newSelection = false
    }
  }
  
  copyLinkToClipboard = () => {
    let query = this.props.attributes.map((key, index) => {
      return this.props.attributes[index].join('_')
    }).join('.')
  
    let url = new URLSearchParams(window.location.search)
    url.delete('surldata')
    url.append('surldata', query)
    
    this.urlCopyRef.current.value = window.location.origin + window.location.pathname + '?' + url.toString();
    
    this.urlCopyRef.current.select();
    document.execCommand('copy');
    
    return this.urlCopyRef.current.value
  }

  highlight = () => {
    console.log(this.props.highlightColor)
    for (let selection of document.getElementsByClassName(OC_CLASS)) {
      console.log(selection)
      selection.style.backgroundColor = this.props.highlightColor
    }
    //add element to dragable here
    this.setState(prevstate => ({
      index: prevstate.index + 1
    }))

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
  attributes: state.attributes.attributes,
  highlightColor: state.colors.highlightColor
});

const mapDispatchToProps = dispatch => ({
  addAttribute: (attributes) => dispatch(addAttribute(attributes)),
  resetAttributes: () => dispatch(resetAttributes())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Highlight);