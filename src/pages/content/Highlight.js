import React from 'react';
import {render} from 'react-dom';
import {Store} from 'react-chrome-redux';
import {connect} from 'react-redux';
import { saveState, loadState } from '../background/localstorage';
import {
  SL_CLASS,
  SL_URL,
  getSelection, 
  wrapSelection,
  removeHighlight
} from '../../utils'

import './highlight.css';

import {
  addAttribute,
  updateUrl,
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
    this.init = false // should only be used on refresh
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
          console.log('GET-SELECTION', data)
          if (data.length === 8) {
            this.props.addAttribute(data)
            this.props.updateUrl(window.location.origin + window.location.pathname)
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
        // case 'RESET-ATTRIBUTES':
        //   nodeList = document.getElementsByClassName(SL_CLASS)
        //   for (let i = nodeList.length - 1; i >= 0; i--) {
        //     removeHighlight(nodeList[i])
        //   }
        //   break
      }
    });
    if (window.location.search.includes(SL_URL)) {
      //Clear the attributes
      this.props.resetAttributes()

      //Unpack attributes from url
      const queryParams = new URLSearchParams(window.location.search)
      const data = queryParams.get(SL_URL)
      
      if (data === null) return false
    
      const result = data.split('.').map((element, index) => {
        if (index > 1) return element.split('_').map((element) => {return Number(element)})
        else return element.split('_').map((element) => {return element})
      }); 
      for (let attribute of result) {
        this.props.addAttribute(attribute)
      }
    }

    //Highlight attributes
    for (const index in this.props.pageData.attributes){
      const selection = this.props.pageData.attributes[index]
      wrapSelection(selection[selection.length - 1], selection)
      this.highlight()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('highlight component did update')
    // Highlight new selections or pre-existing selections
    if (this.newSelection) {
      const selection = this.props.pageData.attributes[this.props.pageData.attributes.length - 1]
      wrapSelection(selection[selection.length - 1], selection)
      this.highlight()
      this.copyLinkToClipboard()
      
      this.newSelection = false
      if (this.init) {
        this.init = false;
      }
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
    let query = this.props.pageData.attributes.map((key, index) => {
      return this.props.pageData.attributes[index].join('_')
    }).join('.')
  
    let url = new URLSearchParams(window.location.search)
    url.delete(SL_URL)
    url.append(SL_URL, query)
    
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
  pageData: state.pageData,
  highlightColor: state.colors.highlightColor
});

const mapDispatchToProps = dispatch => ({
  addAttribute: (attributes) => dispatch(addAttribute(attributes)),
  updateUrl: (url) => dispatch(updateUrl(url)), 
  resetAttributes: () => dispatch(resetAttributes()),
  incrementTotalSelection: () => dispatch(incrementTotalSelection())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Highlight);