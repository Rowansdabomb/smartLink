const surlClass = 'surlHighlight'
let highlightColor = 'yellow'

var isDefined = (value) => {
  if (typeof value !== 'undefined' || value === null || value === false) {
    return true
  }
  return false
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

var getHighlightColor = (initial, attributes) => {
  let color = ''
  chrome.storage.sync.get("highlightColor", function(color) {
    highlightColor = color.highlightColor
    if (initial) {
      goToLocation(attributes.map(a => {return a[index]}), false)
    }
    setColor(highlightColor)
  })
}

var setColor = (color) => {
  for (let selection of document.getElementsByClassName(surlClass)) {
    selection.style.backgroundColor = color
  }
}

var insertHighlight = (range, alreadyInserted) => {
  if (!alreadyInserted) {
    var newNode = document.createElement("div");
    newNode.className = surlClass;
    range.surroundContents(newNode);
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

var checkAlreadyInserted = (nodeList) => {
  let newNodeList = [].slice.call(nodeList)
  for (let i = newNodeList.length - 1; i--;) {
    if (newNodeList[i].className === surlClass) {
      return true
    }
  }
  return false
}

var highlightSelection = (attributes) => {
  var [at, ft, ai, fi, ao, fo, iai, ifi] = attributes;

  var anchorElements = document.querySelectorAll(at.toLowerCase());
  var focusElements = document.querySelectorAll(ft.toLowerCase());
  
  var range = document.createRange();
  const alreadyInserted = checkAlreadyInserted(anchorElements[ai].childNodes)

  if (!alreadyInserted) {
    if (anchorElements[ai].childNodes[iai] === focusElements[fi].childNodes[ifi]) {
      range.setStart(anchorElements[ai].childNodes[iai], ao)
      range.setEnd(focusElements[fi].childNodes[ifi], fo)
      insertHighlight(range)
    } else {
      let textNodes = getTextNodesBetween(document.body, anchorElements[ai].childNodes[iai], focusElements[fi].childNodes[ifi]);
    
      range.setStart(anchorElements[ai].childNodes[iai], ao)
      range.setEndAfter(anchorElements[ai].childNodes[iai])
      insertHighlight(range)
      if (textNodes.length > 0) {
        let count = 0
        for (let node of textNodes) {
          if (focusElements[fi].contains(node)) {
            count++
          }
          range.selectNodeContents(node)
          insertHighlight(range)
        }
    
        range.setStartBefore(focusElements[fi].childNodes[ifi + count])
        range.setEnd(focusElements[fi].childNodes[ifi + count], fo)
        insertHighlight(range)
      }
    }
  }

  setColor(highlightColor)
}