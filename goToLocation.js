/*
 * Returns element offset.
 */
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
 * smoothScroll: boolean, should scroll behabiour be smooth
 * index: 
 */
var goToLocation = (smoothScroll, index) => {
  var scrollBehaviour = smoothScroll ? 'smooth': 'auto'
  var [at, ft, ai, fi, ao, fo, iai, ifi] = state.getAttributes(index);
  
  var anchorElements = document.querySelectorAll(at.toLowerCase());
  var focusElements = document.querySelectorAll(ft.toLowerCase());

  highlightSelection(index)
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