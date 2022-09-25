import React, { useEffect, useRef, useState } from 'react';

import { View, Text, FlatList, TextInput, Image, TouchableOpacity, Platform } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import { GiftedChat, InputToolbar, Actions, Bubble, BubbleProps, MessageImage, Time, Avatar, Message } from 'react-native-gifted-chat'
import { conversation, send, messageRecive, seenChatListUpdate } from '../../redux/actions/messages';
import { useSelector, useDispatch } from "react-redux"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Modalize } from 'react-native-modalize';
import FastImage from 'react-native-fast-image';
import { heightPercentageToDP, widthPercentageToDP as wp } from 'react-native-responsive-screen';


import CustomLoader from '../../components/common/CustomLoader';
import styles from './styles';
import { saveWorkSpace } from '../../redux/actions/user';
import PlaceholderLoader from '../../components/updated/PlaceholderLoader';
import PMPHeader from '../../components/common/PMPHeader';
import { sendMessage, getMessages, sendImage } from '../../services/index';
import { black } from '../../constants/colors';





function ChatView(props) {
  const [loading, setloading] = useState(false);
  const [pics, setpics] = useState([])
  const [videos, setvideos] = useState([])
  const [gifUrl, setgifUrl] = useState('')
  const [gif, setgif] = useState('');
  const [text, setText] = useState(undefined)
  const modal = useRef()

  var conversations = useSelector((state) => state.messages.conversation)
  var reciveMessages = useSelector((state) => state.messages.reciveMessage)
  var user_id = useSelector((state) => state?.user?.user?.user_data?.user_id)

  useEffect(() => {
    // console.log('props.navigation.state.params',props.navigation.state.params.seen)
    setloading(true)
    fetchGifs('good');
    props.seenChatListUpdate(props.navigation.state.params.userId)


    return () => props.conversation([])
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      getAllMessages();
    }, 5000);
    return () => clearInterval(interval)
  }, [])

  function getAllMessages() {
    getMessages(props.navigation.state.params.userId, (messages) => {
      setloading(false)
      if (messages.length > 0) {
        var list = []
        messages.map((item) => {
          list.push({
            _id: item.id,
            text: item.text,
            createdAt: new Date(parseInt(item.time) * 1000),
            image: item.media != '' ? item.media : item?.stickers,
            user: {
              _id: item.messageUser.user_id,
              name: 'React Native',
              avatar: item.messageUser.avatar,
            },
          })
        })
        props.conversation(list)
      }
    })
  }
  useEffect(() => {
    if (pics?.uri || gifUrl != '') {
      sendSelectedImage()
    }
  }, [pics, gifUrl])

  useEffect(() => {
    seenChatListUpdate(props.navigation.state.params.userId)
    if (reciveMessages.length > 0) {
      if (props.navigation.state.params.userId == reciveMessages[0].data.user_id) {

        let lastMessage = []
        lastMessage.push({
          _id: reciveMessages[0].id,
          text: reciveMessages[0].message ? reciveMessages[0].message : '',

          createdAt: new Date(),
          user: {
            _id: reciveMessages[0].data.user_id,
            name: 'React Native',
            avatar: props.navigation.state.params.avatar
          },
        })
        props.messageRecive(GiftedChat.append(conversations, lastMessage))
      }
    }
  }, [reciveMessages]);
  const goBack = () => {
    props.navigation.pop();
  };



  const onSend = (messages) => {
    let id = messages[0]._id
    let text = messages[0].text
    // messages.image = imageData;
    let userId = props.navigation.state.params.userId;
    sendMessage(userId, text, id, (status) => {

      if (status) {
        props.send(GiftedChat.append(conversations, messages))
      }
    })
  }

  const onOpen = () => {
    modal.current?.open();
  };

  const searchGifs = (text) => {
    if (text.length >= 2) {
      fetchGifs(text);
    }
  }

  const fetchGifs = async (toSearch) => {

    const controller = new AbortController();
    const { signal } = controller;
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/search?&hash=2b49475b756c73b0e995&q=${toSearch}&api_key=DBJgK1vzdugwSZGRIE5o3G6CiQbVAaBl&limit=60&_=1617384196304`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        signal
      },
    ).catch(error => {
      console.log(error);
    });
    setTimeout(() => controller.abort(), 5000);
    const finalData = await response.json();
    // this.setState({ gifs: finalData.data });
    setgif(finalData.data)

  };

  const renderGifs = ({ item, index }) => {
    const f = Object.entries(item[1].images);
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {

          setgifUrl(f[0][1].url)
          // this.setState({ gifUrl: f[0][1].url });
          modal.current?.close();
        }}
      >
        <FastImage
          source={{ uri: "" + f[0][1].url }}
          style={{ width: wp(33), height: wp(33) }}
          resizeMode="cover"
          onProgress={() => <CustomLoader />}
        />
      </TouchableOpacity>
    );
  };


  const uploadpics = async () => {
    var options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      // mediaType :'video'
    };
    ImagePicker.showImagePicker(options, async (response) => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        console.log('response', response);

        var filePath = getFilePathForPlatform(response)
        console.log('filePath', filePath);
        setpics({ 
          uri:response.uri,
          name: response.fileName, 
          type: response.type,
          data:response.data });

      }
    });
  }

  const getFilePathForPlatform = response => {
    if (Platform.OS === 'ios') {
      return response.uri;
    } else {
      return response.path && 'file://' + response.path;
    }
  };
  const sendSelectedImage = () => {
    let id = uuidv4();
    console.log('pics', pics.type);
    let imageData;
    if (pics?.uri) {
      imageData = {
        uri: pics.uri,
        name: pics.name,
        type: pics.type? pics?.type : 'image/jpeg',
        // data:pics.data
      }
    }
    else if (gifUrl) {
      imageData = gifUrl
    }
    let about = ''
    let userId = props.navigation.state.params.userId;
    sendImage(userId, about, imageData, id, (status) => {
      if (status) {
        let messages = {
          user: { _id: props.user?.user_data?.user_id },
          createdAt: new Date(),
          image: status?.message_data[0].media != '' ? status?.message_data[0].media : status?.message_data[0]?.stickers,
          _id: id

        }

        props.send(GiftedChat.append(conversations, messages));
        setgifUrl('');
        setpics([]);
      }
    })

  }

  function renderInputToolbar(props) {
    return (

      <>
        <InputToolbar {...props}
          primaryStyle={{ width: wp(100) }}
          containerStyle={styles.inputToolbar}
        />
        <View style={styles.RightView}>
          <TouchableOpacity
            style={{ marginRight: wp(3) }}
            onPress={() => onOpen()}
          >
            <MaterialCommunityIcons name='gif' size={30} color={'grey'} />

          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => uploadpics()}>
            <MaterialCommunityIcons name='tooltip-image' size={30} color={'grey'} />

          </TouchableOpacity>

        </View>
      </>
    )
  };

  const renderBubble = (props) => {
    return (
      <Bubble


        {...props}

        wrapperStyle={{
          right: {
            backgroundColor: '#e8f6fc',

          },
          left: {
            backgroundColor: '#c7ccda',

          }
        }}
        textStyle={{
          left: {
            color: 'black',


          },
          right: {
            color: 'black'
          }
        }}


      />
    )
  }
  const renderTime = (props) => {

    return <Time {...props} timeTextStyle={{
      left: {
        color: 'black'
      }, right: {
        color: 'black'
      }
    }} />
  }
  // const renderAvatar=(props)=>{
  //   console.log(props)
  //   return(
  //     <Avatar containerStyle={{borderRadius:10}}  {...props} imageStyle={{width:100}} />

  //   )
  // }
  const renderMessage = (props) => {
    return (
      <Message
        {...props}
        linkStyle={{
          right: {
            color: 'black'
          },
          left: {
            color: 'black'
          }
        }}
      />
    )
  }
  return (
    <View style={{ flex: 1, paddingBottom: wp(2), paddingLeft: wp(1) }}>
      <PMPHeader
        centerText={props.navigation.state.params.chatName}
        ImageLeftIcon={'arrow-back'}
        LeftPress={goBack}

      />
      {loading && <PlaceholderLoader />}

      <GiftedChat


        messages={conversations}
        onSend={messages => onSend(messages)}
        user={{
          _id: user_id,
        }}
        text={text}

        // renderMessageImage={renderMessageImage}
        renderInputToolbar={renderInputToolbar}
        // renderMessageImage={renderMessageImage}
        // renderBubble={renderBubble}
        onInputTextChanged={(text) => setText(text)}
        renderBubble={renderBubble}
        renderTime={renderTime}
        showUserAvatar
        renderMessage={renderMessage}
      //renderAvatar={renderAvatar}

      // maxInputLength={wp(70)}


      />
      <Modalize
        modalStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}
        // adjustToContentHeight
        useNativeDriver={true}
        modalTopOffset={5}
        modalHeight={heightPercentageToDP(60)}
        ref={modal}

        HeaderComponent={
          <View style={{ width: wp(90), paddingVertical: wp(3), justifyContent: 'center', alignItems: 'center' }}>
            <TextInput 
             placeholder="Search Gifs"
             onChangeText={(text) => searchGifs(text)} 
             style={{ 
               width: wp(80),
               borderWidth: 1, 
               color:black,
               borderColor: '#bebebe',
              height: wp(10), 
              borderRadius: 5, 
              paddingLeft: 5
               }}  />
          </View>
        }
        flatListProps={{
          data: Object.entries(gif),
          renderItem: renderGifs,
          keyExtractor: item => item[1].id,
          showsVerticalScrollIndicator: false,
          scrollEventThrottle: 16,
          numColumns: 3,

        }}

      />
    </View>
  )
}

const mapStateToProps = state => ({
  user: state.user.user,
  messages: state.messages,
});

const mapDispatchToProps = dispatch => ({
  seenChatListUpdate: (payload) => dispatch(seenChatListUpdate(payload)),
  conversation: (payload) => dispatch(conversation(payload)),
  send: (payload) => dispatch(send(payload)),
  messageRecive: (payload) => dispatch(messageRecive(payload)),
  saveWorkSpace: workSpace => dispatch(saveWorkSpace(workSpace)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChatView);