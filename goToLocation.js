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

/*
 * Gets Dom element, wraps it with css, and scrolls to it
 */
var goToLocation = (attributes, smoothScroll) => {
  var scrollBehaviour = smoothScroll ? 'smooth': 'auto'
  var [at, ft, ai, fi, ao, fo, iai, ifi] = attributes;
  
  var anchorElements = document.querySelectorAll(at.toLowerCase());
  var focusElements = document.querySelectorAll(ft.toLowerCase());

  highlightSelection(attributes)
  let offset = absoluteOffset(anchorElements[ai])

  // get scrollable element
  var parent = anchorElements[ai].parentElement
  while (parent !== null) {
    var overflowY = window.getComputedStyle(parent, null).overflowY
    if (overflowY === 'auto' || overflowY === 'scroll') {
      parent.scroll({
        top: offset.top - 200,
        behavior: scrollBehaviour
      })
    } 
    parent = parent.parentElement
  } 
}

///////////////////////////////////////////////////////////////////////////
//////////////////////////////  MAIN  /////////////////////////////////////
///////////////////////////////////////////////////////////////////////////


const mainGTL = () => {
  try {
    attributes = getData('surldata')
  
    if (attributes) {
      getHighlightColor(true, attributes)
    }
  
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
  
        getHighlightColor(false)
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
  return
}

let index = 0;
let attributes = []
let setup  = false

mainGTL ()