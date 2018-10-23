const defaultState = {
  attributes: []
  // at: [],
  // ft: [], 
  // ai: [],
  // fi: [],
  // ao: [],
  // fo: [],
  // iai: [],
  // ifi: []
}

const attributes = (state=defaultState, action) => {
  switch (action.type) {
    case 'ADD-ATTRIBUTE':
      return {
        ...state,
        attributes: [...state.attributes.concat([action.attributes])]
        // at: [...state.at.concat(action.attributes[0])],
        // ft: [...state.at.concat(action.attributes[1])],
        // ai: [...state.at.concat(action.attributes[2])],
        // fi: [...state.at.concat(action.attributes[3])],
        // ao: [...state.at.concat(action.attributes[4])],
        // fo: [...state.at.concat(action.attributes[5])],
        // iai: [...state.at.concat(action.attributes[6])],
        // ifi: [...state.at.concat(action.attributes[7])],
      }
    case 'REMOVE-ATTRIBUTE':
      return {
        ...state,
        attributes: [...state.attributes.filter((val, i) => i !== action.index)],
        // at: [...state.at.filter((val, i) => i !== action.index)],
        // ft: [...state.ft.filter((val, i) => i !== action.index)],
        // ai: [...state.ai.filter((val, i) => i !== action.index)],
        // fi: [...state.fi.filter((val, i) => i !== action.index)],
        // ao: [...state.ao.filter((val, i) => i !== action.index)],
        // fo: [...state.fo.filter((val, i) => i !== action.index)],
        // iai: [...state.iai.filter((val, i) => i !== action.index)],
        // ifi: [...state.ifi.filter((val, i) => i !== action.index)],
      }
    case 'RESET-ATTRIBUTES':
      return {
        ...state,
        attributes: []
        // at: [],
        // ft: [],
        // ai: [],
        // fi: [],
        // ao: [],
        // fo: [],
        // iai: [],
        // ifi: [],
      }
  }
  return state
}

export default attributes;