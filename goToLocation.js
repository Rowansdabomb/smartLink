/*
 * Unpacks varibales from the url
 */
var getData = (variable) => {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) { 
      return pair[1].split('.').map((element, index) => {
        if (index > 1) {
          return element.split('_').map((element) => {return Number(element)})
        } else{
          return element.split('_')
        }
      }); 
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

var setOffset = (node, index) => {
    let i = 0
    for (let child of node.childNodes) {
      if (i === index) {
        console.log('this child right here', child)
        child = childNode
        return child
      } else {
        console.log('nope', child)
      }
      i++
    }
    return null
}

var removeHighlight = (node) => {
  while(node.firstChild) {
    node.parentNode.insertBefore(node.firstChild, node)
  }
  return null
}

/*
 * Gets Dom element, wraps it with css, and scrolls to it
 */

var goToLocation = (attributes, smoothScroll) => {
  console.log(attributes)
  var scrollBehaviour = smoothScroll ? 'smooth': 'auto'
  var [at, ft, ai, fi, ao, fo, iai, ifi] = attributes;
  // var [pt, pi, ao, fo, iai, ifi] = attributes;
  if (isDefined(at) && isDefined(ft) && isDefined(ao) && isDefined(fo)) {
    var anchorElements = document.querySelectorAll(at.toLowerCase());
    var focusElements = document.querySelectorAll(ft.toLowerCase());

    var offset = 0
    var range = document.createRange();

    if (anchorElements[ai].contains(focusElements[fi].parentElement)) {
      console.log('a>f')
      // let parent = focusElements[fi].parentElement
      // while( parent.parentElement !== anchorElements[ai]) {
      //   parent = parent.parentElement
      // }
      // if(anchorElements[ai].indexOf(parent) > iai) {
      range.setStart(anchorElements[ai].childNodes[iai], ao)
      range.setEndBefore(anchorElements[ai].childNodes[iai])
      // } else {
      // range.setStartBefore(anchorElements[ai].childNodes[iai])
      // range.setEnd(anchorElements[ai].childNodes[iai], ao)
      // }
      var newNode = document.createElement("div");
      newNode.className = 'surlHighlight';
      range.surroundContents(newNode);

      range.setStartBefore(focusElements[fi].childNodes[ifi])
      range.setEnd(focusElements[fi].childNodes[ifi], fo)

    } else if (focusElements[fi].contains(anchorElements[ai].parentElement)) {
      console.log('f>a')
      range.setStart(focusElements[fi].childNodes[ifi], fo)
      range.setEndAfter(focusElements[ai].childNodes[ifi])

      var newNode = document.createElement("div");
      newNode.className = 'surlHighlight';
      range.surroundContents(newNode);

      range.setStartBefore(anchorElements[ai].childNodes[iai])
      range.setEnd(anchorElements[ai].childNodes[iai], ao)
    } else {
      if (ao < fo) {
        range.setStart(anchorElements[ai].childNodes[iai], ao)
        range.setEnd(focusElements[fi].childNodes[ifi], fo)
      } else {
        range.setStart(focusElements[fi].childNodes[ifi], fo)
        range.setEnd(anchorElements[ai].childNodes[iai], ao)
      }
      
    }

    var newNode = document.createElement("div");
    newNode.className = 'surlHighlight';
  
    range.surroundContents(newNode);
    console.log(range)

    // get scrollable element
    var parent = anchorElements[ai].parentElement
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
var at, ft, ai, fi, ao, fo, iai, ifi
try {
  [at, ft, ai, fi, ao, fo, iai, ifi] = getData('surldata')

  goToLocation([at[0], ft[0], ai[0], fi[0], ao[0], fo[0], iai[0], ifi[0]], false)
  
} catch (error) {
  
}

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
    goToLocation([at[index], ft[index], ai[index], fi[index], ao[index], fo[index], iai[index], ifi[index]], true)
  }
  else {
    sendResponse(JSON.stringify({index: null, totalAnchors: 0, success: false}));
  }  
});