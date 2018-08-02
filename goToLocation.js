let highlightColor = 'yellow'
const surlClass = 'surlHighlight'

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
    const parent = node.parentNode
    parent.insertBefore(node.firstChild, node)
    parent.removeChild(node)
    parent.normalize()
  }
  return null
}

var insertHighlight = (range) => {
  var newNode = document.createElement("div");
  newNode.className = 'surlHighlight';
  range.surroundContents(newNode);
  return null
}

function getTextNodesBetween(rootNode, startNode, endNode) {
  var pastStartNode = false, reachedEndNode = false, textNodes = [];

  function getTextNodes(node) {
      if (node == startNode) {
          pastStartNode = true;
      } else if (node == endNode) {
          reachedEndNode = true;
      } else if (node.nodeType == 3) {
          if (pastStartNode && !reachedEndNode && !/^\s*$/.test(node.nodeValue)) {
              textNodes.push(node);
          }
      } else {
          for (var i = 0, len = node.childNodes.length; !reachedEndNode && i < len; ++i) {
              getTextNodes(node.childNodes[i]);
          }
      }
  }

  getTextNodes(rootNode);
  return textNodes;
}

/*
 * Gets Dom element, wraps it with css, and scrolls to it
 */

var goToLocation = (attributes, smoothScroll) => {
  var scrollBehaviour = smoothScroll ? 'smooth': 'auto'
  var [at, ft, ai, fi, ao, fo, iai, ifi] = attributes;

  while (document.getElementsByClassName(surlClass).length > 0) {
    const nodeList =  document.getElementsByClassName(surlClass)
    removeHighlight(nodeList[0])
  }
  
  if (isDefined(at) && isDefined(ft) && isDefined(ao) && isDefined(fo)) {
    var anchorElements = document.querySelectorAll(at.toLowerCase());
    var focusElements = document.querySelectorAll(ft.toLowerCase());

    var offset = 0
    var range = document.createRange();

    console.log(anchorElements[ai], focusElements[fi])

    if (anchorElements[ai].childNodes[iai] === focusElements[fi].childNodes[ifi]) {
      range.setStart(anchorElements[ai].childNodes[iai], ao)
      range.setEnd(focusElements[fi].childNodes[ifi], fo)
      insertHighlight(range)
    } else {
      var textNodes = getTextNodesBetween(document.body, anchorElements[ai].childNodes[iai], focusElements[fi].childNodes[ifi]);

      range.setStart(anchorElements[ai].childNodes[iai], ao)
      range.setEndAfter(anchorElements[ai].childNodes[iai])
      insertHighlight(range)
  
      let count = 0
      for (let node of textNodes) {
        if (focusElements[fi].contains(node)) {
          count++
        }
        range.selectNodeContents(node)
        insertHighlight(range)
      }
  
      console.log(textNodes, focusElements[fi].childNodes, ifi, fo)
      range.setStartBefore(focusElements[fi].childNodes[ifi + count])
      range.setEnd(focusElements[fi].childNodes[ifi + count], fo)
      insertHighlight(range)
    }

    // if (anchorElements[ai].contains(focusElements[fi].parentElement)) {
    //   console.log('a>f')
    //   range.setStartBefore(focusElements[fi].childNodes[ifi])
    //   range.setEnd(focusElements[fi].childNodes[ifi], fo)
    //   insertHighlight(range)

    //   let child = focusElements[fi]
    //   let parent = child.parentElement
      
    //   while(parent !== anchorElements[ai]) {
    //     range.setStartBefore(parent.firstChild)
    //     range.setEndBefore(child)
    //     child = parent
    //     parent = parent.parentElement
    //     insertHighlight(range)
    //   }
    //   range.setStart(anchorElements[ai].childNodes[iai], ao)
    //   range.setEndAfter(anchorElements[ai].childNodes[iai])

    //   insertHighlight(range)
    // } else if (at !== ft) {
    //   console.log('at!==ft')
    //   range.setStartBefore(focusElements[fi].childNodes[ifi])
    //   range.setEnd(focusElements[fi].childNodes[ifi], fo)
    //   insertHighlight(range)

    //   range.setStart(anchorElements[ai].childNodes[iai], ao)
    //   range.setEndAfter(anchorElements[ai].childNodes[iai])
    //   insertHighlight(range)
    //   let next = anchorElements[ai].nextSibling
    //   if (next) {
    //     while(!next.contains(focusElements[fi].childNodes[ifi])) {
    //       range.setStartBefore(next.firstChild)
    //       range.setEndAfter(next.lastChild)
    //       insertHighlight(range)
    //       next = next.nextSibling
    //     }
    //     next = next.firstChild
    //     while (next && !next.contains(focusElements[fi].childNodes[ifi])) {
    //       // console.log(next)
    //       range.setStartBefore(next)
    //       range.setEndAfter(next)
    //       insertHighlight(range)
    //       next = next.nextSibling
    //     }
    //   }
    // } else if (fi > ai) {
    //   console.log('fi>ai')
    //   for (let i = ai; i <= fi; i++) {
    //     if (i === ai) {
    //       range.setStart(anchorElements[ai].childNodes[iai], ao)
    //       range.setEndAfter(anchorElements[ai].childNodes[iai])
    //     } else if (i === fi) {
    //       range.setStartBefore(focusElements[fi].childNodes[ifi])
    //       range.setEnd(focusElements[fi].childNodes[ifi], fo)
    //     } else {
    //       range.setStartBefore(anchorElements[i].firstChild)
    //       range.setEndAfter(anchorElements[i].lastChild)
    //     }
    //     insertHighlight(range)
    //   }
    // } else {
    //   range.setStart(anchorElements[ai].childNodes[iai], ao)
    //   range.setEnd(focusElements[fi].childNodes[ifi], fo)
    //   insertHighlight(range)
    // } 

    setColor(highlightColor)
    offset = absoluteOffset(anchorElements[ai])

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

function setColor(color) {
  for (selection of document.getElementsByClassName(surlClass)) {
    selection.style.backgroundColor = highlightColor
  }
}

let index = 0;
let attributes = []
let setup  = false

try {
  attributes = getData('surldata')
  
  chrome.storage.sync.get("highlightColor", function(color) {
    highlightColor = color.highlightColor
    goToLocation(attributes.map(a => {return a[index]}), false)
  })
  
  setup = true
} catch (error) {
  console.warn('Could not go to location: ', error)
  setup = false
}

if (setup) {
  chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    var hMod = request.hMod || null;
    var hColor = request.highlightColor || null;

    if (hColor) {
      sendResponse(JSON.stringify({hColor: {success: true}}));

      highlightColor = hColor
      setColor(hColor)
    }

    if (hMod) {
      index = index + hMod;
      if (index < 0) {
        index = attributes[0].length - 1
      } else if (index >= attributes[0].length) {
        index = 0
      }
      sendResponse(JSON.stringify({hMod: {index: index + 1, totalAnchors: attributes[0].length, success: true}}));
      goToLocation(attributes.map(a => {return a[index]}), true)
    }
    else {
      sendResponse(JSON.stringify({hMod: {index: null, totalAnchors: 0, success: false}}));
    }  
  })
}