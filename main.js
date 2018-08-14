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
        document.getElementById('surl-d-ol').removeChild(event.target.parentElement)
      }
    }
  } else {
    return
  }
}, false);

const main = (index) => {
  try {
    // attributes = getData('surldata')
    attributes = state.getAttributes(index)
    console.log(attributes)
  
    if (attributes && highlightColor === null) {
      getHighlightColor(true, attributes)
    }
  
    setup = true
  } catch (error) {
    console.warn('Could not go to location: ', error)
    setup = false
  }
  if (setup) {
    if (attributes) {
      console.log(attributes)
      goToLocation(attributes.map(a => {return a[index]}), true, index )
    }

    chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
      var hMod = request.hMod || null;
      var hColor = request.highlightColor || null;
  
      if (hColor) {
        sendResponse(JSON.stringify({hColor: {success: true}}));
  
        getHighlightColor(false)
      }
      if (hMod) {
        index = index + hMod;
        if (index < 0) {
          index = attributes[0].length - 1
        } else if (index >= attributes[0].length) {
          index = 0
        }
        sendResponse(JSON.stringify({hMod: {index: index + 1, totalAnchors: attributes[0].length, success: true}}));
        goToLocation(attributes.map(a => {return a[index]}), true)
      }
      else {
        sendResponse(JSON.stringify({hMod: {index: null, totalAnchors: 0, success: false}}));
      } 
    })
  }
  return
}

let index = 0;
let attributes = []
let setup  = false

initData ()
main ()