
const defaultState = {
  origin: [0, 0],
  isDragOpen: true
}

const dragElement = (state=defaultState, action) => {
  switch (action.type) {
    case 'SET-DRAG-ELEMENT-ORIGIN':
      return {
        ...state,
        origin: [action.top, action.left]
      }
    case 'OPEN-DRAG-ELEMENT':
      return {
        ...state,
        isDragOpen: true
      }
    case 'CLOSE-DRAG-ELEMENT':
      return {
        ...state,
        isDragOpen: false
      }
  }
  return state
}

export default dragElement;