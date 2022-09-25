export function notificationUpdate(data) {
  return {
    type: 'LAST_NOTIFICATION_UPDATE',
    payload: data
  };
}
export function notificationRemove() {
  return {
    type: 'NOTIFICATION_REMOVE'
  };
}