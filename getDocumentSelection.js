var strSplice = (str, index, add) => {
  if (index < 0) {
    index = str.length + index;
    if (index < 0) {
      index = 0;
    }
  }
  return str.slice(0, index) + add + str.slice(index);
}

var arrayRemove = (array, value) => {
  return array.filter(function(element){
    return element != value;
  });
}

var createSurl = () => {
  if (document.getElementById('surl-copy') === null) {
    copyUrl = document.createElement("textarea");
    copyUrl.classList.add('copy-surl')
    copyUrl.id = 'surl-copy';
    document.body.appendChild(copyUrl);
  }

  let query = Object.keys(state.attributes).reduce((carry, key, index) => {
    return carry += '.'.concat(state.attributes[index].join('_'))
  }, state.attributes[index].join('_'))
  console.log(query)

  let url = new URLSearchParams(window.location.search)
  url.delete('surldata')
  url.append('surldata', query)
  copyUrl.value = window.location.origin + window.location.pathname + '?' + url.toString();
  console.log(copyUrl.value)
  copyUrl.select();
  document.execCommand('copy');
}

getInnerIndex = (nodeList, target) => {
  let index = 0
  for (let node of nodeList) {
    if (node === target) {
      break
    }
    index++
  }

  return index
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

    var innerAnchorIndex = getInnerIndex(anchorElement.childNodes, selection.anchorNode)
    var innerFocusIndex = getInnerIndex(focusElement.childNodes, selection.focusNode)

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

    let attributes = []
    if (anchorFirst) {
      attributes = [anchorTag, focusTag, anchorElementIndex, focusElementIndex, anchorOffset, focusOffset, innerAnchorIndex, innerFocusIndex]
    } else {
      attributes = [focusTag, anchorTag, focusElementIndex, anchorElementIndex, focusOffset, anchorOffset, innerFocusIndex, innerAnchorIndex]
    }
    state.appendAttributes(attributes)
    console.log(state.attributes)

    if (highlightSelection(attributes, true)) {
      createSurl(attributes)
    }
  }
  return 
}

if (state.highlightColor === null) {
  getHighlightColor(false)
}

getDocumentSelection()