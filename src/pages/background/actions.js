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

// FLYOUT ACTIONS
export const setOrigin = (top, left) => ({
  type: 'SET-FLYOUT-ORIGIN',
  top: top,
  left: left
})
export const toggleFlyout = () => ({
  type: 'TOGGLE-FLYOUT',
})
// export const addDragItem = (item) => ({
//   type: 'ADD-DRAG-ITEM',
//   item: item
// })
// export const removeDragItem = (index) => ({
//   type: 'REMOVE-DRAG-ITEM',
//   index: index
// })


// export const openflyout = () => ({
//   type: 'OPEN-DRAG-ELEMENT',
// })
// export const closeflyout = () => ({
//   type: 'CLOSE-DRAG-ELEMENT',
// })

// ATTRIBUTE ACTIONS
export const addAttribute = (attributes) => ({
  type: 'ADD-ATTRIBUTE',
  attributes: attributes
})
export const removeAttribute = (index) => ({
  type: 'REMOVE-ATTRIBUTE',
  index: index
})
export const updateUrl = (url) => ({
  type: 'UPDATE-URL',
  url: url
})
export const loadAttributes = (url) => ({
  type: 'LOAD-ATTRIBUTES',
  url: url
})
export const setAttributes = (attributes, url) => ({
  type: 'SET-ATTRIBUTES',
  attributes: attributes,
  url: url
})
export const resetAttributes = () => ({
  type: 'RESET-ATTRIBUTES',
})
