export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    console.log('SAVE SERIALIZED STATE: ', serializedState)
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