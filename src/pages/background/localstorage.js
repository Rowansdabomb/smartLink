export const saveState = (state) => {
  try {
    console.log('SAVE SERIALIZED STATE: ', state.pageData.data)
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (e) {
    console.error('Error saving state', e);
  }
}

export const clearState = () => {
  try {
    console.log('CLEAR SERIALIZED STATE')
    localStorage.clear()
  } catch(e) {
    console.error('Error clearing state', e);
  }
}

export const loadState = () => {
  localStorage.clear()
  localStorage.removeItem('state.pageData.data')
  try {
    const serializedState = localStorage.getItem('state');
    if(serializedState === null) {
      return undefined;
    }
    console.log('LOAD SERIALIZED STATE: ', serializedState)
    return JSON.parse(serializedState);
  } catch (e) {
    console.error('Error loading state', e);
  }
}