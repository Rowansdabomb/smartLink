
const defaultState = {
  origin: [0, 0],
  // items: []
  hide: true
}

const flyout = (state=defaultState, action) => {
  switch (action.type) {
    case 'SET-FLYOUT-ORIGIN':
      return {
        ...state,
        origin: [action.top, action.left]
      }
    case 'TOGGLE-FLYOUT':
      return {
        ...state,
        hide: state.hide ? false: true
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

export default flyout;