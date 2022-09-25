export function chatList(data) {
  return {
    type: 'CHATLIST',
    payload: data
  };
}

export function conversation(data) {
  return {
    type: 'CONVERSATION',
    payload: data
  };
}
export function send(data) {
  return {
    type: 'SEND_MESSAGE',
    payload: data
  };
}
export function chatListUpdate(data) {
    return {
      type: 'LAST_MESSAGE_UPDATE',
      payload: data
    };
  }
  export function seenChatListUpdate(data) {
    return {
      type: 'SEEN_MESSAGE_UPDATE',
      payload: data
    };
  }
  

export function messageRecive(data) {
  return {
    type: 'MESSAGE_RECIVE',
    payload: data
  };
}
export function reciveMessage(data) {
  return {
    type: 'RECIVE_MESSAGE',
    payload: data };
}