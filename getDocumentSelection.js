var getDocumentSelection = () => {
  var selection = window.getSelection()
  var setup = false
  try {
    var uri = selection.anchorNode.baseURI
    
    var anchorElement = selection.anchorNode.parentElement
    var anchorTag = anchorElement.tagName

    var focusElement = selection.focusNode.parentElement
    var focusTag = focusElement.tagName

    var anchorOffset = selection.anchorOffset
    var focusOffset = selection.focusOffset

    var focusNodes = document.querySelectorAll(focusTag);
    var anchorNodes = document.querySelectorAll(anchorTag);
    setup = true
  }
  catch {
    console.warn('no selection made')
    setup
  }

  if (setup) {
    for (var anchorIndex = 0; anchorIndex < anchorNodes.length; anchorIndex++) {
      if (anchorNodes[anchorIndex] === anchorElement) {
        break
      }
    }

    for (var focusIndex = 0; focusIndex < focusNodes.length; focusIndex++) {
      if (focusNodes[focusIndex] === focusElement) {
        break
      }
    }
  
    var start = uri.search('surltag=')
    var end = uri.search('&surlfocus=')
    if (end !== -1) {
      end += 1
      for (end; end < uri.length; end++) {
        if (uri[end] === '&') {
          break
        }
      }
    }
    if (start !== -1) {
      uri = uri.replace(uri.slice(start, end), '')
    }
  
    var surl = uri
    if (surl.search(/\?/i) !== -1) {
      surl += '&'
    } else {
      surl += '?'
    }
    // same node
    surl += 'surlat=' + String(anchorTag) + '&surlft=' + String(focusTag) + '&surlai=' + String(anchorIndex) + '&surlfi=' + String(focusIndex) + '&surlao=' + anchorOffset + '&surlfo=' + focusOffset 
    console.log(surl)
  
    // copy surl to clipboard
    var copyUrl = document.createElement("textarea");
    copyUrl.value = surl;
    document.body.appendChild(copyUrl);
    copyUrl.select();
    document.execCommand('copy');
    document.body.removeChild(copyUrl);
  }
  

  return 
}

getDocumentSelection()

