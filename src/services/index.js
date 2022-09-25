import AsyncStorage from '@react-native-community/async-storage';
import {ACCESS_TOKEN} from '../constants/storageKeys';
import moment from 'moment';
import {SERVER, server_key} from '../constants/server';
import _ from 'lodash';
import Toast from 'react-native-simple-toast'
async function getAccessToken() {
  const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
  return JSON.parse(access_token).access_token;
}
async function getAccessTokenAndUserId() {
  const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
  return {
    access_token: JSON.parse(access_token).access_token,
    user_id: JSON.parse(access_token).user_id,
  };
}
const showToast = msg => {
  Toast.show(msg, Toast.SHORT);
};
export const lostPet = (pet_id,lost_area,lost_lat,lost_lng,lostDate,callback) => {
  getAccessToken().then(TOKEN => {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('pet_id', pet_id);
    data.append('lost_area', lost_area);
    data.append('lost_date',moment(lostDate).format('MMM-DD-YYYY'));
    data.append('lost_lat', lost_lat);
    data.append('lost_lng', lost_lng);
  //  console.log(data,'before lost ')

 try {
  fetch(SERVER + '/api/lost-pet?access_token=' + TOKEN, {
    method: 'POST',
    headers: {},
    body: data,
  })
    .then(response => response.json())
    .then(json => {   
      callback(json);
    })
    .catch(error => {
      console.log(error);
    });
}
  catch (error) {
   console.log(error)
   
 }


})};
export const getUsers = (UserId, Location, callback) => {
  var location = Location;
  if (Location.latitude) {
    location = Location.latitude + ',' + Location.longitude;
  }
  return fetch(
    SERVER + '/Accounts/GetUser?Location=' + location + '&UserId=' + UserId,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  )
    .then(response => response.json())
    .then(json => {
      callback(json);
    })
    .catch(error => {
      console.log(error);
      callback(false);
    });
};

export const getPastEvents = callback => {
  getAccessToken().then(TOKEN => {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('fetch', 'past_events');
    data.append('limit', 10);
    fetch(SERVER + '/api/get-events?access_token=' + TOKEN, {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        callback(json);
      })
      .catch(error => {
        console.log(error);
      });
  });
};
export const getInterestedEvents = callback => {
  getAccessToken().then(TOKEN => {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('fetch', 'interested_events');
    data.append('limit', 10);
    fetch(SERVER + '/api/get-events?access_token=' + TOKEN, {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        callback(json);
      })
      .catch(error => {
        console.log(error);
      });
  });
};
export const getFollowFollowing = ( callback) => {
  getAccessTokenAndUserId().then(TOKEN => {
    const data = new FormData();
    data.append('user_id', TOKEN.user_id);
    data.append('server_key', server_key);
    data.append('type', 'followers,following');

    fetch(SERVER + '/api/get-friends?access_token='+TOKEN.access_token, {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        if (json.api_status == 200) {
          callback(json);
        } else {
          callback({});
        }
      })
      .catch(error => {
        callback({});
        console.log(error);
      });
  });
};
export const getInvitedEvents = callback => {
  getAccessToken().then(TOKEN => {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('fetch', 'invited_events');
    data.append('limit', 10);
    fetch(SERVER + '/api/get-events?access_token=' + TOKEN, {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        callback(json);
      })
      .catch(error => {
        console.log(error);
      });
  });
};
export const allEvents = callback => {
  getAccessToken().then(TOKEN => {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append(
      'fetch',
      'events,my_events,going_events,invited_events,interested_events,past_events',
    );
    data.append('limit', 10);
    fetch(SERVER + '/api/get-events?access_token=' + TOKEN, {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        callback(json);
    
      })
      .catch(error => {
        console.log(error);
      });
  });
};
export const getGoingEvents = callback => {
  getAccessToken().then(TOKEN => {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('fetch', 'going_events');
    data.append('limit', 10);
    fetch(SERVER + '/api/get-events?access_token=' + TOKEN, {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        callback(json);
      })
      .catch(error => {
        console.log(error);
      });
  });
};
export const CreateComment = (post_id, text, callback) => {
  getAccessToken().then(TOKEN => {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('type', 'create');
    data.append('post_id', post_id);
    data.append('text', text);
    fetch(SERVER + '/api/comments?access_token=' + TOKEN, {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        callback(json);
      })
      .catch(error => {
        console.log(error);
      });
  });
};
export const getComments = (post_id, callback) => {
  getAccessToken().then(TOKEN => {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('type', 'fetch_comments');
    data.append('post_id', post_id);
    data.append('sort', 'desc');
    fetch(SERVER + '/api/comments?access_token=' + TOKEN, {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        callback(json.data);
      })
      .catch(error => {
        console.log(error);
      });
  });
};
export const myEvents = callback => {
  getAccessToken().then(TOKEN => {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('fetch', 'my_events');
    data.append('limit', 10);
    fetch(SERVER + '/api/get-events?access_token=' + TOKEN, {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        callback(json);
      })
      .catch(error => {
        console.log(error);
      });
  });
};

