var dragElement = {
  pos1: 0,
  pos2: 0,
  pos3: 0,
  pos4: 0,
  append: function (index) {
    for (let node of document.getElementById('surl-d-ol').children) {
      if (Number(node.style.order) === index) return
    }
    let selection = document.getElementsByClassName(surlClass+'-' + String(index))
    selection = selection[0].innerText
    let list = document.getElementById('surl-d-ol')
    let listItem = document.createElement('div')
    listItem.classList.add('surl-d-li')
    listItem.style.order = index
  
    let listItemText = document.createElement('span')
    listItemText.innerText = selection
    listItem.appendChild(listItemText)
  
    let deleteIcon = document.createElement('div')
    deleteIcon.className = 'surl-d-delete-icon'
    listItem.appendChild(deleteIcon)
  
    list.appendChild(listItem)
    return null
  },
  remove: function (index) {

  },
  create: function () {
    chrome.storage.sync.get(['curlDragTop','curlDragLeft'], (data) => {
      let container = document.createElement('div')
      container.id = 'surl-d-container'
      container.style.top = 0
      container.style.left = 0
  
      if (data) {
        container.style.top = data.curlDragTop ? data.curlDragTop: 0
        container.style.left = data.curlDragLeft? data.curlDragLeft: 0
      }
      let header = document.createElement('div')
      header.id = 'surl-d-header'
      container.appendChild(header)
      let title = document.createElement('div')
      title.id = 'surl-d-title'
      title.innerText = 'Curl Selections'
      header.appendChild(title)
      let close = document.createElement('div')
      close.id = 'surl-d-close'
      var imgURL = chrome.extension.getURL("images/Close-icon.png")
      close.style.backgroundImage = imgURL
      header.appendChild(close)
    
      let list = document.createElement('div')
      list.id = 'surl-d-ol'
      container.appendChild(list)
    
      document.body.appendChild(container)
    
      this.drag(document.getElementById("surl-d-container"));
      this.append(0)
    })
  },
  drag: function (element) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    console.log(element.id)
    if (document.getElementById("surl-d-header")) {
      /* if present, the header is where you move the DIV from:*/
      document.getElementById("surl-d-header").onmousedown = dragMouseDown;
    } else {
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      element.onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      element.style.top = (element.offsetTop - pos2) + "px";
      element.style.left = (element.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
  
      const element = document.getElementById('surl-d-container')
      chrome.storage.sync.set({
        'curlDragTop': element.style.top,
        'curlDragLeft': element.style.left,
      })
    }
  }
}

