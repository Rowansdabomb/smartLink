var strSplice = (str, index, add) => {
  if (index < 0) {
    index = str.length + index;
    if (index < 0) {
      index = 0;
    }
  }

  return str.slice(0, index) + add + str.slice(index);
}

var createSurl = (attributes) => {
  var copyUrl = document.getElementById("surlCopy");
  try {
    var url = copyUrl.value
  } catch {
    url = window.location.href
    copyUrl = document.createElement("textarea");
    copyUrl.id = 'surlCopy';
    document.body.appendChild(copyUrl);
  }
  url = url.split('&')
  let index = 0
  let modified = false
  for (let chunk of url) {
    
    const start = chunk.search('surldata=')
    if (start >= 0) {
      chunk = chunk.slice('surldata='.length).split('.')
      let count = 0;
      for (let i = 0; i < chunk.length; i++) {
        chunk[i] += '_' + String(attributes[count])
        count++
      }
      chunk = chunk.join('.')
      chunk = 'surldata='.concat(chunk)
      modified = true
    } 

    url[index] = chunk
    index++
    console.log(chunk)
  }
  if (!modified) {
    url.push('surldata='.concat(attributes.join('.')))
  }
  url = (url[0].lastIndexOf('?') === -1 ? url.join('?') : url.join('&'))

  // copy surl to clipboard
  copyUrl.value = url;
  copyUrl.select();
  document.execCommand('copy');
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

    setup = true
  }
  catch {
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
    
    let attributes = [anchorTag, focusTag, anchorElementIndex, focusElementIndex, anchorOffset, focusOffset, innerAnchorIndex, innerFocusIndex]

    createSurl(attributes)
  }

  return 
}

getDocumentSelection()