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

var errorMessage = (error, alertMessage) => {
  console.error(error)
  if (alertMessage) {
    alert(alertMessage)
  }
}