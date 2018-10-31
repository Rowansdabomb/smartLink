import {combineReducers} from 'redux';

import selection from './reducers/selection';
import colors from './reducers/colors';
import dragElement from './reducers/dragElement';
import attributes from './reducers/attributes';

export default combineReducers ({
  selection: selection,
  colors: colors,
  dragElement: dragElement,
  attributes: attributes,
})
