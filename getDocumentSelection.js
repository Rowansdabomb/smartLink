var initialize = true

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

var createSurl = (attributes) => {
  var copyUrl = document.getElementById("surl-copy");
  try {
    var url = copyUrl.value.split('?')
    url = '?' + url[1]
  } catch {
    url = window.location.search
    copyUrl = document.createElement("textarea");
    copyUrl.classList.add('copy-surl')
    copyUrl.id = 'surl-copy';
    document.body.appendChild(copyUrl);
  }
  url = arrayRemove(url.split('&'), '')
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
    } else if (index !== 0) {
      chunk = '&'.concat(chunk)
    }
    if (index === 0) {
      chunk = chunk.replace('&', '?')
    }
    url[index] = chunk
    index++
  }
  if (!modified) {
    if (url.length > 0) {
      url.push('&surldata='.concat(attributes.join('.')))
    } else {
      url.push('?surldata='.concat(attributes.join('.')))
    }
  }
  url.unshift(window.location.origin + window.location.pathname)
  url = url.join('')

  copyUrl.value = url;
  console.log(copyUrl.value)
  copyUrl.select();
  document.execCommand('copy');
  totalSelections++
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

    if (anchorFirst) {
      attributes = [anchorTag, focusTag, anchorElementIndex, focusElementIndex, anchorOffset, focusOffset, innerAnchorIndex, innerFocusIndex]
    } else {
      attributes = [focusTag, anchorTag, focusElementIndex, anchorElementIndex, focusOffset, anchorOffset, innerFocusIndex, innerAnchorIndex]
    }

    if (highlightSelection(attributes, true)) {
      createSurl(attributes)
    }

    // console.log(document.getElementById("surl-d-container"))
    // if (document.getElementById("surl-d-container") === null) {
    //   createDraggable()
    // } 

  }
  return 
}

if (highlightColor === null) {
  getHighlightColor(false)
}

getDocumentSelection()