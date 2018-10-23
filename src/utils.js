export const OC_CLASS = 'surl-highlight'

const initData = () => {
// Called on Page load. 
// Unpacks attribute data from url. 
// Updates state attributes

  const queryParams = new URLSearchParams(window.location.search)
  const data = queryParams.get('surldata')
  
  if (data === null) return false

  const result = data.split('.').map((element, index) => {
    if (index > 1) return element.split('_').map((element) => {return Number(element)})
    else return element.split('_').map((element) => {return element})
  }); 
  state.appendAttributes(result)
  for (let i = 0; i < state.attributes[0].length; i++) {
    wrapSelection(i)
    // dragElement.addItem(i)
  }
}

var getTextNodesBetween = (rootNode, startNode, endNode) => {
  var pastStartNode = false, reachedEndNode = false, textNodes = [];

  var getTextNodes = (node) => {
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

// var getHighlightColor = (goTo) => {
// // Fetches current highlight color from chrome storage
// // goTo: boolean to determine if screen should scroll to first selection location

//   let color = ''
//   chrome.storage.sync.get("highlightColor", function(color) {
//     state.highlightColor = color.highlightColor
//     if (goTo) {
//       goToLocation(false, 0)
//     }
//     state.colorHighlights()
//   })
// }

var wrapRange = (range, index) => {
// Wraps range with highlight highlight class. Creates a draggable list of selections if one DNE.
// range: a selection range object
// index: current selection index

  var newNode = document.createElement("span");
  newNode.className = OC_CLASS;
  newNode.classList.add(OC_CLASS + '-' + String(index))
  try {
    range.surroundContents(newNode);
  } catch (error) {
    errorMessage(error, 'Error! Cannot highlight Selection...')
    return null
  }

  // dragElement.addItem(index)
  
  return null
}

var removeHighlight = (node) => {
// Removes highlight class wrappers from a node
// node: node to remove highlighted selections from

  while(node.firstChild) {
    const parent = node.parentNode
    parent.insertBefore(node.firstChild, node)
    parent.removeChild(node)
    parent.normalize()
  }
  return null
}

var isWrapped = (nodeList) => {
// Returns true if the selection has already been highlighted, else returns false
// nodeList: list of nodes to search for highlighted selections

  let newNodeList = [].slice.call(nodeList)
  for (let i = newNodeList.length - 1; i--;) {
    const classList = newNodeList[i].classList ? [].slice.call(newNodeList[i].classList): null
    if (classList && classList.includes(OC_CLASS)) return true
  }
  return false
}

export var wrapSelection = (index, attributes) => {
// Wraps all text nodes in a specified range with a highlight class.
// index: integer describing the current selection index
// return: true if highlightedSelection is valid
console.log(attributes)
  try {
    // var [at, ft, ai, fi, ao, fo, iai, ifi] = state.getAttributes(index);
    console.log(attributes)
    var [at, ft, ai, fi, ao, fo, iai, ifi] = attributes;
  } catch (error) {
    console.warn(error)
    return false
  }

  var anchorElements = document.querySelectorAll(at.toLowerCase());
  var focusElements = document.querySelectorAll(ft.toLowerCase());
  
  var range = document.createRange();
  // console.log(anchorElements[ai].childNodes, focusElements[fi].childNodes)
  if (!isWrapped(anchorElements[ai].childNodes) && !isWrapped(focusElements[fi].childNodes)) {
    if (anchorElements[ai].childNodes[iai] === focusElements[fi].childNodes[ifi]) {
      try {
        range.setStart(anchorElements[ai].childNodes[iai], ao)
        range.setEnd(focusElements[fi].childNodes[ifi], fo)
      } catch (error) {
        errorMessage(error, 'Error! Cannot wrap Selection')
        return false
      }
      wrapRange(range, index)
    } else {
      let textNodes = getTextNodesBetween(document.body, anchorElements[ai].childNodes[iai], focusElements[fi].childNodes[ifi]);
      try {
        range.setStart(anchorElements[ai].childNodes[iai], ao)
        range.setEndAfter(anchorElements[ai].childNodes[iai])
      } catch (error) {
        errorMessage(error, 'Error! Cannot wrap Selection')
        return false
      }
      wrapRange(range, index)
      if (textNodes.length > 0) {
        let count = 0
        for (let node of textNodes) {
          if (focusElements[fi].contains(node)) {
            count++
          }
          range.selectNodeContents(node)
          wrapRange(range, index)
        }
        try {
          range.setStartBefore(focusElements[fi].childNodes[ifi + count])
          range.setEnd(focusElements[fi].childNodes[ifi + count], fo)
        } catch (error) {
          errorMessage(error, 'Error! Cannot wrap Selection')
          return false
        }
        wrapRange(range, index)
      } else {
        try {
          range.setStartBefore(focusElements[fi].childNodes[ifi])
          range.setEnd(focusElements[fi].childNodes[ifi], fo)
        } catch (error) {
          errorMessage(error, 'Error! Cannot wrap Selection')
          return false
        }
        wrapRange(range, index)
      }

    }
  } else {
    console.log('its already wraped')
  }
  // case when called from getSelection
  // else if (select) {
  //   alert('Currently SmartLinks does not support mulitple selections within the same element')
  //   return false
  // }

  // state.colorHighlights()
  return true
}
  
export const getNodeListIndex = (nodeList, target) => {
// Returns the index of a target node in a nodelist, or -1 if the target node is not in the nodelist.

  let index = 0
  for (let node of nodeList) {
    if (node === target) return index
    else index++
  }
  return -1
}
  
export const getSelection = () => {
  var selection = window.getSelection()
  var anchorElement = selection.anchorNode.parentElement
  var anchorTag = anchorElement.tagName
  
  var focusElement = selection.focusNode.parentElement
  var focusTag = focusElement.tagName
  
  var anchorOffset = selection.anchorOffset
  var focusOffset = selection.focusOffset

  var anchorElements = document.querySelectorAll(anchorTag);
  var focusElements = document.querySelectorAll(focusTag);

  var innerAnchorIndex = getNodeListIndex(anchorElement.childNodes, selection.anchorNode)
  var innerFocusIndex = getNodeListIndex(focusElement.childNodes, selection.focusNode)

  const mask = selection.anchorNode.compareDocumentPosition(selection.focusNode)
  var anchorFirst = true;
  switch (mask) {
    case mask & 0:
      if (anchorOffset > focusOffset)
        anchorFirst = false
      break
    case mask & 1:
      console.error('the two nodes do not belong to the same document')
      break
    case mask & 2:
      anchorFirst = false
      break
    case mask & 4:
      break
    case mask & 8:
      anchorFirst = false
      break
    default:
  }

  for (var anchorElementIndex = 0; anchorElementIndex < anchorElements.length; anchorElementIndex++) {
    if (anchorElements[anchorElementIndex] === anchorElement)
      break
  }

  for (var focusElementIndex = 0; focusElementIndex < focusElements.length; focusElementIndex++) {
    if (focusElements[focusElementIndex] === focusElement)
      break
  }

  let temp = [focusTag, anchorTag, focusElementIndex, anchorElementIndex, focusOffset, anchorOffset, innerFocusIndex, innerAnchorIndex]
  if (anchorFirst) 
    temp = [anchorTag, focusTag, anchorElementIndex, focusElementIndex, anchorOffset, focusOffset, innerAnchorIndex, innerFocusIndex]
  
  if (!isWrapped(anchorElements[anchorElementIndex].childNodes) && !isWrapped(focusElements[focusElementIndex].childNodes)) 
      return temp
  
  return -1
}
