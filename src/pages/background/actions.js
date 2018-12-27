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

// RANGE-DATA ACTIONS
export const addRangeData = (rangeData) => ({
  type: 'ADD-RANGE-DATA',
  rangeData: rangeData
})
export const removeRangeData = (index) => ({
  type: 'REMOVE-RANGE-DATA',
  index: index
})
export const updateUrl = (url) => ({
  type: 'UPDATE-URL',
  url: url
})
export const loadRangeData = (url) => ({
  type: 'LOAD-RANGE-DATA',
  url: url
})
export const setRangeData = (rangeData, url) => ({
  type: 'SET-RANGE-DATA',
  rangeData: rangeData,
  url: url
})
export const resetRangeData = () => ({
  type: 'RESET-RANGE-DATA'
})
export const reset = () => ({
  type: 'RESET',
})
