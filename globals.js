var initialize = true
const surlClass = 'surl-highlight'
var highlightColor = null
var totalSelections = 0
var globalIndex = 0

// Global attributes
var gAttributes = []

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
  },
  removeAttributes: function(index) {
    let temp = Object.keys(this.attributes).map((key) => { 
      return this.attributes[key].splice(index, 1)
    })
    console.log(this.attributes)
  },
  getAttributes: function(index) {
    return Object.values(this.attributes).reduce((carry, value) => {
      if (index) {
        carry = carry.concat(value[index])
      } else {
        carry = carry.concat([value])
      }
    }, [])
  }
}