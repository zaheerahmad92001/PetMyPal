import {APP} from './types';

export function appStart(root) {
  return {
    type: APP.START,
    root,
  };
}

export function appReady() {
  return {
    type: APP.READY,
  };
}
export function appInit() {
  return {
    type: APP.INIT,
  };
}
