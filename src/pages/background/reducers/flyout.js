
const defaultState = {
  origin: [0, 0],
  hide: false
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
  }
  return state
}

export default flyout;