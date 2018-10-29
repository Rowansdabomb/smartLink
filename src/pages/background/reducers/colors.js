
const defaultState = {
  highlightColor: 'transparent',
}

const colors = (state=defaultState, action) => {
  switch (action.type) {
    case 'SET-HIGHLIGHT-COLOR':
    // console.log('color ', action.value)
      return {
        ...state,
        highlightColor: action.value
      }
  }
  return state
}

export default colors;