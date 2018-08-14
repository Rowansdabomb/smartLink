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
      goToLocation(attributes.map(a => {return a[index]}), false, 0)
    }
    setColor(highlightColor)
  })
}

var setColor = (color) => {
  for (let selection of document.getElementsByClassName(surlClass)) {
    selection.style.backgroundColor = color
  }
}

var getSelectionIndex = () => {
  if (document.getElementById('surl-copy') ) {
    document.getElementById('surl-copy').value
  } else {
    let curlData = window.location.search
    const start = chunk.search('surldata=')
  }
}

var insertHighlight = (range, index) => {
  var newNode = document.createElement("div");
  newNode.className = surlClass;
  newNode.classList.add(surlClass + '-' + String(index))
  try {
    range.surroundContents(newNode);
  } catch (error) {
    alert('Error! Cannot highlight Selection...')
    console.error(error)
    return null
  }
  if (document.getElementById("surl-d-container") === null) {
    dragElement.create()
  } else {
    dragElement.append(index)
  }
  return
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
    const classList = newNodeList[i].classList ? [].slice.call(newNodeList[i].classList): null
    if (classList && classList.includes(surlClass)) {
      return true
    }
  }
  return false
}

var highlightSelection = (attributes, select, index) => {
  try {
    var [at, ft, ai, fi, ao, fo, iai, ifi] = attributes;
  } catch (error) {
    console.warn(error)
    return false
  }

  var anchorElements = document.querySelectorAll(at.toLowerCase());
  var focusElements = document.querySelectorAll(ft.toLowerCase());
  
  var range = document.createRange();
  if (select) {
    index = state.attributes[0].length - 1
  }
  if (!checkAlreadyInserted(anchorElements[ai].childNodes)) {
    if (anchorElements[ai].childNodes[iai] === focusElements[fi].childNodes[ifi]) {
      try {
        range.setStart(anchorElements[ai].childNodes[iai], ao)
        range.setEnd(focusElements[fi].childNodes[ifi], fo)
      } catch (error) {
        alert('Error! Cannot highlight Selection')
        console.error(error)
        return
      }
      insertHighlight(range, index)
    } else {
      let textNodes = getTextNodesBetween(document.body, anchorElements[ai].childNodes[iai], focusElements[fi].childNodes[ifi]);
      try {
        range.setStart(anchorElements[ai].childNodes[iai], ao)
        range.setEndAfter(anchorElements[ai].childNodes[iai])
      } catch (error) {
        alert('Error! Cannot highlight Selection')
        console.error(error)
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
          alert('Error! Cannot highlight Selection')
          console.error(error)
          console.log(focusElements[fi].childNodes[ifi + count])
          return
        }
        insertHighlight(range, index)
      } else {
        try {
          range.setStartBefore(focusElements[fi].childNodes[ifi])
          range.setEnd(focusElements[fi].childNodes[ifi], fo)
        } catch (error) {
          alert('Error! Cannot highlight Selection')
          console.error(error)
          return
        }
        insertHighlight(range, index)
      }

    }
  } else if (select) {
    alert('Currently SmartLinks does not support mulitple selections within the same element')
    return false
  }

  setColor(highlightColor)
  return true
}