export const createEvent = (
  name,
  location,
  description,
  start_date,
  end_date,
  start_time,
  end_time,
  image,
  callback,
) => {
  console.log(name,location,description,start_date,end_date,start_time,end_time,image)
  getAccessToken().then(TOKEN => {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('event_name', name);
    data.append('event_location', location);
    data.append('event_description', description);
    data.append('event_start_date', start_date);
    data.append('event_end_date', end_date);
    data.append('event_start_time', start_time);
    data.append('event_end_time', end_time);
    data.append('event_cover', image);
    //console.log(data,'create event form data')
    fetch(SERVER + '/api/create-event?access_token=' + TOKEN, {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        // console.log('response',json)
        if (json.api_status == 200) {
          callback(true,'');
        } else if (json.errors) {
         
          callback(false,json.errors.error_text);
        } else {
        // console.log(json)
          callback(false,'try again later');
        }
      })
      .catch(error => {
        console.log(error, 'error');
        callback(false,error);
      });
  });
};
export const editEvent = (
  event_id,
  name,
  location,
  description,
  start_date,
  end_date,
  start_time,
  end_time,
  image,
  callback,
) => {
  getAccessToken().then(TOKEN => {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('type', 'edit');
    data.append('event_name', name);
    data.append('event_location', location);
    data.append('event_description', description);
    data.append('event_start_date', start_date);
    data.append('event_end_date', end_date);
    data.append('event_start_time', start_time);
    data.append('event_end_time', end_time);
    data.append('event_id', event_id);
    data.append('event-cover', image);
    try{
    fetch(SERVER + '/api/events?access_token=' + TOKEN, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'accept': 'application/json',
      },
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        if (json.api_status == 200) {
          callback(true);
        } else if (json.errors) {
          alert(json.errors.error_text);
          callback(false);
        } else {
          alert('try again later');
          callback(false);
        }
      })
      .catch(error => {
        console.log(error, 'error');
        callback(false);
      });
    }catch(e){
      console.log(e)
    }
  });
};
export const deleteEvent = (event_id, callback) => {
  getAccessToken().then(TOKEN => {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('type', 'delete');
    data.append('event_id', event_id);
    fetch(SERVER + '/api/events?access_token=' + TOKEN, {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        if (json.api_status == 200) {
          callback(true);
        } else if (json.errors) {
         // alert(json.errors.error_text);
          callback(false);
        } else {
          alert('try again later');
          callback(false);
        }
      })
      .catch(error => {
        console.log(error, 'error');
        callback(false);
      });
  });
};
export const eventPosts = (id, callback) => {
  getAccessToken().then(TOKEN => {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('type', 'get_event_posts');
    data.append('id', id);
    fetch(SERVER + '/api/posts?access_token=' + TOKEN, {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        if (json.api_status == 200) {
          callback(json.data);
        } else if (json.errors) {
          alert(json.errors.error_text);

          callback(false);
        } else {
          alert('try again later');
          callback(false);
        }
      })
      .catch(error => {
        console.log(error, 'error');
        callback(false);
      });
  });
};
export const pressInterestEvent = (id, callback) => {
  getAccessToken().then(TOKEN => {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('event_id', id);
    fetch(SERVER + '/api/interest-event?access_token=' + TOKEN, {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        if (json.api_status == 200) {
          showToast(json.interest_status);
          callback(json.interest_status);
        } else {
          showToast(json.api_status.error_text);
          callback('');
        }
      })
      .catch(error => {
        callback('');
        console.log(error);
      });
  });
};

