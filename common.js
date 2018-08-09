const surlClass = 'surl-highlight'
let highlightColor = null
var totalSelections = 0
var globalIndex = 0

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
    index = totalSelections
  }
  if (!checkAlreadyInserted(anchorElements[ai].childNodes)) {
    if (anchorElements[ai].childNodes[iai] === focusElements[fi].childNodes[ifi]) {
      try {
        range.setStart(anchorElements[ai].childNodes[iai], ao)
        range.setEnd(focusElements[fi].childNodes[ifi], fo)
      } catch (error) {
        alert('Error! Cannot highlight Selection')
        console.error(error)
        return null
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
        return null
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
          return null
        }
        insertHighlight(range, index)
      } else {
        try {
          range.setStartBefore(focusElements[fi].childNodes[ifi])
          range.setEnd(focusElements[fi].childNodes[ifi], fo)
        } catch (error) {
          alert('Error! Cannot highlight Selection')
          console.error(error)
          return null
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

const createDraggable = (selection) => {
  chrome.storage.sync.get(['curlDragTop','curlDragLeft'], function(data) {
    let container = document.createElement('div')
    container.id = 'surl-d-container'
    container.style.top = 0
    container.style.left = 0

    if (data) {
      container.style.top = data.curlDragTop ? data.curlDragTop: 0
      container.style.left = data.curlDragLeft? data.curlDragLeft: 0
    }
  
    let title = document.createElement('span')
    title.id = 'surl-d-title'
    title.innerText = 'Curl Selections'
    container.appendChild(title)
  
    let list = document.createElement('ol')
    list.id = 'surl-d-ol'
    container.appendChild(list)
  
    document.body.appendChild(container)
  
    dragElement(document.getElementById("surl-d-container"));
    updateDraggable(selection)
  })
}

const updateDraggable = (selection) => {
  let list = document.getElementById('surl-d-ol')
  let listItem = document.createElement('li')
  listItem.classList.add('surl-d-li')
  listItem.innerText = selection
  list.appendChild(listItem)
  return null
}

function dragElement(element) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(element.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(element.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    element.onmousedown = dragMouseDown;
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
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;

    const element = document.getElementById('surl-d-container')
    chrome.storage.sync.set({
      'curlDragTop': element.style.top,
      'curlDragLeft': element.style.left,
    })
  }
}

document.addEventListener('click', (event) => {
	// If the clicked element doesn't have the right selector, bail
  if (!event.target.matches('#surl-d-ol>li')) return

  // Don't follow the link
	event.preventDefault()

	// Log the clicked element in the console
  console.log(event.target)
  let list = document.querySelectorAll('#surl-d-ol>li')
  for (let index = 0; index < list.length; index++) {
    if (list[index] === event.target) {
      console.log(index)
      mainGTL(index)
    }
  }
  
  // if (targetSelection.getElementsByClassName('surl-delete-button').length < 1) {
  //   let deleteButton = document.createElement('span')
  //   deleteButton.classList.add('surl-delete-button')
  //   deleteButton.innerText = 'Remove'
  //   deleteButton.offsetTop = targetSelection.offsetTop
  //   deleteButton.offsetLeft = targetSelection.offsetLeft
  //   deleteButton.addEventListener('click', (event) => {
  //     targetSelection.removeChild(deleteButton)
  //     let targetClass = 'surl-highlight-0'
  //     targetSelection.classList.forEach((nodeClass, index) => {
  //       console.log(nodeClass)
  //       const minLength = 'surl-highlight-'.length
  //       if (nodeClass.length > minLength) {
  //         targetClass = nodeClass
  //       }
  //     })
  //     console.log(document.getElementsByClassName(targetClass))
  //     for (let i = document.getElementsByClassName(targetClass).length - 1; i > 0; i--) {
  //       removeHighlight(document.getElementsByClassName(targetClass)[i])
  //     }
  //   })
  //   event.target.appendChild(deleteButton)
  // }


}, false);