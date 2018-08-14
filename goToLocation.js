/*
 * Unpacks varibales from the url
 */

var initData = () => {
  const queryParams = new URLSearchParams(window.location.search)
  const data = queryParams.get('surldata')
  console.log(data.split('.'))

  if (data === null) return false

  const result = data.split('.').map((element, index) => {
    if (index > 1) return element.split('_').map((element) => {return Number(element)})
    else return element.split('_').map((element) => {return element})
  }); 

  state.appendAttributes(result)
}

// var getData = (variable) => {
//   const queryParams = new URLSearchParams(window.location.search)
//   const data = queryParams.get('surldata')
//   console.log(data.split('.'))

//   if (data === null) return false

//   let temp = data.split('.').map((element, index) => {
//     console.log(element, index)
//     if (index > 1) return element.split('_').map((element) => {return Number(element)})
//     else return element.split('_').map((element) => {return element})
//   }); 

//   console.log(temp)
//   return temp
// }

var absoluteOffset = function(element) {
  var top = 0, left = 0;
  do {
      top += element.offsetTop  || 0;
      left += element.offsetLeft || 0;
      element = element.offsetParent;
  } while(element);

  return {
      top: top,
      left: left
  };
};

/*
 * Gets Dom element, wraps it with css, and scrolls to it
 */
var goToLocation = (attributes, smoothScroll, index) => {
  var scrollBehaviour = smoothScroll ? 'smooth': 'auto'
  var [at, ft, ai, fi, ao, fo, iai, ifi] = attributes;
  
  var anchorElements = document.querySelectorAll(at.toLowerCase());
  var focusElements = document.querySelectorAll(ft.toLowerCase());

  highlightSelection(attributes, false, index)
  let offset = absoluteOffset(anchorElements[ai])

  // get scrollable element
  var parent = anchorElements[ai].parentElement
  while (parent !== null) {
    var overflowY = window.getComputedStyle(parent, null).overflowY
    if (overflowY === 'auto' || overflowY === 'scroll') {
      parent.scroll({
        top: offset.top - 200,
        behavior: scrollBehaviour
      })
    } 
    parent = parent.parentElement
  } 
}