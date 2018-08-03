var strSplice = (str, index, add) => {
  if (index < 0) {
    index = str.length + index;
    if (index < 0) {
      index = 0;
    }
  }

  return str.slice(0, index) + add + str.slice(index);
}

var insertHighlight = (range) => {
  var newNode = document.createElement("div");
  newNode.className = 'surlHighlight';
  range.surroundContents(newNode);
  return null
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

var createSurl = (attributes) => {
  var copyUrl = document.getElementById("surlCopy");
  try {
    var url = copyUrl.value.split('?')
    url = '?' + url[1]
  } catch {
    url = window.location.search
    copyUrl = document.createElement("textarea");
    copyUrl.classList.add('copysurl')
    copyUrl.id = 'surlCopy';
    document.body.appendChild(copyUrl);
  }
  url = url.split('&')
  console.log(url)
  let index = 0
  let modified = false
  for (let chunk of url) {
    const start = chunk.search('surldata=')
    if (start >= 0) {
      if (chunk.includes('?')) {
        chunk = chunk.slice('?surldata='.length).split('.')
      } else {
        chunk = chunk.slice('surldata='.length).split('.')
      }
      
      let count = 0;
      for (let i = 0; i < chunk.length; i++) {
        chunk[i] += '_' + String(attributes[count])
        count++
      }
      chunk = chunk.join('.')
      chunk = '&surldata='.concat(chunk)
      modified = true
    } 
    if (index === 0) {
      chunk = chunk.replace('&', '?')
      console.log(index, chunk[0])
    }
    url[index] = chunk
    index++
  }
  if (!modified) {
    if (url.length > 1) {
      url.push('&surldata='.concat(attributes.join('.')))
    } else {
      url.push('?surldata='.concat(attributes.join('.')))
    }
    
  }
  
  url.unshift(window.location.origin + window.location.pathname)
  url =  url.join('')

  copyUrl.value = url;
  copyUrl.select();
  document.execCommand('copy');
  // copyUrl.parentNode.removeChild(copyUrl)
}

var highlightSelection = (attributes) => {
  var [at, ft, ai, fi, ao, fo, iai, ifi] = attributes;

  var anchorElements = document.querySelectorAll(at.toLowerCase());
  var focusElements = document.querySelectorAll(ft.toLowerCase());
  var range = document.createRange();

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

var getDocumentSelection = () => {
  var selection = window.getSelection()
  var setup = false
  try {
    var anchorElement = selection.anchorNode.parentElement
    var anchorTag = anchorElement.tagName
    var innerAnchorIndex = 0
    for (let node of anchorElement.childNodes) {
      if (node === selection.anchorNode) {
        break
      }
      innerAnchorIndex++
    }

    var focusElement = selection.focusNode.parentElement
    var focusTag = focusElement.tagName
    var innerFocusIndex = 0
    for (let node of focusElement.childNodes) {
      if (node === selection.focusNode) {
        break
      }
      innerFocusIndex++
    }

    var anchorOffset = selection.anchorOffset
    var focusOffset = selection.focusOffset

    var anchorElements = document.querySelectorAll(anchorTag);
    var focusElements = document.querySelectorAll(focusTag);

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
    setup = true
  } catch (error) {
    console.warn('Document selection could not be completed: ', error)
    setup = false
  }

  if (setup) {
    for (var anchorElementIndex = 0; anchorElementIndex < anchorElements.length; anchorElementIndex++) {
      if (anchorElements[anchorElementIndex] === anchorElement) {
        break
      }
    }

    for (var focusElementIndex = 0; focusElementIndex < focusElements.length; focusElementIndex++) {
      if (focusElements[focusElementIndex] === focusElement) {
        break
      }
    }
    if (anchorFirst) {
      attributes = [anchorTag, focusTag, anchorElementIndex, focusElementIndex, anchorOffset, focusOffset, innerAnchorIndex, innerFocusIndex]
    } else {
      attributes = [focusTag, anchorTag, focusElementIndex, anchorElementIndex, focusOffset, anchorOffset, innerFocusIndex, innerAnchorIndex]
    }
    highlightSelection(attributes)

    createSurl(attributes)
  }

  return 
}

getDocumentSelection()