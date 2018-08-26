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

var isDefined = (value) => {
  if (typeof value !== 'undefined' || value === null || value === false) {
    return true
  }
  return false
}

var getSelectionIndex = () => {
  if (document.getElementById('surl-copy') ) {
    document.getElementById('surl-copy').value
  } else {
    let curlData = window.location.search
    const start = chunk.search('surldata=')
  }
}

var errorMessage = (error, alertMessage) => {
  console.error(error)
  if (alertMessage) {
    alert(alertMessage)
  }
}