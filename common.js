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

var getHighlightColor = (initial) => {
  let color = ''
  chrome.storage.sync.get("highlightColor", function(color) {
    state.highlightColor = color.highlightColor
    if (initial) {
      goToLocation(false, 0)
    }
    state.colorHighlights()
  })
}

/*
 * Wraps range with highlight highlight class. Creates a draggable list of selections if one DNE.
 * range: a selection range object
 * index: current selection index
 */
var insertHighlight = (range, index) => {
  var newNode = document.createElement("div");
  newNode.className = surlClass;
  newNode.classList.add(surlClass + '-' + String(index))
  try {
    range.surroundContents(newNode);
  } catch (error) {
    errorMessage(error, 'Error! Cannot highlight Selection...')
    return null
  }
  // if (document.getElementById("surl-d-container") === null) {
  //   // dragElement.create()
  // } else {
    dragElement.addItem(index)
  // }
  return
}

/*
 * Removes highlight class wrappers from a node
 * node: node to remove highlighted selections from
 */
var removeHighlight = (node) => {
  while(node.firstChild) {
    const parent = node.parentNode
    parent.insertBefore(node.firstChild, node)
    parent.removeChild(node)
    parent.normalize()
  }
  return null
}

/*
 * Returns true if the selection has already been highlighted, else returns false
 * nodeList: list of nodes to search for highlighted selections
 */
var isHighlighted = (nodeList) => {
  let newNodeList = [].slice.call(nodeList)
  for (let i = newNodeList.length - 1; i--;) {
    const classList = newNodeList[i].classList ? [].slice.call(newNodeList[i].classList): null
    if (classList && classList.includes(surlClass)) return true
  }
  return false
}

/*
 * Wraps all text nodes in a specified range with a highlight class.
 * index: integer describing the current selection index
 */
var highlightSelection = (index) => {
  try {
    dragElement.getIndexFromOrder(index)
    var [at, ft, ai, fi, ao, fo, iai, ifi] = state.getAttributes(index);
  } catch (error) {
    console.warn(error)
    return false
  }

  var anchorElements = document.querySelectorAll(at.toLowerCase());
  var focusElements = document.querySelectorAll(ft.toLowerCase());
  
  var range = document.createRange();
  if (!isHighlighted(anchorElements[ai].childNodes)) {
    if (anchorElements[ai].childNodes[iai] === focusElements[fi].childNodes[ifi]) {
      try {
        range.setStart(anchorElements[ai].childNodes[iai], ao)
        range.setEnd(focusElements[fi].childNodes[ifi], fo)
      } catch (error) {
        errorMessage(error, 'Error! Cannot highlight Selection')
        return
      }
      insertHighlight(range, index)
    } else {
      let textNodes = getTextNodesBetween(document.body, anchorElements[ai].childNodes[iai], focusElements[fi].childNodes[ifi]);
      try {
        range.setStart(anchorElements[ai].childNodes[iai], ao)
        range.setEndAfter(anchorElements[ai].childNodes[iai])
      } catch (error) {
        errorMessage(error, 'Error! Cannot highlight Selection')
        return
      }
      insertHighlight(range, index)
      if (textNodes.length > 0) {
        let count = 0
        for (let node of textNodes) {
          if (focusElements[fi].contains(node)) {
            count++
          }
          range.selectNodeContents(node)
          insertHighlight(range, index)
        }
        try {
          range.setStartBefore(focusElements[fi].childNodes[ifi + count])
          range.setEnd(focusElements[fi].childNodes[ifi + count], fo)
        } catch (error) {
          errorMessage(error, 'Error! Cannot highlight Selection')
          return
        }
        insertHighlight(range, index)
      } else {
        try {
          range.setStartBefore(focusElements[fi].childNodes[ifi])
          range.setEnd(focusElements[fi].childNodes[ifi], fo)
        } catch (error) {
          errorMessage(error, 'Error! Cannot highlight Selection')
          return
        }
        insertHighlight(range, index)
      }

    }
  } 
  // case when called from getDocumentSelection
  // else if (select) {
  //   alert('Currently SmartLinks does not support mulitple selections within the same element')
  //   return false
  // }

  state.colorHighlights()
  return true
}