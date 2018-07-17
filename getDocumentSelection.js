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
    // url = url.replace(url.slice(start, end), '')

    console.log('add next selection')
    let count = 0;
    for (let i = start; i <= end; i++) {
      console.log(url[i], i)
      if (url[i] === '&' || typeof url[i] === 'undefined') {

        console.log(attributes[count])
        url = strSplice(url, i, ',' + String(attributes[count]) )
        console.log(url)
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

  surl += 'surlat=' + String(attributes[0]) + '&surlft=' + String(attributes[1]) + '&surlai=' + String(attributes[2]) + '&surlfi=' + String(attributes[3]) + '&surlao=' + attributes[4] + '&surlfo=' + attributes[5] 

  // copy surl to clipboard
  copyUrl.value = surl;
  copyUrl.select();
  document.execCommand('copy');
  // document.body.removeChild(copyUrl);
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

    var anchorNodes = document.querySelectorAll(anchorTag);
    var focusNodes = document.querySelectorAll(focusTag);

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
    
    let attributes = [anchorTag, focusTag, anchorIndex, focusIndex, anchorOffset, focusOffset]

    createSurl(attributes)
  }

  return 
}

getDocumentSelection()

