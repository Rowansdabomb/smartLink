/*
 * Creates the curl link and copies it to the clipboard. 
 * Returns null
 */
var createCurl = () => {
  if (document.getElementById('surl-copy') === null) {
    copyUrl = document.createElement("textarea");
    copyUrl.classList.add('copy-surl')
    copyUrl.id = 'surl-copy';
    document.body.appendChild(copyUrl);
  }
  if (state.attributes[0].length > 0) {
    copyUrl.style.visibility = 'visibile'
    let query = Object.keys(state.attributes).map((key, index) => {
      return state.attributes[index].join('_')
    }).join('.')
  
    let url = new URLSearchParams(window.location.search)
    url.delete('surldata')
    url.append('surldata', query)
    copyUrl.value = window.location.origin + window.location.pathname + '?' + url.toString();
    
    copyUrl.select();
    document.execCommand('copy');
    copyUrl.style.visibility = 'hidden'
    console.log(copyUrl.value)
  }
  return null
}

/*
 * Returns the index of a target node in a nodelist, or -1 if the target node is not in the nodelist.
 */
var getNodeListIndex = (nodeList, target) => {
  let index = 0
  for (let node of nodeList) {
    if (node === target) return index
    else index++
  }
  return -1
}

var getDocumentSelection = () => {
  var selection = window.getSelection()
  var setup = false
  try {
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

    setup = true
  } catch (error) {
    console.warn(error)
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

    let temp = []
    if (anchorFirst) {
      temp = [anchorTag, focusTag, anchorElementIndex, focusElementIndex, anchorOffset, focusOffset, innerAnchorIndex, innerFocusIndex]
    } else {
      temp = [focusTag, anchorTag, focusElementIndex, anchorElementIndex, focusOffset, anchorOffset, innerFocusIndex, innerAnchorIndex]
    }
    try {
      state.appendAttributes(temp)
    } catch (error) {
      console.error(error)
    }

    if (highlightSelection(state.attributes[0].length - 1)) {
      createCurl()
    }
  }
  return 
}
