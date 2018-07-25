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
  var start = url.search('surlat=')
  var end = url.search('&surlfo=')
  if (end !== -1) {
    end += 1
    for (end; end < url.length; end++) {
      if (url[end] === '&') {
        break
      }
    }
  }
  if (start !== -1) {
    let count = 0;
    for (let i = start; i <= end; i++) {
      if (url[i] === '&' || typeof url[i] === 'undefined') {
        url = strSplice(url, i, '_' + String(attributes[count]) )
        i += 1 + String(attributes[count]).length
        end += 1 + String(attributes[count]).length
        count++
      }
    }
  }

  var surl = url
  if (surl.lastIndexOf('?') !== surl.length - 1 && surl.lastIndexOf('?') !== -1) {
    surl += '&'
  } else if (surl.lastIndexOf('?') === -1) {
    surl += '?'
  }
  surl += 'surldata=' + attributes.join('.')
  // console.log(surldat)
  // surl += 'surlat=' + String(attributes[0]) + '&surlft=' + String(attributes[1]) + '&surlai=' + String(attributes[2]) + '&surlfi=' + String(attributes[3]) + '&surlao=' + attributes[4] + '&surlfo=' + attributes[5] + '&surliai=' + attributes[6] + '&surlifi=' + attributes[7]

  // copy surl to clipboard
  copyUrl.value = surl;
  copyUrl.select();
  document.execCommand('copy');
}

document.commonParent = function(a, b) {
  if (a === b) {
    return a.parentNode
  } else {
    var pa = [], L;
    while (a) {
      pa[pa.length] = a;
      a = a.parentNode;
    }
    L = pa.length;
    while (b) {  
      for (var i = 0; i < L; i++) {
        if (pa[i] == b) return b
      }
      b = b.parentNode;
    }
  }
}

var getDocumentSelection = () => {
  var selection = window.getSelection()
  // console.log(selection.anchorNode, selection.focusNode, selection.toString())
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
    // console.warn('no selection made')
    setup = false
  }

  if (setup) {

    // var commonParent = document.commonParent(selection.focusNode, selection.anchorNode)
    // for (let i = 0; i < commonParent.childNodes.length; i++) {
    //   if (commonParent.childNodes[i] === selection.focusNode) {
    //     innerFocusIndex = i
    //   }
    //   if (commonParent.childNodes[i] === selection.anchorNode) {
    //     innerAnchorIndex = i
    //   }
    // }
    // console.log(commonParent, innerAnchorIndex, innerFocusIndex)
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

    // const parentTag = commonParent.tagName
    // const parentIndex = document.querySelectorAll(parentTag)
    
    // let attributes = [parentTag, parentIndex, anchorOffset, focusOffset, innerAnchorIndex, innerFocusIndex]
    
    let attributes = [anchorTag, focusTag, anchorElementIndex, focusElementIndex, anchorOffset, focusOffset, innerAnchorIndex, innerFocusIndex]

    // let attributes = [anchorTag, focusTag, anchorElementIndex, focusElementIndex, anchorOffset, focusOffset]
    console.log(attributes)

    createSurl(attributes)
  }

  return 
}

getDocumentSelection()

