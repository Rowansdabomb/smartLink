export const saveState = (state) => {
  // console.log(Object.keys(state))
  try {
    const serializedState = JSON.stringify(state);
    console.log('SAVE SERIALIZED STATE: ', serializedState)
    localStorage.setItem('state', serializedState);
    // localStorage.clear()
  } catch (e) {
    console.error('Error saving state', e);
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

  }
}