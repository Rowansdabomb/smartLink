/*
 * Unpacks varibales from the url
 */
var getQueryVariable = (variable) => {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) { 
      return pair[1].split('_'); 
    }
  }
  return false;
}

var isDefined = (value) => {
  if (typeof value !== 'undefined' || value === null || value === false) {
    return true
  }
  return false
}

var absoluteOffset = function(element) {
  var top = 0, left = 0;
  do {
      top += element.offsetTop  || 0;
      left += element.offsetLeft || 0;
      element = element.offsetParent;
  } while(element);

  return {
      top: top,
      left: left
  };
};

document.commonParent = function(a, b) {
  if (a === b) {
    return a.parentNode
  } else {
    var pa = [], L;
    while (a) {
      pa[pa.length] = a;
      a = a.parentNode;
    }
    L = pa.length;
    while (b) {  
      for(var i = 0; i < L; i++){
        if (pa[i] == b) return b;
      }
      b = b.parentNode;
    }
  }
}

var insertHighlight = (start, startOffset, end, endOffset, nodeList) => {
  for (let i = start; i <= end; i++) {
    var range = document.createRange();
    console.log(startOffset, endOffset)
    if (i === start) {
      console.log('first tag')
      range.setStart(nodeList[i].firstChild, startOffset)
      if (i === end) {
        console.log('same start and end tag')
        range.setEnd(nodeList[i].firstChild, endOffset)
      } else {
        console.log('different start and end tag')
        range.setEnd(nodeList[i].firstChild, nodeList[i].firstChild.length)
      }
    } else if (i === end) {
      range.setStart(nodeList[i].firstChild, 0)
      range.setEnd(nodeList[i].firstChild, endOffset)
    } else {
      range.setStart(nodeList[i].firstChild, 0)
      range.setEnd(nodeList[i].firstChild, nodeList[i].firstChild.length)
    }

    var newNode = document.createElement("div");
    newNode.className = 'surlHighlight';

    range.surroundContents(newNode);
  }
}

/*
 * Gets Dom element, wraps it with css, and scrolls to it
 */

var goToLocation = (attributes, smoothScroll) => {
  var scrollBehaviour = smoothScroll ? 'smooth': 'auto'
  var [at, ft, ai, fi, ao, fo] = attributes;
  if (isDefined(at) && isDefined(ft) && isDefined(ai) && isDefined(fi) && isDefined(ao) && isDefined(fo)) {
    var anchorNodes = document.querySelectorAll(at.toLowerCase());
    var focusNodes = document.querySelectorAll(ft.toLowerCase());

    var commonParent = document.commonParent(anchorNodes[ai], focusNodes[fi])
    var nodeList = commonParent.children
    var anchorIndex = 0;
    var focusIndex = 0;
    for (let i = 0; i < nodeList.length; i++) {

      if (anchorNodes[ai] === nodeList[i]) {
        anchorIndex = i
      }
      if (focusNodes[fi] === nodeList[i]) {
        focusIndex = i
      }
    }

    var offset = 0
    // different elements, arrange element indexes
    if (focusIndex > anchorIndex) {
      offset = absoluteOffset(anchorNodes[ai])
      insertHighlight(anchorIndex, ao, focusIndex, fo, nodeList)
    } else if (focusIndex < anchorIndex){
      offset = absoluteOffset(focusNodes[fi]),
      insertHighlight(focusIndex, fo, anchorIndex, ao, nodeList)
    } 
    // same element, arrange offsets
    else if (fo > ao) {
      offset = absoluteOffset(anchorNodes[ai])
      insertHighlight(anchorIndex, ao, focusIndex, fo, nodeList)
    } else {
      offset = absoluteOffset(anchorNodes[ai])
      
      insertHighlight(focusIndex, fo, anchorIndex, ao, nodeList)
    }


    // get scrollable element
    var parent = anchorNodes[ai].parentElement
    var foundScroll = false
    while (parent !== null) {
      var overflowY = window.getComputedStyle(parent, null).overflowY
      if (overflowY === 'auto' || overflowY === 'scroll') {
        parent.scroll({
          top: offset.top - 100,
          behavior: scrollBehaviour
        })
      } 

      parent = parent.parentElement
    } 
  }
}

var index = 1;
var at = getQueryVariable('surlat')
var ft = getQueryVariable('surlft')
var ai = getQueryVariable('surlai')
var fi = getQueryVariable('surlfi')
var ao = getQueryVariable('surlao')
var fo = getQueryVariable('surlfo')

goToLocation([at[0], ft[0], ai[0], fi[0], ao[0], fo[0]], false)

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
  var data = request.data || {};

  if (data) {
    index = index + data;
    if (index < 0) {
      index = at.length -1
    } else if (index >= at.length) {
      index = 0
    }
    sendResponse(JSON.stringify({index: index, totalAnchors: at.length, success: true}));
    goToLocation([at[index], ft[index], ai[index], fi[index], ao[index], fo[index]], true)
  }
  else {
    sendResponse(JSON.stringify({index: null, totalAnchors: 0, success: false}));
  }  
});