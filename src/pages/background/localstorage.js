export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (e) {
    console.error('Error saving state', e);
  }
}

export const clearState = () => {
  try {
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
    return JSON.parse(serializedState);
  } catch (e) {
    console.error('Error loading state', e);
  }
}