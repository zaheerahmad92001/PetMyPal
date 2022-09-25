import React, { Component } from "react";
import { View, Text, FlatList, } from 'react-native'
import { Container,} from "native-base";
import PMPHeader from '../../components/common/PMPHeader'
import styles from './styles'
import { server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import AsyncStorage from '@react-native-community/async-storage';
import RenderItemCard from "../../components/common/RenderItemCard";
import { NavigationEvents } from 'react-navigation';

import { petMyPalApiService } from '../../services/PetMyPalApiService';
import { connect } from 'react-redux';
import CustomLoader from "../../components/common/CustomLoader";
import { commonState } from "../../components/common/CommomState";
import ShareModal from '../shareModal/index';
import Reactions from '../../components/common/Reactions'
import ConfirmModal from '../../components/common/ConfirmModal';
import EditPost from '../../components/common/EditPost';
import {reportPostText} from '../../constants/ConstantValues'
import ErrorModal from '../../components/common/ErrorModal';



const { postReaction } = petMyPalApiService;
const timeOut = 5000


class TrendingStory extends Component {
  modal = React.createRef();

  constructor(props) {
    super(props)
    this.onEndReachedCalledDuringMomentum = true;

    this.state = {
      more: false,
      token: '',
      newsFeed: [],
      loading: false,
      reaction: commonState.reaction,
      feelingsData: commonState.feelingsData,
      shareModalVisible: false,
      commentData: [],
      commented: 0,
      commentText: '',
      sendCommentLoading: false,
      disabled: false,
      post: '',
      viewerContent: {reaction: {}},
      selected_post_index:undefined, // which post is selected to show / view detail (navigate to postDeail page frm RendetItmecard)
      selected_Post_detail:undefined , // which post is selected to show / view detail (navigate to postDeail page frm RendetItmecard)
      selected_post:undefined, // for Delete Post 
      selected_index:undefined, // for Delete Post
      del_Modal_visible:false,
      infoMsg:'Do you want to delete this post ?',
      InProcess:false,
      isPostReported:false,

      postText:undefined,
      showEditModal:false,
      postTextError:false,

    }
  }

  componentDidMount() {
    const _item = this.props.navigation?.state?.params?.item
    const header = this.props.navigation?.state.params.header

    this.getAccessToken().then(async (TOKEN) => {
      this.setState({
        token: JSON.parse(TOKEN).access_token,
      });
      this.requestTrendsList(JSON.parse(TOKEN).access_token)
    });

  }

  async getAccessToken() {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }

  goBack = () => { this.props.navigation.pop() }

  updateState = state => { this.setState(state);};

  requestTrendsList = async (token ,) => {

    const { newsFeed, more } = this.state
    const _item = this.props.navigation?.state?.params?.item
    let hashtTag = ''
    if(_item?.tag){
       hashtTag = _item.tag
    }else if(_item){
      hashtTag = _item
    }
    
    {
      more ? null :
        this.setState({ loading: true })
    }

    const formData = new FormData()
    formData.append('server_key', server_key);
    formData.append('type', 'hashtag');
    formData.append('hash', hashtTag)
    formData.append('limit', 20)
    more ? formData.append(
      'after_post_id',
      newsFeed[newsFeed.length - 1].post_id,
    )
      : null;

    const response = await petMyPalApiService.getUserNewsFeed(token, formData).catch((err) => {
      console.log('error while getting hash tags', err)
    })
    const { data } = response
    let tagList = []

    if (data?.api_status === 200) {
      if (data?.data.length > 0) {
        tagList = data?.data
      }
    }

    let tempArr = newsFeed
    tempArr = tempArr.concat(tagList)
    this.setState({
      newsFeed: tempArr,
      loading: false,
      more: false,
    })
  }

  requestHashTags = async (token ,tag) => {

    const { newsFeed, more } = this.state
    let hashtTag = tag
    
    {
      more ? null :
        this.setState({ loading: true })
    }

    const formData = new FormData()
    formData.append('server_key', server_key);
    formData.append('type', 'hashtag');
    formData.append('hash', hashtTag)
    formData.append('limit', 20)
    more ? formData.append(
      'after_post_id',
      newsFeed[newsFeed.length - 1].post_id,
    )
      : null;

    const response = await petMyPalApiService.getUserNewsFeed(token, formData).catch((err) => {
      console.log('error while getting hash tags', err)
    })
    const { data } = response
    let tagList = []

    if (data?.api_status === 200) {
      if (data?.data.length > 0) {
        tagList = data?.data
      }
    }

    let tempArr = newsFeed
    tempArr = tempArr.concat(tagList)

    this.setState({
      newsFeed: tempArr,
      loading: false,
      more: false,
    })
  }


  updateNewsFeed = async (token) => {
    const _item = this.props.navigation?.state?.params?.item

    const formData = new FormData()
    formData.append('server_key', server_key);
    formData.append('type', 'hashtag');
    formData.append('hash', _item?.tag)
    formData.append('limit', 20)

    const response = await petMyPalApiService.getUserNewsFeed(token, formData).catch((err) => {
      console.log('error while getting hash tags', err)
    })
    const { data } = response
    let tagList = []

    if (data?.api_status === 200) {
      this.setState({newsFeed:[]})
      if (data?.data.length > 0) {
        tagList = data?.data
      }
    }

    this.setState({
      newsFeed: tagList,
      loading: false,
      more: false,
    })
  }

  reactions = (item, index) => {
    return (
      <Reactions
        item={item}
        index={index}
        ReactOnComment={(index, item, reaction) => this.ReactOnPost(index, item, reaction)} />
    )
  }

  ReactOnPost(index, item, reaction) {
    const { newsFeed, token } = this.state;
    newsFeed[index].reaction.is_reacted
      ? (newsFeed[index].reaction.count = newsFeed[index].reaction.count)
      : (newsFeed[index].reaction.count = newsFeed[index].reaction.count + 1);
    newsFeed[index].reactionVisible = false;
    newsFeed[index].reaction.type = reaction;
    newsFeed[index].reaction.is_reacted = true;
    this.setState({ newsFeed }, () =>
      this.props.postReaction(token, item.post_id, reaction)

    )
  }

  
  getFeelingIcon = value => {
    let e = this.state.feelingsData.filter(e => e.text === value);
    if (e.length === 0) return '';
    else return e[0].emoji;
  };

  mentionHashtagClick = (text) => {
    const {token} = this.state
    let _tag = text.replace('#','')
    this.setState({newsFeed:[]},()=>this.requestHashTags(token ,_tag))
};

selectedPost =(post,index)=>{ 
  this.setState({
    selected_Post_detail:post,
    selected_post_index: index
  })
}

updateSinglePost = async () => {
  const {
    selected_post_index,
    selected_Post_detail,
    newsFeed,
    token,
  } = this.state

  const tempPosts = newsFeed.slice(0)
  let index = selected_post_index
  let post = selected_Post_detail

  if (post?.post_id) {   // just to avoid unnecessory server call when just Navigate to this screen
    const formData = new FormData();
    formData.append('server_key', server_key);
    formData.append('fetch', 'post_data,post_comments,post_liked_users,post_liked_users');
    formData.append('post_id', post?.post_id);
    const response = await petMyPalApiService.getSinglePost(token, formData).catch((err) => {
      console.log('error while getting single post', err)
    })

    const { data } = response
    if (data?.api_status === 200) {
      tempPosts[index].get_post_comments = data?.post_comments
      tempPosts[index].reaction = data?.post_data?.reaction
      tempPosts[index].post_share = data?.post_data?.post_share
      tempPosts[index].post_comments = data?.post_data?.post_comments

      this.setState({ newsFeed: tempPosts })
    }
  }

}

hidePostReaction =(i)=>{
  const {newsFeed } = this.state
      this.removeTimeOut = setTimeout(() => {
          let tempNewsFeed = newsFeed.slice()
          tempNewsFeed.map((item, i) => {
            tempNewsFeed[i].reactionVisible = false
          })

          this.setState({ newsFeed: tempNewsFeed })
          clearTimeout(this.removeTimeOut)
      },timeOut);

  }

  ReportPost = async (item)=>{
    const { token } = this.state
    const formData = new FormData();
    formData.append('server_key', server_key);
    formData.append('post_id', item?.post_id);
    formData.append('action', 'report');

    const response = await petMyPalApiService._postReaction(token, formData).catch((error) => {
        console.log('error whil send Reaction on post', error)
    })
    const { data } = response
    if(data?.api_status==200){
      this.setState({isPostReported:true})
    }
    console.log('here is reported response',data);
}

closeReprtModal=()=>{
  this.setState({isPostReported:false})
 }

DeletePost = async (item , index)=>{
  setTimeout(() => {
    this.setState({ 
      del_Modal_visible:true,
      selected_post:item , 
      selected_index:index
    })
  },500);
  
}

closeDeleteModal =()=>{
  this.setState({ del_Modal_visible:false,})
}

handleDeletePost = async ()=>{
  const {token , newsFeed , selected_post , selected_index} = this.state
  this.setState({InProcess:true})
  const formData = new FormData();
  formData.append('server_key', server_key);
  formData.append('type','delete_post');
  formData.append('id', selected_post.post_id);

  const response = await petMyPalApiService.deletePost(token , formData).catch((error)=>{
    console.log('error whil deleting a post', error)

  })
  const {data} =response
  if(data.api_status==200){
     newsFeed.splice(selected_index ,1)
    this.setState({newsFeed , InProcess:false , del_Modal_visible:false}) 
  }
}

UpdatePost= async(item, index)=>{
  setTimeout(() => {
    this.setState({ 
      showEditModal:true,
      selected_post:item , 
      selected_index:index,
      postText:item?.Orginaltext
    })
  },500);
}

handleCancelBtn=()=>{
  this.setState({
    showEditModal:false , 
    postTextError:false,
  })
}

handleUpdateBtn= async ()=>{
  const {token , newsFeed , selected_post , selected_index, postText} = this.state
  if(postText.trim().length>0){
  this.setState({InProcess:true})
  const formData = new FormData();
  formData.append('server_key', server_key);
  formData.append('type','edit_post');
  formData.append('id', selected_post.post_id);
  formData.append('text', postText);

  const response = await petMyPalApiService.updatePost(token , formData).catch((error)=>{
    console.log('error whil updating a post', error)

  })
  const {data} =response
  if(data.api_status==200){
    let tempnewsFeed = newsFeed.slice()
    tempnewsFeed[selected_index].Orginaltext = postText
    this.setState({newsFeed:tempnewsFeed , InProcess:false , showEditModal:false}) 
  }
}else{
 this.setState({postTextError:true})
}

}



  rederTrends = ({ item, index }) => {
    const { newsFeed } = this.state
    return (
      <RenderItemCard
        nodeRef={(ref,id)=>{}}
        getFeelingIcon={this.getFeelingIcon}
        item={item}
        index={index}
        state={this.state}
        props={this.props}
        handleTrends={this.mentionHashtagClick}
        selectedPost ={this.selectedPost}
        ReportPost={this.ReportPost}
        DeletePost={this.DeletePost}
        UpdatePost={this.UpdatePost}

        // openComments={(item, index) => {
        //   this.setState(
        //     { postIndex: index },
        //     this.onCommentDataChange(item.get_post_comments, item),
        //     this.commentOpen(item),
        //   );
        // }}

        modalVisible={(photoList, item) =>
          this.setState({
            modalVisible: true,
            viewerContent: {
              photos: photoList,
              index,
              isPost: true,
              ...item,
            },
          })
        }

        // is_reacted={item => {
        //   item.reaction.is_reacted
        //     ? () => {
        //       item.reaction.is_reacted = false;
        //       item.reaction.count = item.reaction.count - 1;
        //       item.reaction.type = '';
        //       this.setState({ newsFeed });
        //     }
        //     : () => {
        //       item.reaction.count = item.reaction.count + 1;
        //       item.reaction.type = 'Like';
        //       item.reaction.is_reacted = true;
        //       this.setState({ newsFeed }, () =>
        //         this.props.postReaction(this.state.token, item.post_id, 'Like')
        //       );
        //     };
        // }}

        onPressOut={() => {this.hidePostReaction()}}
        onLongPress={() => {
          newsFeed[index].reactionVisible = true;
          this.setState({ newsFeed });
        }}
        reactions={() => this.reactions(item, index)}
        shareModalVisible={() =>
          this.setState({
            shareModalVisible: true,
            viewerContent: {
              index,
              ...item,
            },
          })
        }
      />

    )
  }

  onEndReached = ({ distanceFromEnd }) => {
    const { more, token } = this.state

    if (!this.onEndReachedCalledDuringMomentum) {
      this.setState({ more: true }, () =>
        this.requestTrendsList(token)
      )
      this.onEndReachedCalledDuringMomentum = true;
    }
  }

  render() {
    const { 
      newsFeed,
      loading, more,
      del_Modal_visible,
      infoMsg,
      InProcess,
      postText,
      showEditModal,
      postTextError,
      isPostReported,
     } = this.state
    const header = this.props.navigation?.state.params.header
    const _item = this.props.navigation?.state?.params?.item


    return (
      <Container>
       <NavigationEvents onDidFocus={() => this.updateSinglePost()} />
        <PMPHeader
          ImageLeftIcon={true}
          LeftPress={() => this.goBack()}
          centerText={header?header:`#${_item.tag}`}
        />

        <View style={{ flex: 1 }}>

          {loading ?
            <View style={styles.loadingView}>
              <CustomLoader />
            </View>
            : newsFeed?.length > 0 ?

              <FlatList
                data={newsFeed}
                keyExtractor={(item) => { item.id }}
                renderItem={this.rederTrends}
                showsVerticalScrollIndicator={false}
                onEndReached={this.onEndReached.bind(this)}
                onEndReachedThreshold={0.5}
                onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}

              /> :
              <View style={styles.loadingView}>
                <Text style={styles.noTrend}>No Trend found</Text>
              </View>
          }
          {more ?
            <CustomLoader /> : null
          }

        </View>

        <ShareModal
          viewerContent={this.state.viewerContent}
          modalVisible={this.state.shareModalVisible}
          updateState={this.updateState}
          navigation={this.props.navigation}
        />
        <ConfirmModal
           isVisible={del_Modal_visible}
           info={infoMsg}
           DoneTitle={'Delete'}
           onDoneBtnPress={this.handleDeletePost}
           CancelTitle={'Cancel'}
           onCancelBtnPress={this.closeDeleteModal}
           processing={InProcess}
        />
        <EditPost
          onChangeText={(v)=>this.setState({postText:v})}
          value={postText}
          showEditModal={showEditModal}
          handleUpdateBtn={this.handleUpdateBtn}
          handleCancelBtn={this.handleCancelBtn}
          InProcess={InProcess}
          postTextError={postTextError}
      />
       <ErrorModal
            isVisible={isPostReported}
            onBackButtonPress={() => this.closeReprtModal()}
            info={reportPostText}
            postReport={true}
            heading={'Woof!'}
            onPress={() => this.closeReprtModal()}
          />
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return { user: state.user }
};

export default connect(
  mapStateToProps,
  { postReaction },
)(TrendingStory);
