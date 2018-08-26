var dragElement = {
  pos1: 0,
  pos2: 0,
  pos3: 0,
  pos4: 0,
  itemList: [],
  addItem: function (index) {
    if (document.getElementById('surl-d-ol') === null) this.create(index)

    for (let node of document.getElementById('surl-d-ol').children) {
      if (Number(node.style.order) === index) return
    }
    let selection = document.getElementsByClassName(surlClass+'-' + String(index))
    selection = String(index).concat(selection[0].innerText)
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

    this.itemList.push(index)
    this.itemList.sort()
    return null
  },
  removeItem: function (index, target) {
    document.getElementById('surl-d-ol').removeChild(target.parentElement)
    this.itemList = arrayRemove(this.itemList, this.getIndexFromOrder(index))
  },
  create: function (index) {
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
      this.addItem(0)
    })
  },
  drag: function (element) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById("surl-d-header")) {
      document.getElementById("surl-d-header").onmousedown = dragMouseDown;
    } else {
      element.onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      element.style.top = (element.offsetTop - pos2) + "px";
      element.style.left = (element.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
  
      const element = document.getElementById('surl-d-container')
      chrome.storage.sync.set({
        'curlDragTop': element.style.top,
        'curlDragLeft': element.style.left,
      })
    }
  },
  getIndexFromOrder: function(index) {
    if (this.itemList.length !== 0) {
      for (let i = 0; i < this.itemList.length; i++) {
        if (index === this.itemList[i]) return i
      }
    }
    return index
  }
}