export const updateUsercoverCamera = (cover, callback) => {
  getAccessToken().then(TOKEN => {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('cover', cover);
    fetch(SERVER + '/api/update-user-data?access_token=' + TOKEN, {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        if (json.api_status == 200) {
          callback(true);
        } else {
          callback(false);
        }
      })
      .catch(error => {
        console.log(error);
      });
  });
};
export const updateUseravatarCamera = (avatar, callback) => {
  getAccessToken().then(TOKEN => {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('avatar', avatar);
    fetch(SERVER + '/api/update-user-data?access_token=' + TOKEN, {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        if (json.api_status == 200) {
          callback(true);
        } else {
          callback(false);
        }
      })
      .catch(error => {
        console.log(error);
      });
  });
};
export const pressGoingEvent = (id, callback) => {
  getAccessToken().then(TOKEN => {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('event_id', id);
    fetch(SERVER + '/api/go-to-event?access_token=' + TOKEN, {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        // console.log('pressGoing', json);
        if (json.api_status == 200) {
          
          callback('');
        } else {
    
          callback('');
        }
      })
      .catch(error => {
        callback('');
        console.log(error);
      });
  });
};
export const inviteEvent = (id, user_id, callback) => {

  getAccessToken().then(TOKEN => {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('event_id', user_id);
    data.append('user_id', id);
    fetch(SERVER + '/api/invite-event?access_token=' + TOKEN, {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        if (json.api_status == 200) {
          showToast(json.message);
          callback('1');
        } else if (json.api_status == 400) {
          showToast(json.message);
          callback('2');
        } else {
          showToast('try again later');
          callback('3');
        }
      })
      .catch(error => {
        console.log(error);
        callback('');
      });
  });
};
export const getMyPages = callback => {
  getAccessToken().then(TOKEN => {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('limit', '100');
    data.append('type', 'my_pages');
    fetch(SERVER + '/api/get-my-pages?access_token=' + TOKEN, {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        if (json.api_status == 200) {
          callback(json.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  });
};
export const getUserPets = callback => {
  getAccessToken().then(TOKEN => {
    const data = new FormData();
    data.append('server_key', server_key);
    fetch(SERVER + '/api/get-user-pets?access_token=' + TOKEN, {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        if (json.api_status == 200) {
          callback(json.pets);
        }
      })
      .catch(error => {
        console.log(error);
      });
  });
};
export const getMyGroups = callback => {
  getAccessToken().then(TOKEN => {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('limit', '100');
    data.append('type', 'my_groups');
    fetch(SERVER + '/api/get-my-groups?access_token=' + TOKEN, {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        if (json.api_status == 200) {
          callback(json.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  });
};
//share_post_on_page
export const share_post_on_page = (post_id, page_id, callback) => {
  getAccessToken().then(TOKEN => {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('type', 'share_post_on_page');
    data.append('id', post_id);
    data.append('page_id', page_id);
    fetch(SERVER + '/api/posts?access_token=' + TOKEN, {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        if (json.api_status == 200) {
          callback('done');
        } else {
          callback('false');
        }
      })
      .catch(error => {
        console.log(error);
      });
  });
};
export const newCreatepost = (user_id, postFile, pageId, callback) => {
  getAccessToken().then(TOKEN => {
    const data = new FormData();
    data.append('user_id', user_id);
    data.append('s', TOKEN);
    data.append('postFile', postFile);

    fetch(SERVER + '/app_api.php?application=phone&type=new_post', {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        if (json.post_data) {
          share_post_on_page(json.post_data.id, pageId, status => {
            callback(status);
          });
        } else if (json.api_status == 400) {
          callback(json.errors.error_text);
        }
      })
      .catch(error => {
        console.log(error);
      });
  });
};
//share_post_on_page
export const share_post_on_group = (post_id, group_id, callback) => {
  getAccessToken().then(TOKEN => {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('type', 'share_post_on_group');
    data.append('id', post_id);
    data.append('group_id', group_id);
    fetch(SERVER + '/api/posts?access_token=' + TOKEN, {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        if (json.api_status == 200) {
          callback('done');
        } else {
          callback('false');
        }
      })
      .catch(error => {
        console.log(error);
      });
  });
};
export const newCreatepostGroup = (user_id, postFile, group_id, callback) => {
  getAccessToken().then(TOKEN => {
    const data = new FormData();
    data.append('s', TOKEN);
    data.append('user_id', user_id);
    data.append('postFile', postFile);

    fetch(SERVER + '/app_api.php?application=phone&type=new_post', {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        if (json.post_data) {
          share_post_on_group(json.post_data.id, group_id, status => {
            callback(status);
          });
        } else if (json.api_status == 400) {
          callback(json.errors.error_text);
        }
      })
      .catch(error => {
        console.log(error);
      });
  });
};

export const updatePetAvatar = (avatar, pet_id, callback) => {
  getAccessToken().then(TOKEN => {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('pet_id', pet_id);
    data.append('avatar', avatar);
    fetch(SERVER + '/api/update-pet-data?access_token=' + TOKEN, {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        if (json.api_status == 200) {
          callback(true);
        } else {
          callback(false);
        }
      })
      .catch(error => {
        console.log(error);
      });
  });
};

export const Createpost = (user_id, postFile, callback) => {
  getAccessToken().then(TOKEN => {
    const data = new FormData();
    data.append('user_id', user_id);
    data.append('s', TOKEN);
    data.append('postFile', postFile);

    fetch(SERVER + '/app_api.php?application=phone&type=new_post', {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        if (json.post_data) {
          callback(json.post_data);
        } else if (json.api_status == 400) {
          alert(json.api_status);
          callback(json.post_data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  });
};
export const CreateEventPost = (event_id, postText, callback) => {
  getAccessTokenAndUserId().then(TOKEN => {
    const data = new FormData();
    data.append('user_id', TOKEN.user_id);
    data.append('s', TOKEN.access_token);
    data.append('postText', postText);
    data.append('event_id', event_id);

    fetch(SERVER + '/app_api.php?application=phone&type=new_post', {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        if (json.api_status == 200) {
          callback('');
        } else {
          callback('');
        }
      })
      .catch(error => {
        console.log(error);
      });
  });
};
export const CreatepostPayHomage = (text, pet_id, callback) => {
  getAccessTokenAndUserId().then(TOKEN => {
    const data = new FormData();
    data.append('user_id', TOKEN.user_id);
    data.append('s', TOKEN.access_token);
    data.append('feeling_type', 'feelings');
    data.append('feeling', 'sad');
    data.append('postText', text);
    data.append('recipient_id', pet_id);
    fetch(SERVER + '/app_api.php?application=phone&type=new_post', {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
    //  console.log('Homeage response',json.post_data )
        if (json.post_data) {
          callback(true);
        } else if (json.api_status == 400) {
          alert(json.api_status);
          callback(false);
        }else{
        callback(false);
        }
      })
      .catch(error => {
        callback(false);
        console.log(error);
      });
  });
};

export const CreatePostAllInOne = (data, callback) => {

  getAccessTokenAndUserId().then(TOKEN => {
    data.append('user_id', TOKEN.user_id);
    data.append('s', TOKEN.access_token);
    fetch(SERVER + '/app_api.php?application=phone&type=multi_post', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Connection: 'keep-alive',
        accept: 'application/json',
      },
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        if (json.api_status == 200) {
          callback(json);
        } else {
          callback(json);
        }
      })
      .catch(error => {
        callback({});
        console.log(error);
      });
  });
};
export const sendMessage = (reciverId, message, message_hash_id, callback) => {
 // console.log('image url in api function', imageData );
  getAccessTokenAndUserId().then(TOKEN => {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('user_id', reciverId);
    data.append('message_hash_id', message_hash_id);
    data.append('text', message);
   // data.append('image_url',imageData)
    fetch(SERVER + '/api/send-message?access_token=' + TOKEN.access_token, {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        console.log('message response ', json);
        if (json.api_status == '200') {
          callback(true);
        } else {
          callback(false);
        }
      })
      .catch(error => {
        callback(false);
        console.log(error);
      });
  });
};
export const sendImage = (reciverId,about, imageData,id, callback) => {
  
   getAccessTokenAndUserId().then(TOKEN => {
     const data = new FormData();
     data.append('server_key', server_key);
     data.append('user_id', reciverId);
    data.append('message_hash_id',id);
    about!=''&&data.append('text',about)
     // data.append('image_url', uri);
     data.append(imageData?.uri?'file':'gif',imageData)

     fetch(SERVER + '/api/send-message?access_token=' + TOKEN.access_token, {
       method: 'POST',
       headers: {
        'Accept': 'application/json',
        // 'Content-Type': 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${TOKEN.access_token}`
       },
       body: data,
     })
       .then(response => response.json())
       .then(json => {
         console.log('send image', json);
         if (json.api_status == '200') {
           
           callback(json);
         } else {
           callback(false);
         }
       })
       .catch(error => {
        
         callback(false);
         console.error(error);
       });
   });
 };
export const getMessages = (reciverId, callback) => {
  getAccessTokenAndUserId().then(TOKEN => {
    const data = new FormData();
    data.append('s', TOKEN.access_token);
    data.append('user_id', TOKEN.user_id);
    data.append('recipient_id', reciverId);
    fetch(SERVER + '/app_api.php?application=phone&type=get_user_messages', {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        if (json.api_status == '200') {
          callback(json.messages);
        } else {
          callback([]);
        }
      
      })
      .catch(error => {
        callback([]);
      });
  });
};
export const getAllMessages = callback => {
  getAccessTokenAndUserId().then(TOKEN => {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('data_type', 'users');
    data.append('user_type', 'online,offline');
    fetch(SERVER + '/api/get_chats?access_token=' + TOKEN.access_token, {
      method: 'POST',
      headers: {},
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        if (json.api_status == 200) {
          callback(json.data);
        } else {
          callback([]);
        }
      })
      .catch(error => {
        callback([]);
      });
  });
};
