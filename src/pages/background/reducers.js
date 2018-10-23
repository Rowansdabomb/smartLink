import {combineReducers} from 'redux';
import bookmark from './reducers/bookmarks';
import settings from './reducers/settings';
import animation from './reducers/animations';

import selection from './reducers/selection';
import colors from './reducers/colors';
import dragElement from './reducers/dragElement';
import attributes from './reducers/attributes';

export default combineReducers ({
  bookmark : bookmark,
  settings : settings,
  animation: animation,

  selection: selection,
  colors: colors,
  dragElement: dragElement,
  attributes: attributes,
})