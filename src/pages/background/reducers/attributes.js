const defaultState = {
  attributes: []
}

const attributes = (state=defaultState, action) => {
  switch (action.type) {
    case 'ADD-ATTRIBUTE':
      return {
        ...state,
        attributes: [...state.attributes.concat([action.attributes])]
      }
    case 'REMOVE-ATTRIBUTE':
      return {
        ...state,
        attributes: [...state.attributes.filter((val, i) => i !== action.index)],
      }
    case 'RESET-ATTRIBUTES':
      return {
        ...state,
        attributes: []
      }
  }
  return state
}

export default attributes;