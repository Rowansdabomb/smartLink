
const defaultState = {
  highlightColor: 'transparent',
}

const colors = (state=defaultState, action) => {
  switch (action.type) {
    case 'SET-HIGHLIGHT-COLOR':
      return {
        ...state,
        highlightColor: action.value
      }
  }
  return state
}

export default colors;