var initialize = true
const surlClass = 'surl-highlight'

var state = {
  attributes: {
    anchorTag: [], 
    focusTag: [],
    anchorElementIndex: [],
    focusElementIndex: [],
    anchorOffset: [], 
    focusOffset: [], 
    innerAnchorIndex: [], 
    innerFocusIndex: []
  },
  highlightColor: null,
  appendAttributes: function(values) {
    this.attributes = Object.keys(this.attributes).map((key, index) => {
      return [].concat(this.attributes[key], values[index]) 
    })
    console.log(this.attributes)
  },
  removeAttributes: function(index) {
    console.log(index)
    Object.keys(this.attributes).map((key) => { 
      // this.attributes[key].splice(index, 1)
      this.attributes[key].splice(index, 1)
      return
    })
    console.log(this.attributes)
  },
  getAttributes: function(index) {
    index = dragElement.getIndexFromOrder(index)
    console.log(index)
    let result = []
    Object.values(this.attributes).map((value, j) => {
      if (!isDefined(value[index])) throw 'attribute values are not defined'
      else if (j < 2) {
        result = [].concat(result, value[index])
      } else {
        result = [].concat(result, Number(value[index]))
      }
    })
    if (result.length === 0) return null
    else return result
  },
  colorHighlights: function() {
    for (let selection of document.getElementsByClassName(surlClass)) {
      selection.style.backgroundColor = this.highlightColor
    }
  }
}