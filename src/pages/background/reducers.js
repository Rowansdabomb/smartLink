import {combineReducers} from 'redux';

import selection from './reducers/selection';
import colors from './reducers/colors';
import flyout from './reducers/flyout';
import pageData from './reducers/pageData';

export default combineReducers ({
  selection: selection,
  colors: colors,
  flyout: flyout,
  pageData: pageData,
})
