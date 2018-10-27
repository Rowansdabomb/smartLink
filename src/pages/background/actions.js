// SELECTION ACTIONS
export const setCurrentSelection = (value) => ({
  type: 'SET-CURRENT-SELECTION',
  value: value
})
export const incrementCurrentSelection = () => ({
  type: 'INCREMENT-CURRENT-SELECTION',
})
export const decrementCurrentSelection = () => ({
  type: 'DECREMENT-CURRENT-SELECTION',
})

export const setTotalSelection = (value) => ({
  type: 'SET-TOTAL-SELECTIONS',
  value: value
})
export const incrementTotalSelection = () => ({
  type: 'INCREMENT-TOTAL-SELECTIONS',
})
export const decrementTotalSelection = () => ({
  type: 'DECCREMENT-TOTAL-SELECTIONS',
})

// COLOR ACTIONS
export const setColor = (value) => ({
  type: 'SET-HIGHLIGHT-COLOR',
  value: value
})

// DRAGABLE ACTIONS
export const setOrigin = (top, left) => ({
  type: 'SET-DRAG-ELEMENT-ORIGIN',
  top: top,
  left: left
})
// export const addDragItem = (item) => ({
//   type: 'ADD-DRAG-ITEM',
//   item: item
// })
// export const removeDragItem = (index) => ({
//   type: 'REMOVE-DRAG-ITEM',
//   index: index
// })

// export const openDragElement = () => ({
//   type: 'OPEN-DRAG-ELEMENT',
// })
// export const closeDragElement = () => ({
//   type: 'CLOSE-DRAG-ELEMENT',
// })

// ATTRIBUTE ACTIONS
export const addAttribute = (attributes) => ({
  type: 'ADD-ATTRIBUTE',
  attributes: attributes,
})
export const removeAttribute = (index) => ({
  type: 'REMOVE-ATTRIBUTE',
  index: index
})
export const resetAttributes = () => ({
  type: 'RESET-ATTRIBUTE',
})

// //BOOKMARKS ACTIONS
// export const refreshBookmark = (data, time) => ({
//   type: 'REFRESH',
//   urlList: data,
//   expiry: time
// })

// export const deleteAllBookmark = () => ({
//   type: 'DELETE-ALL',
// })

// export const deleteOneBookmark = (url) => ({
//   type: 'DELETE-ONE',
//   url: url
// })

// export const addBookmark = (url) => ({
//   type: 'ADD',
//   urlList: url,
//   expiry: new Date().getTime()
// })

// export const addFromButton = (flag) => ({
//   type: 'DELETE-ONE',
//   addFromButton: flag
// })

// export const searchBookmark = (text) => ({
//   type: 'SEARCH',
//   textSearched: text
// })

// export const emptySearch = () => ({
//   type: 'EMPTY-SEARCH'
// })

// //SETTINGS actions

// export const toggleButton = (flag) => ({
//   type: 'TOGGLE-BUTTON',
//   toggleButton: flag
// })

// export const expireDate = (date) => ({
//   type: 'UPDATE-DATE',
//   expireDate: date
// })

// export const toggleButtonHistory = (flag) => ({
//   type: 'TOGGLE-BUTTON-HISTORY',
//   toggleButtonHistory: flag
// })


// // ANIMATION ACTIONS

// export const buttonCog = (flag) => ({
//   type: 'TOGGLE-COG',
//   buttonCog: flag
// })

// export const toggleSearch = (classValue) => ({
//   type: 'TOGGLE-SEARCH',
//   toggleSearch: classValue
// })