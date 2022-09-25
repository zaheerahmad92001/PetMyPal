import React, { Component, createRef } from 'react';
import {
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
    Platform,
} from 'react-native'
import PMPHeader from '../../components/common/PMPHeader';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import RenderPost from '../../components/common/RenderPost';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { Icon } from 'native-base'
import CustomLoader from '../../components/common/CustomLoader';

import { commonState } from '../../components/common/CommomState'
import styles from './styles'
import Reactions from '../../components/common/Reactions'
import ShareModal from '../shareModal/index';
import ImageViewerModal from '../imageViewerModal/ImageViewerModal';
import AllCommentsView from '../../components/common/AllComments';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import { server_key } from '../../constants/server';
import { grey } from '../../constants/colors';
import Toast from 'react-native-simple-toast'
import Mention from '../common/InputMention';
import { widthPercentageToDP } from 'react-native-responsive-screen';




const { postReaction, getSinglePost } = petMyPalApiService;
const timeOut = 5000


class PostDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: '',
            post: this?.props?.navigation?.state?.params,
            feelingsData: commonState.feelingsData,
            reaction: commonState.reaction,
            viewerContent: {},
            shareModalVisible: false,
            modalVisible: false,
            token: undefined,
            loadMore: false,
            commentData: [],
            Loader: false,
            isPostReported: false,
            sending: false,
        }
        this.onEndReachedCalledDuringMomentum = true;
        this.flatListRef = createRef()
        this.inputRef = createRef()
    }

    componentDidMount() {
        this.setState({ Loader: true })
        const _data = this.props.navigation.state.params

        this.getAccessToken().then((token) => {
            this.setState({ token: JSON.parse(token).access_token },
                () => {
                    this.getSinglePost(_data?.post_id)
                })
        })
    }

    showToast = msg => { Toast.show(msg, Toast.SHORT) };

    async getAccessToken() {
        const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
        return access_token;
    }

    componentWillUnmount() {
        this.removeTimeOut
        clearTimeout(this.removeTimeOut)
    }

    goBack = () => { this.props.navigation.pop() }

    sendComment = async () => {

        this.inputRef.current.focus()  // important don`t change it #zaheer ahmad

        let { token, commentData, message, post } = this.state
        this.setState({ sending: true })

        const formData = new FormData();
        formData.append('server_key', server_key);
        formData.append('type', 'create');
        formData.append('post_id', post.post_id);
        formData.append('text', message);

        const response = await petMyPalApiService.postComments(token, formData).catch((e) => {
            console.log('error occure while send Comment on Poset', e)
        })
        const { data } = response
        if (data?.api_status == 200) {
            if (data?.data == false) {
                return this.showToast("Same comment already posted. Avoid spamming")
            }
            let post_comments = Number(post.post_comments) + 1
            let temPost = { ...post, post_comments }

            let arr = [...commentData, data?.data]
            this.setState({ commentData: arr, post: temPost, message: '', sending: false })

        } else {
            console.warn('error while send comments', data)
        }

    }

    handleReactionOnComment = async (index, item, reaction) => {
        const { token, commentData } = this.state

        commentData[index].reaction.is_reacted
            ? (commentData[index].reaction.count =
                commentData[index].reaction.count)
            : (commentData[index].reaction.count =
                commentData[index].reaction.count + 1);
        commentData[index].reactionVisible = false;
        commentData[index].reaction.type = reaction;
        commentData[index].reaction.is_reacted = true;

        const formData = new FormData();
        formData.append('server_key', server_key);
        formData.append('type', 'reaction_comment');
        formData.append('comment_id', item.id);
        formData.append('reaction', reaction);

        const response = await petMyPalApiService.postComments(token, formData).catch((e) => {
            console.log('error occure while send reaction on comments', e)
        })
        const { data } = response
        if (data?.api_status == 200) {
        } else {
            console.warn('error while send reaction', data)
        }
    }


    handle_Open_ReactionOnComment = (index) => {
        const { post, commentData } = this.state
        let tempComments = commentData.slice()
        tempComments.map((item, i) => {
            if (index == i) {
                tempComments[i].reactionVisible = true

            } else {
                tempComments[i].reactionVisible = false
            }
        })


        // this.setState(prevState =>({
        //   data:{...prevState.data},
        //   get_post_comments:[...prevState.data.get_post_comments,tempComments]
        // }))

        // this.setState({ ...post, ...tempComments })
        this.setState({ commentData: tempComments })
    }

    focusOnInput = () => {
        const { modalVisible } = this.state
        if (modalVisible) {
            this.setState({ modalVisible: false })
            let timer = setTimeout(() => {
                this.inputRef?.current?.focus()
                clearInterval(timer)
            }, 500);

        } else {
            this.inputRef?.current?.focus()
        }
    }

    handle_Hide_ReactionOnComment = (index) => {
        const { commentData } = this.state

        this.removeTimeOut = setTimeout(() => {
            let tempComments = commentData.slice()
            tempComments.map((item, i) => {
                tempComments[i].reactionVisible = false
            })

            this.setState({ commentData: tempComments })
            clearTimeout(this.removeTimeOut)
        }, timeOut);

    }

    hidePostReaction = (i) => {
        const { post } = this.state
        setTimeout(() => {
            post.reactionVisible = false
            this.setState({ post });
        }, timeOut)

    }

    handleTrendsNow = (item) => {
        let [mention, postRec] = JSON.parse(item)
        let userId = this.props.user.user.user_data.user_id
        let __mentions = postRec.mentions

        if (mention.includes('#')) {

            let hashTag = mention.replace('#', '');
            let _header = mention;

            this.props.navigation.navigate('TrendingStory', {
                item: hashTag,
                header: _header,
            });
        } else if (mention.includes('@')) {

            let id = ''
            let hashTag = mention.replace('@', '');
            __mentions?.map((e, i) => {
                if (e.user_name.includes(hashTag)) {
                    id = e.user_id
                }
            })

            if (userId == id) {
                this.props.navigation.navigate('UserProfile')
            } else {
                this.props.navigation.navigate({
                    routeName: 'Profile',
                    key: 'ProfileP',
                    params: { user_id: id },
                });
            }
        }
    }

    getFeelingIcon = value => {
        let e = this.state.feelingsData.filter(e => e.text === value);
        if (e.length === 0) return '';
        else return e[0].emoji;
    };

    reactions = (item, index) => {
        return (
            <Reactions
                item={item}
                index={index}
                ReactOnComment={(index, item, reaction) => this.ReactOnPost(index, item, reaction)}
            />
        )
    }

    ReactOnPost = (index, item, reaction) => {
        const { token, post } = this.state
        const { post_id } = item
        let tempPost = item
        tempPost.reaction.is_reacted
            ?
            tempPost.reaction.count = tempPost.reaction.count
            :
            tempPost.reaction.count = tempPost.reaction.count + 1

        tempPost.reaction.is_reacted = true
        tempPost.reaction.type = reaction
        this.setState({ post, tempPost })

        this.props.postReaction(token, post_id, reaction)
    }

    updateState = state => { this.setState(state) };

    renderHeader = () => {
        const { post } = this.state

        return (
            <RenderPost
                nodeRef={(ref, id) => { }}
                getFeelingIcon={this.getFeelingIcon}
                item={post}
                state={this.state}
                props={this.props}
                handleTrends={this.handleTrendsNow}
                focusOnInput={this.focusOnInput}
                ReportPost={this.ReportPost}
                DeletePost={this.DeletePost}
                UpdatePost={this.UpdatePost}

                modalVisible={(photoList, post) => {
                    this.setState({
                        modalVisible: true,
                        viewerContent: {
                            photos: photoList,
                            isPost: true,
                            ...post,
                        },
                    })
                }
                }
                onPressOut={() => { this.hidePostReaction() }}
                onLongPress={() => {
                    post.reactionVisible = true;
                    this.setState({ post });
                }}
                reactions={(item, index) => this.reactions(item, index)}
                shareModalVisible={() =>
                    this.setState({
                        shareModalVisible: true,
                        viewerContent: { ...post, },
                    })
                }
            />
        )
    }

    renderItem = ({ item, index }) => {
        return (
            <View style={{ marginHorizontal: 15 }}>
                <AllCommentsView
                    ReactOnComment={(indx, item, reaction) => this.handleReactionOnComment(indx, item, reaction)}
                    OpenReaction={(index) => this.handle_Open_ReactionOnComment(index)}
                    hideReaction={(index) => this.handle_Hide_ReactionOnComment(index)}
                    obj={item}
                    index={index}
                    user={this.props.user}
                    navigation={this.props.navigation}
                />
            </View>
        )
    }

    onEndReached = ({ distanceFromEnd }) => {
        const { commentData, RIC } = this.state
        if (!this.onEndReachedCalledDuringMomentum) {
            this.setState({ loadMore: true }, () => {
                this.requestHandlerFetchPostComment()
            })
            this.onEndReachedCalledDuringMomentum = true;
        }
    }

    async getSinglePost(post_id) {
        const { token, } = this.state
        const formData = new FormData();
        formData.append('server_key', server_key);
        formData.append('fetch', 'post_data,post_comments,post_liked_users,post_liked_users');
        formData.append('post_id', post_id);
        const response = await getSinglePost(token, formData).catch((err) => {
            console.log('error while getting single post', err)
        })
        const { data } = response
        if (data?.api_status === 200) {
            data?.post_data?.get_post_comments?.map((item, index) => {
                item.reactionVisible = false
            })
            this.requestHandlerFetchPostComment()

            this.setState({ post: data?.post_data, Loader: false })
        }

    }

    async requestHandlerFetchPostComment() {
        const _post = this.props.navigation.state.params
        const { token, loadMore, commentData } = this.state

        const formData = new FormData();
        formData.append('server_key', server_key);
        formData.append('type', 'fetch_comments');
        formData.append('post_id', _post.post_id);
        formData.append('limit', 20)
        // formData.append('sort', 'desc');
        loadMore && formData.append('offset', commentData[commentData?.length - 1]?.id) // last index of array
        const response = await petMyPalApiService.postComments(token, formData).catch((e) => {
            console.log('error occure while fetching Post Comments', e)
        })

        const { data } = response
        if (data.api_status === 200) {
            let tempComment = []
            data?.data?.map((comment, index) => {
                tempComment.push({ ...comment, reactionVisible: false })
            })

            let arr = []
            arr = loadMore ? [...commentData, ...tempComment] : tempComment
            this.setState({ commentData: arr, loadMore: false });
        } else {
            console.log('error occure while fetcing comments', data)

        }
    }



    render() {
        const {
            message,
            post,
            commentData,
            Loader,
            sending,
        } = this.state


        return (

            <View style={styles.wraper}>
                <PMPHeader
                    ImageLeftIcon={true}
                    LeftPress={() => this.goBack()}
                    centerText={'Post Detail'}
                    longWidth={true}
                />
                {
                    !Loader ?
                        <>

                            <FlatList
                                data={commentData}
                                extraData={commentData}
                                keyExtractor={(item) => item.id}
                                renderItem={this.renderItem}
                                ref={this.flatListRef}
                                scrollEnabled={true}
                                keyboardDismissMode="on-drag"
                                keyboardShouldPersistTaps='handled'
                                bounces={false}
                                ListHeaderComponent={this.renderHeader}
                                // onContentSizeChange={() => this.flatListRef.current.scrollToEnd({ animated: true })}
                                onLayout={() => this.flatListRef.current.scrollToEnd({ animated: true })}
                                // listKey={(item, index) => { 'A' + item }}
                                onEndReached={this.onEndReached.bind(this)}
                                onEndReachedThreshold={0.5}
                                onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                                contentContainerStyle={styles.flatListStyle}
                                style={{ marginBottom: 20 }}

                            />

                            <View style={styles.inputOuterView}>
                                {/* <Mention
                onChangeText={(text) => this.setState({ message: text })}
                placeholder={"Write a comment"}
                placeholderTextColor={grey}
                multiline={true}
                customContainer={{width:widthPercentageToDP(75), backgroundColor:'red'}}
                style={styles.inputStyle}
              /> */}
                                <TextInput
                                    placeholder={"Write a comment"}
                                    placeholderTextColor={grey}
                                    onChangeText={(text) => this.setState({ message: text })}
                                    value={message}
                                    multiline={true}
                                    blurOnSubmit={false}
                                    autoFocus={false}
                                    ref={this.inputRef}
                                    style={styles.inputStyle}
                                />

                                {sending ? <CustomLoader /> :
                                    <TouchableOpacity
                                        style={{
                                            // backgroundColor:'green'
                                            alignSelf: 'flex-end',
                                        }}
                                        onPress={() => { this.sendComment() }}>
                                        {message.trim().length > 0 ?
                                            <Icon name={'send'} type={'Ionicons'} style={styles.sendIcon} /> :
                                            null
                                        }
                                    </TouchableOpacity>
                                }

                            </View>

                            {Platform.OS === 'ios' ? <KeyboardSpacer /> : null}


                            <ImageViewerModal
                                viewerContent={this.state.viewerContent}
                                modalVisible={this.state.modalVisible}
                                updateState={this.updateState}
                                handleComments={this.focusOnInput}
                            />

                            <ShareModal
                                noNeedToLoadNewsFeed
                                viewerContent={this.state.viewerContent}
                                modalVisible={this.state.shareModalVisible}
                                updateState={this.updateState}
                                navigation={this.props.navigation}
                            />
                        </>
                        :
                        <CustomLoader />
                }

            </View>

        )
    }
}



const mapStateToProps = state => {
    return {
        user: state.user,
        pets: state.mypets
    }
};
export default connect(
    mapStateToProps,
    { postReaction },
)(PostDetail)
