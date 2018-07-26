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

    // empty nodes keep popping up

    // for (n of parent.childNodes) {
    //   console.log(n, n.textContent)
    //   if (n.textContent === '') {
    //     parent.removeChild(n)
    //   }
    // }
  }
  return null
}

var insertHighlight = (range) => {
  console.log(range)
  var newNode = document.createElement("div");
  newNode.className = 'surlHighlight';
  range.surroundContents(newNode);
  return null
}

/*
 * Gets Dom element, wraps it with css, and scrolls to it
 */

var goToLocation = (attributes, smoothScroll) => {
  var scrollBehaviour = smoothScroll ? 'smooth': 'auto'
  var [at, ft, ai, fi, ao, fo, iai, ifi] = attributes;

  for (node of document.getElementsByClassName(surlClass)) {
    removeHighlight(node)
  }

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
      if(ai > fi) {
        console.log('ai>fi')
        for (let i = fi; i <= ai; i++) {
          if (i === fi) {
            range.setStart(focusElements[fi].childNodes[ifi], fo)
            range.setEndAfter(focusElements[fi].childNodes[ifi])
          } else if (i === ai) {
            range.setStartBefore(anchorElements[ai].childNodes[iai])
            range.setEnd(anchorElements[ai].childNodes[iai], ao)
          } else {
            range.setStartBefore(focusElements[i].firstChild)
            range.setEndAfter(focusElements[i].lastChild)
          }
          insertHighlight(range)
        }
      } else if (fi > ai) {
        console.log('fi>ai')
        for (let i = ai; i <= fi; i++) {
          if (i === ai) {
            range.setStart(anchorElements[ai].childNodes[iai], ao)
            range.setEndAfter(anchorElements[ai].childNodes[iai])
          } else if (i === fi) {
            range.setStartBefore(focusElements[fi].childNodes[ifi])
            range.setEnd(focusElements[fi].childNodes[ifi], fo)
          } else {
            range.setStartBefore(anchorElements[i].firstChild)
            range.setEndAfter(anchorElements[i].lastChild)
          }
          insertHighlight(range)
        }
      } else if (ao < fo) {
        console.log('fo>ao')
        range.setStart(anchorElements[ai].childNodes[iai], ao)
        range.setEnd(focusElements[fi].childNodes[ifi], fo)
        insertHighlight(range)
      } else {
        console.log('ao>fo')
        range.setStart(focusElements[fi].childNodes[ifi], fo)
        range.setEnd(anchorElements[ai].childNodes[iai], ao)
        insertHighlight(range)
      }
    }

    // var newNode = document.createElement("div");
    // newNode.className = 'surlHighlight';
    // try {
    //   range.surroundContents(newNode);
    // } catch (InvalidStateError) {
    //   console.error(InvalidStateError)
    // }
    

    setColor(highlightColor)

    offset = absoluteOffset(anchorElements[ai])

    // get scrollable element
    var parent = anchorElements[ai].parentElement
    while (parent !== null) {
      var overflowY = window.getComputedStyle(parent, null).overflowY
      if (overflowY === 'auto' || overflowY === 'scroll') {
        console.log(parent)
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
  console.log(color)
  for (selection of document.getElementsByClassName(surlClass)) {
    selection.style.backgroundColor = highlightColor
  }
}

// document.addEventListener('DOMContentLoaded', function(event) {
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
    console.log(error)
    setup = false
  }
  if (setup) {
    chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
      var hMod = request.hMod || null;
      var hColor = request.highlightColor || null;
  
      if (hColor) {
        console.log(hColor)
        sendResponse(JSON.stringify({hColor: {success: true}}));

        highlightColor = hColor
        setColor(hColor)
      }
  
      if (hMod) {
        index = index + hMod;
        console.log(index, attributes[0])
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
// })