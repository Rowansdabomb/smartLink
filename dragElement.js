var dragElement = {
  pos1: 0,
  pos2: 0,
  pos3: 0,
  pos4: 0,
  itemList: [],
  listComponent: null,
  containerComponent: null,
  addItem: function (index) {

    this.itemList.push(index)
    this.itemList.sort()

    if (this.listComponent === null) {
      this.create(index)
      return null
    } 

    for (let child of this.listComponent.children) {
      if (Number(child.style.order) === index) return
    }

    let selection = document.getElementsByClassName(surlClass+'-' + String(index))
    selection = String(index+1).concat(' ', selection[0].innerText)
    
    let listItem = document.createElement('div')
    listItem.classList.add('surl-d-li')
    listItem.style.order = index
  
    let listItemText = document.createElement('span')
    listItemText.innerText = selection
    listItem.appendChild(listItemText)
  
    let deleteIcon = document.createElement('i')
    deleteIcon.classList.add('fa') 
    deleteIcon.classList.add('fa-trash') 
    listItem.appendChild(deleteIcon)
  
    let list = this.listComponent
    list.appendChild(listItem)
    this.show()

    return null
  },
  removeItem: function (order, target) {
    this.listComponent.removeChild(target.parentElement)
    this.itemList = arrayRemove(this.itemList, order)
    if (this.itemList.length === 0) {
      this.hide()
    }
  },
  create: function (index) {
    chrome.storage.sync.get(['curlDragTop','curlDragLeft'], (data) => {
      var styleNode           = document.createElement ("style");
      styleNode.type          = "text/css";
      styleNode.textContent   = "@font-face { font-family: FontAwesome; src: url('"
                              + chrome.extension.getURL ("fontawesome-webfont.woff")
                              + "'); }";
      document.head.appendChild (styleNode);

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
      let close = document.createElement('i')
      close.className = 'surl-d-close'
      close.classList.add('fa')
      close.classList.add('fa-times')

      header.appendChild(close)
    
      let list = document.createElement('div')
      list.id = 'surl-d-ol'
      container.appendChild(list)
    
      document.body.appendChild(container)

      this.containerComponent = container
      this.listComponent = list
    
      this.drag(this.containerComponent);
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
    console.log(this.itemList)
    if (this.itemList.length !== 0) {
      for (let i = 0; i < this.itemList.length; i++) {
        console.log(this.itemList[i])
        if (index === this.itemList[i]) return i
      }
    }
    return index
  },
  hide: function() {
    console.log('hide the thing')
    this.containerComponent.style.display = 'none'
  },
  show: function() {
    this.containerComponent.style.display = 'flex'
  }
}