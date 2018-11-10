import {combineReducers} from 'redux';

import selection from './reducers/selection';
import colors from './reducers/colors';
import dragElement from './reducers/dragElement';
import pageData from './reducers/pageData';

export default combineReducers ({
  selection: selection,
  colors: colors,
  dragElement: dragElement,
  pageData: pageData,
})
