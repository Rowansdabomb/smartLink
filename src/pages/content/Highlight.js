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
  updateUrl,
  addRangeData,
  loadRangeData,
  resetRangeData,
  incrementTotalSelection
} from '../background/actions'

const store = new Store({
  portName: 'SMARTLINK',
})

class Highlight extends React.Component {
  constructor(props) {
    super(props)
    this.urlCopyRef = React.createRef()
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
          if (data.length === 8) {
            this.props.addRangeData(data)
            this.props.updateUrl(window.location.origin + window.location.pathname)
            this.props.incrementTotalSelection()
          } else {
            console.error("rangeData length is not 8")
          }
          break
        case 'NEW-HIGHLIGHT-COLOR':
          this.highlight()
          break
        case 'REMOVE-RANGE-DATA':
          let nodeList = document.getElementsByClassName(SL_CLASS + '-' + request.index)
          for (let i = nodeList.length - 1; i >= 0; i--) {
            removeHighlight(nodeList[i])
          }
          break
        case 'RESET':
          nodeList = document.getElementsByClassName(SL_CLASS)
          for (let i = nodeList.length - 1; i >= 0; i--) {
            removeHighlight(nodeList[i])
          }
          break
      }
    });
    this.unpackURL()
  }

  componentDidUpdate(prevProps, prevState) {
    // Highlight new selections or pre-existing selections
    console.log("current", this.props.pageData)
    console.log("prev", prevProps.pageData.rangeData)
    if (this.props.pageData.rangeData.length > prevProps.pageData.rangeData.length) {
      console.log('wrapSelection')
      const selection = this.props.pageData.rangeData[this.props.pageData.rangeData.length - 1]
      wrapSelection(selection[selection.length - 1], selection)
      this.highlight()
      this.copyLinkToClipboard()
      
      if (this.init) {
        this.init = false;
      }
    }
  }

  unpackURL = () => {
    if (window.location.search.includes(SL_URL)) {
      //Clear the rangeData
      this.props.resetRangeData()

      //Unpack rangeData from url
      const queryParams = new URLSearchParams(window.location.search)
      const data = queryParams.get(SL_URL)
      
      if (data === null) return false
    
      const result = data.split('.').map((element) => {
        return element.split('_').map((element, index) => {
          if (index > 1) 
           return Number(element)
          return element
        })
      }); 
      for (let rangeData of result) {
        this.props.addRangeData(rangeData)
      }
      this.props.updateUrl(window.location.origin + window.location.pathname)
    } else {
      this.props.loadRangeData(window.location.origin + window.location.pathname)
    }

    //Highlight rangeData
    for (const index in this.props.pageData.rangeData){
      const selection = this.props.pageData.rangeData[index]
      wrapSelection(selection[selection.length - 1], selection)
      this.highlight()
      this.copyLinkToClipboard()
    }
  }
  
  copyLinkToClipboard = () => {
    let query = this.props.pageData.rangeData.map((key, index) => {
      return this.props.pageData.rangeData[index].join('_')
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
  addRangeData: (rangeData) => dispatch(addRangeData(rangeData)),
  loadRangeData: (url) => dispatch(loadRangeData(url)),
  updateUrl: (url) => dispatch(updateUrl(url)), 
  resetRangeData: () => dispatch(resetRangeData()),
  incrementTotalSelection: () => dispatch(incrementTotalSelection())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Highlight);