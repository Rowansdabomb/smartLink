document.addEventListener('click', (event) => {
  const query1 = '.surl-d-li>span'
  const query2 = '.surl-d-delete-icon'

  if (event.target.matches(query1)) {
    // Don't follow the link
    event.preventDefault()
    let list = document.querySelectorAll(query1)
    main(Number(event.target.parentElement.style.order))
  } else if (event.target.matches(query2)) {
    // Don't follow the link
    event.preventDefault()
    let list = document.querySelectorAll(query2)

    for (let index = 0; index < list.length; index++) {
      if (list[index] === event.target) {
        const remove = 'surl-highlight-'.concat(String(event.target.parentElement.style.order))
        for (let i = document.getElementsByClassName(remove).length - 1; i > -1; i--) {
          removeHighlight(document.getElementsByClassName(remove)[i])
        }
        state.removeAttributes(index)
        dragElement.removeItem(index, event.target)
        createCurl()
      }
    }
  } else {
    return
  }
}, false);

/*
 * Called on Page load. Unpacks attribute data from url. Updates state attributes
 */
const initData = () => {
  const queryParams = new URLSearchParams(window.location.search)
  const data = queryParams.get('surldata')

  if (data === null) return false

  const result = data.split('.').map((element, index) => {
    if (index > 1) return element.split('_').map((element) => {return Number(element)})
    else return element.split('_').map((element) => {return element})
  }); 

  console.log(result)
  state.appendAttributes(result)

  for (let i = 1; i < state.attributes[0].length; i++) {
    dragElement.addItem(i)
  }
}

/*
 * Called on Page load. Main function to handle everything
 */
const main = (index) => {

  try {
    var currAttr = state.getAttributes(index)
    console.log(currAttr)
  
    if (currAttr && state.highlightColor === null) {
      getHighlightColor(true)
    }
  
    var setup = true
  } catch (error) {
    console.warn('Could not go to location: ', error)
    setup = false
  }
  
  if (setup) {
    if (currAttr) {
      goToLocation(true, index)
    }

    chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
      var hMod = request.hMod || null;
      var hColor = request.highlightColor || null;
      const totalSelections = currAttr.length
      if (hColor) {
        sendResponse(JSON.stringify({hColor: {success: true}}));
  
        getHighlightColor(false)
      }
      if (hMod) {
        index = index + hMod;
        if (index < 0) {
          index = totalSelections - 1
        } else if (index >= totalSelections) {
          index = 0
        }
        sendResponse(JSON.stringify({hMod: {index: index + 1, totalAnchors: totalSelections, success: true}}));
        goToLocation(true, index)
      }
      else {
        sendResponse(JSON.stringify({hMod: {index: null, totalAnchors: 0, success: false}}));
      } 
    })
  }
  return
}

initData()
main(0)