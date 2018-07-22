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

    // if (offset === 'surround') {
    //   if (node.firstChild) {
    //     return node.firstChild
    //   } else {
    //     return node;
    //   }
    // } 
    // if (node.childNodes.length <= 0) {
    //   console.log('one node', node)
    //   return node.firstChild
    // } else {
    
      // console.log('multi node')
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
    // node.childNodes.forEach((childNode, i) => {
      
    // }) 
    //   // if (child.length > offset) {
    //   //   console.log(child, child.firstChild, child.nodeType)
    //   //   return child
    //   // }
    // console.log(child)
    return null
}
// // start, startOffset, end, endOffset,
// var insertHighlight = ([start, startOffset, startIndex, end, endOffset, endIndex], nodeList) => {
//   for (let i = start; i <= end; i++) {
//     var range = document.createRange();
//     console.log('start', start, 'end', end)
//     console.log(startOffset, endOffset, nodeList[i])
//     console.log(nodeList[i].childNodes, nodeList[i])
//     if (i === start) {
//       // if (nodeList[i].childNodes[startIndex]) {
//       //   range.setStart(nodeList[i].childNodes[startIndex], startOffset)
//       // } else {
//         range.setStart(nodeList[i], startOffset)
//       // }
//       // range.setStart(nodeList[i].firstChild, startOffset)
//       if (i === end) {
//         // if (nodeList[i].childNodes[endIndex]) {
//         //   range.setEnd(nodeList[i].childNodes[endIndex], endOffset)
//         // } else {
//           range.setEnd(nodeList[i], endOffset)
//         // }
//         // range.setEnd(setOffset(nodeList[i], endIndex), endOffset)
//         // range.setEnd(nodeList[i].firstChild, endOffset)
//       } else {
//         range.setEndAfter(setOffset(nodeList[i], endIndex))
//         // range.setEndAfter(nodeList[i])
//       }
//     } else if (i  === end) {
//       range = setOffset(range, nodeList[i ], 0, true)
//       range = setOffset(range, nodeList[i ], endOffset, false)
//     } else {
//       range = setOffset(range, nodeList[i ], 0, true)
//       range = setOffset(range, nodeList[i ], 'surround', false)
//     }

//     console.log(range)
//     var newNode = document.createElement("div");
//     newNode.className = 'surlHighlight';
  
//     range.surroundContents(newNode);
//     j = 1;
//   }

// }

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
    // var parentNodes = document.querySelectorAll(pt.toLowerCase())

    // var commonParent = document.commonParent(anchorElements[ai], focusElements[fi])

    // var nodeList = commonParent.childNodes

    // var nodeList = parentNodes.childNodes[pt].childNodes
    // console.log(commonParent.children, commonParent.childNodes)
    // var anchorIndex = 0;
    // var focusIndex = 0;

    console.log(focusElements, anchorElements)
    // console.log(nodeList)
    // for (let i = 0; i < nodeList.length; i++) {
      
    //   // index of the tag
    //   if (anchorElements[ai] === nodeList[i]) {
    //     anchorIndex = i
    //   }
    //   if (focusElements[fi] === nodeList[i]) {
    //     focusIndex = i
    //   }
    // }

    var offset = 0
    // var data =[]
    // different nodes, arrange node index
    // if (focusIndex > anchorIndex) {
    //   offset = absoluteOffset(anchorElements[ai])
    //   data = [iai, ao, iai, ifi, fo, ifi]
    // } else if (focusIndex < anchorIndex){
    //   offset = absoluteOffset(focusElements[fi])
    //   data = [ifi, fo, ifi, iai, ao]
    // } 
    // // same node, arrange by child index
    // else if (ifi > iai) {
    //   offset = absoluteOffset(anchorElements[ai])
    //   data = [iai, ao, iai, ifi, fo, ifi]
    // } else if (iai > ifi) {
    //   offset = absoluteOffset(anchorElements[ai])
    //   data = [ifi, fo, ifi, iai, ao]
    // }
    // //same child, arrange by caret offset
    // else if (fo > ao) {
    //   offset = absoluteOffset(anchorElements[ai])
    //   data = [anchorIndex, ao, iai, focusIndex, fo, ifi]
    // } else {
    //   offset = absoluteOffset(anchorElements[ai])
    //   data = [focusIndex, fo, ifi, anchorIndex, ao, iai]
    // }

    // insertHighlight(data, nodeList)

    var range = document.createRange();
    console.log('a>f', anchorElements[ai].contains(focusElements[fi]))
    console.log('f>a', focusElements[fi].contains(anchorElements[ai]) )
    if (anchorElements[ai].contains(focusElements[fi])) {
      // anchorElements[ai].childNodes.indexOf()
      console.log(focusElements[fi].childNodes[ifi])
      range.setStart(anchorElements[ai].childNodes[iai], ao)
      range.setEnd(focusElements[fi].childNodes[ifi], focusElements[fi].childNodes[ifi].length)
    } else if (focusElements[fi].parentNode === anchorElements[ai]) {
      range.setStart(focusElements[fi].childNodes[ifi], fo)
      range.setEndAfter(anchorElements[ai].childNodes[iai])
    } else {
      range.setStart(anchorElements[ai].childNodes[iai], ao)
      range.setEnd(focusElements[fi].childNodes[ifi], fo)
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
// var pt, pi, ao, fo, iai, ifi
try {
  [at, ft, ai, fi, ao, fo, iai, ifi] = getData('surldata')
  // [pt, pi, ao, fo, iai, ifi] = getData('surlData')

  goToLocation([at[0], ft[0], ai[0], fi[0], ao[0], fo[0], iai[0], ifi[0]], false)
  // goToLocation([pt[0], pi[0], ao[0], fo[0], iai[0], ifi[0]], false)
  
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