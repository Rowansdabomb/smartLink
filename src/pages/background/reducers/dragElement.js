
const defaultState = {
  origin: [0, 0],
  // items: []
  // isDragOpen: false
}

const dragElement = (state=defaultState, action) => {
  switch (action.type) {
    case 'SET-DRAG-ELEMENT-ORIGIN':
      return {
        ...state,
        origin: [action.top, action.left]
      }
    // case 'ADD-DRAG-ITEM':
    //   return {
    //     ...state,
    //     items: [...state.items.concat([action.item])]
    //   }
    // case 'REMOVE-DRAG-ITEM':
    //   return {
    //     ...state,
    //     items: [...state.items.filter((val, i) => i !== action.index)]
    //   }
    // case 'OPEN-DRAG-ELEMENT':
    //   return {
    //     ...state,
    //     isDragOpen: true
    //   }
    // case 'CLOSE-DRAG-ELEMENT':
    //   return {
    //     ...state,
    //     isDragOpen: false
    //   }
  }
  return state
}

export default dragElement;