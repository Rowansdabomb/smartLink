const defaultState = {
  current: 0,
  total: 0
}

const selection = (state=defaultState, action) => {
  switch (action.type) {
    case 'SET-CURRENT-SELECTION':
      return {
        ...state,
        current: action.value
      }
    case 'INCREMENT-CURRENT-SELECTION':
      return {
        ...state,
        current: state.current < state.total ? state.current + 1 : 0
      }
    case 'DECREMENT-CURRENT-SELECTION':
      return {
        ...state,
        current: state.current > 0 ? state.current - 1 : state.total
      }
    case 'SET-TOTAL-SELECTIONS':
      return {
        ...state,
        total: action.value
      }
    case 'INCREMENT-TOTAL-SELECTIONS':
      return {
        ...state,
        total: state.total + 1
      }
    case 'DECREMENT-TOTAL-SELECTIONS':
      return {
        ...state,
        total: state.total > 0 ? state.total - 1 : 0
      }
  }
  return state
}

export default selection;