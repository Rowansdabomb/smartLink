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

var highlightSelection = (attributes, select) => {
  var [at, ft, ai, fi, ao, fo, iai, ifi] = attributes;

  var anchorElements = document.querySelectorAll(at.toLowerCase());
  var focusElements = document.querySelectorAll(ft.toLowerCase());
  
  var range = document.createRange();
  const alreadyInserted = checkAlreadyInserted(anchorElements[ai].childNodes)

  if (!alreadyInserted) {
    if (anchorElements[ai].childNodes[iai] === focusElements[fi].childNodes[ifi]) {
      console.log('nodes are same')
      range.setStart(anchorElements[ai].childNodes[iai], ao)
      range.setEnd(focusElements[fi].childNodes[ifi], fo)
      insertHighlight(range)
    } else {
      console.log('nodes are different')
      let textNodes = getTextNodesBetween(document.body, anchorElements[ai].childNodes[iai], focusElements[fi].childNodes[ifi]);
      console.log(textNodes)
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
      } else {
        range.setStartBefore(focusElements[fi].childNodes[ifi])
        range.setEnd(focusElements[fi].childNodes[ifi], fo)
        insertHighlight(range)
      }

    }
  } else if (select) {
    alert('Currently SmartLinks does not support mulitple selections within the same element')
    return false
  }

  setColor(highlightColor)
  return true
}

const createDraggable = () => {
  let container = document.createElement('div')
  container.id = 'surl-d-container'

  let title = document.createElement('span')
  title.id = 'surl-d-title'
  title.innerText = 'SmartLink Selections'
  container.appendChild(title)

  let list = document.createElement('ol')
  list.classList.add('surl-d-ol')
  container.appendChild(list)

  document.body.appendChild(container)
  dragElement(document.getElementById("surl-d-container"));
  return
}

const updateDraggable = (selections) => {
  let list = document.getElementsByClassName('surl-d-ol')
  for(let selection of selections) {
    let listItem = document.createElement('li')
    listItem.classList.add('surl-d-li')
    listItem.innerText = selection
    list.appendChild(listItem)
  }
}


function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}