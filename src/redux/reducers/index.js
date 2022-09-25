import {combineReducers} from 'redux';
import auth from './auth';
import user from './user';
import app from './app';
import mypets from './pets';
import events from './events';
import messages from './messages';
import friends from './friends';
import notifications from './notifications';
import post from './post';
import pages from './pages';
import groups from './groups';
import petTags from './PetTags'

const rootReducer = combineReducers({
  app,
  auth,
  user,
  mypets,
  notifications,
  events,
  messages,
  friends,
  post,
  pages,
  groups,
  petTags,
});
export default (state, action) =>rootReducer(action.type === 'USER_LOGOUT' ? undefined : state, action);
