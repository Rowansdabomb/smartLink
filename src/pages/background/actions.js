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
export const updateTabId = () => ({
  type: 'UPDATE-TAB-ID',
  tabId: tabId
})
export const loadAttributes = (tabId) => ({
  type: 'LOAD-ATTRIBUTES',
  tabId: tabId
})
export const setAttributes = (attributes, tabId) => ({
  type: 'SET-ATTRIBUTES',
  attributes: attributes,
  tabId: tabId
})
export const resetAttributes = (tabId) => ({
  type: 'RESET-ATTRIBUTES',
  tabId: tabId
})
