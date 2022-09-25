import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {SERVER} from '../../../src/constants/server'

import DogImage from '../../assets/images/pet-icons/dog.png';
import CatImage from '../../assets/images/pet-icons/cat.png';
import CowImage from '../../assets/images/pet-icons/cow.png';
import FishImage from '../../assets/images/pet-icons/fish.png';
import ParrotImage from '../../assets/images/pet-icons/parrot.png';
import HorseImage from '../../assets/images/pet-icons/horse.png';
import BirdImage from '../../assets/images/pet-icons/pigeon.png';
import PigImage from '../../assets/images/pet-icons/pig.png';
import RabbitImage from '../../assets/images/pet-icons/rabbit.png';
import SnakeImage from '../../assets/images/pet-icons/snake.png';
import RodentImage from '../../assets/images/pet-icons/rat.png';
import TurtleImage from '../../assets/images/pet-icons/turtle.png';
import OtherImage from '../../assets/images/pet-icons/other.png';
 const commonState={
    loading: true,
    loadingPets: true,
    imageViewer: false,
    randomKey:'Followers',
    img: [],
    currentUser: {
      details: {},
    },
    selectedItem:'',
    loadingSuggested: true,
    suggested: [{}, {}, {}, {}],
    pets: [],
    newsFeed: [],
    loadingNewsFeed: true,
    more: false,
    lastPostId: '',
    token: '',
    visible: true,
    showModal: false,
    followLoading: false,
    isFollowed: false,
    
    myFollowers: [],
    myFollowing: [],
    isErrorModal_Visible:false,
    errorMessage:'',
    isConfirm_Modal_visible:false,
    unfollowMsg:'',
    unfollowUserId:'',
    unfollowInProcess:false,


    reaction: {
      Like:
        'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/like.gif',
      Love:
        'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/love.gif',
      HaHa:
        'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/haha.gif',
      Wow:
        'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/wow.gif',
      Sad:
        'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/sad.gif',
      Angry:
        'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/Images/angry.gif',
    },
    
    
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    postIndex: null,
    start: false,
    isRefreshing: false,
    feelingsData: [
      {emoji: 'blush', text: 'happy',id:'1'},
      {emoji: 'heart_eyes', text: 'loved',id:'2'},
      {emoji: 'pensive', text: 'sad',id:'3'},
      {emoji: 'confused', text: 'confused',id:'4'},
      {emoji: 'smiley', text: 'funny',id:'5'},
      {emoji: 'angry', text: 'angry',id:'6'},
      {emoji: 'confused', text: 'confused',id:'7'},
      {emoji: 'broken_heart', text: 'broken',id:'8'},
      {emoji: 'expressionless', text: 'expressionless',id:'9'},
      {emoji: 'tired_face', text: 'tired',id:'10'},
      {emoji: 'sleeping', text: 'sleepy',id:'11'},
      {emoji: 'innocent', text: 'blessed',id:'12'},
      {emoji: 'exploding_head', text: 'socked',id:'13'},
      {emoji: 'smirk', text: 'smirk',id:'14'},
    ],
    scrollViewWidth: 0,
    currentXOffset: 0,
    modalVisible: false,
    viewerContent: {
      reaction: {},
    },
    shareModalVisible: false,
    imagesArray: [
        `${SERVER}/upload/photos/2020/07/lUxsJqxJc86aSVGlD5qP_22_00147c8dcbc863ef2c233d8e52046826_image.jpg', 'https://ladoo.petmypal.com/upload/photos/2020/07/lUxsJqxJc86aSVGlD5qP_22_00147c8dcbc863ef2c233d8e52046826_image.jpg`,
        `${SERVER}/upload/photos/2020/07/lUxsJqxJc86aSVGlD5qP_22_00147c8dcbc863ef2c233d8e52046826_image.jpg', 'https://ladoo.petmypal.com/upload/photos/2020/07/lUxsJqxJc86aSVGlD5qP_22_00147c8dcbc863ef2c233d8e52046826_image.jpg`,
        `${SERVER}/upload/photos/2020/07/lUxsJqxJc86aSVGlD5qP_22_00147c8dcbc863ef2c233d8e52046826_image.jpg', 'https://ladoo.petmypal.com/upload/photos/2020/07/lUxsJqxJc86aSVGlD5qP_22_00147c8dcbc863ef2c233d8e52046826_image.jpg`,
        `${SERVER}/upload/photos/2020/07/lUxsJqxJc86aSVGlD5qP_22_00147c8dcbc863ef2c233d8e52046826_image.jpg', 'https://ladoo.petmypal.com/upload/photos/2020/07/lUxsJqxJc86aSVGlD5qP_22_00147c8dcbc863ef2c233d8e52046826_image.jpg`,
        `${SERVER}/upload/photos/2020/07/lUxsJqxJc86aSVGlD5qP_22_00147c8dcbc863ef2c233d8e52046826_image.jpg', 'https://ladoo.petmypal.com/upload/photos/2020/07/lUxsJqxJc86aSVGlD5qP_22_00147c8dcbc863ef2c233d8e52046826_image.jpg`,
        `${SERVER}/upload/photos/2020/07/lUxsJqxJc86aSVGlD5qP_22_00147c8dcbc863ef2c233d8e52046826_image.jpg', 'https://ladoo.petmypal.com/upload/photos/2020/07/lUxsJqxJc86aSVGlD5qP_22_00147c8dcbc863ef2c233d8e52046826_image.jpg`,
        `${SERVER}/upload/photos/2020/07/lUxsJqxJc86aSVGlD5qP_22_00147c8dcbc863ef2c233d8e52046826_image.jpg', 'https://ladoo.petmypal.com/upload/photos/2020/07/lUxsJqxJc86aSVGlD5qP_22_00147c8dcbc863ef2c233d8e52046826_image.jpg`,
        `${SERVER}/upload/photos/2020/07/lUxsJqxJc86aSVGlD5qP_22_00147c8dcbc863ef2c233d8e52046826_image.jpg', 'https://ladoo.petmypal.com/upload/photos/2020/07/lUxsJqxJc86aSVGlD5qP_22_00147c8dcbc863ef2c233d8e52046826_image.jpg`,
        `${SERVER}/upload/photos/2020/07/lUxsJqxJc86aSVGlD5qP_22_00147c8dcbc863ef2c233d8e52046826_image.jpg', 'https://ladoo.petmypal.com/upload/photos/2020/07/lUxsJqxJc86aSVGlD5qP_22_00147c8dcbc863ef2c233d8e52046826_image.jpg`,
        `${SERVER}/upload/photos/2020/07/lUxsJqxJc86aSVGlD5qP_22_00147c8dcbc863ef2c233d8e52046826_image.jpg', 'https://ladoo.petmypal.com/upload/photos/2020/07/lUxsJqxJc86aSVGlD5qP_22_00147c8dcbc863ef2c233d8e52046826_image.jpg`,
        `${SERVER}/upload/photos/2020/07/lUxsJqxJc86aSVGlD5qP_22_00147c8dcbc863ef2c233d8e52046826_image.jpg', 'https://ladoo.petmypal.com/upload/photos/2020/07/lUxsJqxJc86aSVGlD5qP_22_00147c8dcbc863ef2c233d8e52046826_image.jpg`,
        `${SERVER}/upload/photos/2020/07/lUxsJqxJc86aSVGlD5qP_22_00147c8dcbc863ef2c233d8e52046826_image.jpg', 'https://ladoo.petmypal.com/upload/photos/2020/07/lUxsJqxJc86aSVGlD5qP_22_00147c8dcbc863ef2c233d8e52046826_image.jpg`,
        `${SERVER}/upload/photos/2020/07/lUxsJqxJc86aSVGlD5qP_22_00147c8dcbc863ef2c233d8e52046826_image.jpg', 'https://ladoo.petmypal.com/upload/photos/2020/07/lUxsJqxJc86aSVGlD5qP_22_00147c8dcbc863ef2c233d8e52046826_image.jpg`,
      ],
      DATAimagesArray: [
        {
          dimensions: { width: wp(43.8), height: wp(60) },
          uri: 'https://s35691.pcdn.co/wp-content/uploads/2018/09/one-sentence-lesson-plan.jpg',

        },
        {
          uri: 'https://pbs.twimg.com/profile_images/1063072496809840640/eZHKA0Jp_400x400.jpg',
          dimensions: { width: wp(43.8), height: wp(30) },
        },
        {
          uri: 'https://cdn.images.express.co.uk/img/dynamic/59/590x/Three-down-851292.jpg',
          dimensions: { width: wp(43.8), height: wp(30) },

        },
        {
          uri: 'https://cdn.pixabay.com/photo/2015/04/04/19/13/four-706894_1280.jpg',
          dimensions: { width: wp(43.8), height: wp(60) },
        },
        {
          uri: 'https://mk0fivefiveagen2f17j.kinstacdn.com/wp-content/uploads/2020/05/five-placeholder-web.png',
          dimensions: { width: wp(43.8), height: wp(30) },

        },
        {
          uri: 'https://i.ytimg.com/vi/BGshGxVnj-M/maxresdefault.jpg',
          dimensions: { width: wp(43.8), height: wp(30) },
        },

        {
          dimensions: { width: wp(43.8), height: wp(30) },
          uri: 'https://s35691.pcdn.co/wp-content/uploads/2018/09/one-sentence-lesson-plan.jpg',

        },
        {
          uri: 'https://pbs.twimg.com/profile_images/1063072496809840640/eZHKA0Jp_400x400.jpg',
          dimensions: { width: wp(43.8), height: wp(60) },
        },
        {
          uri: 'https://cdn.images.express.co.uk/img/dynamic/59/590x/Three-down-851292.jpg',
          dimensions: { width: wp(43.8), height: wp(30) },

        },
        {
          uri: 'https://cdn.pixabay.com/photo/2015/04/04/19/13/four-706894_1280.jpg',
          dimensions: { width: wp(43.8), height: wp(60) },
        },
        {
          uri: 'https://mk0fivefiveagen2f17j.kinstacdns.com/wp-content/uploads/2020/05/five-placeholder-web.png',
          dimensions: { width: wp(43.8), height: wp(30) },

        },
        {
          uri: 'https://i.ytimg.com/vi/BGshGxVnj-M/maxresdefault.jpg',
          dimensions: { width: wp(43.8), height: wp(30) },
        },

        {
          dimensions: { width: wp(43.8), height: wp(30) },
          uri: 'https://s35691.pcdn.co/wp-content/uploads/2018/09/one-sentence-lesson-plan.jpg',

        },
        {
          uri: 'https://pbs.twimg.com/profile_images/1063072496809840640/eZHKA0Jp_400x400.jpg',
          dimensions: { width: wp(43.8), height: wp(60) },
        },
        {
          uri: 'https://cdn.images.express.co.uk/img/dynamic/59/590x/Three-down-851292.jpg',
          dimensions: { width: wp(43.8), height: wp(30) },

        },
        {
          uri: 'https://cdn.pixabay.com/photo/2015/04/04/19/13/four-706894_1280.jpg',
          dimensions: { width: wp(43.8), height: wp(60) },
        },
        {
          uri: 'https://mk0fivefiveagen2f17j.kinstacdns.com/wp-content/uploads/2020/05/five-placeholder-web.png',
          dimensions: { width: wp(43.8), height: wp(30) },

        },
        {
          uri: 'https://i.ytimg.com/vi/BGshGxVnj-M/maxresdefault.jpg',
          dimensions: { width: wp(43.8), height: wp(30) },
        },
        {
          dimensions: { width: wp(43.8), height: wp(60) },
          uri: 'https://s35691.pcdn.co/wp-content/uploads/2018/09/one-sentence-lesson-plan.jpg',

        },
        {
          uri: 'https://pbs.twimg.com/profile_images/1063072496809840640/eZHKA0Jp_400x400.jpg',
          dimensions: { width: wp(43.8), height: wp(30) },
        },
        {
          uri: 'https://cdn.images.express.co.uk/img/dynamic/59/590x/Three-down-851292.jpg',
          dimensions: { width: wp(43.8), height: wp(30) },

        },
        {
          uri: 'https://cdn.pixabay.com/photo/2015/04/04/19/13/four-706894_1280.jpg',
          dimensions: { width: wp(43.8), height: wp(60) },
        },
        {
          uri: 'https://mk0fivefiveagen2f17j.kinstacdn.com/wp-content/uploads/2020/05/five-placeholder-web.png',
          dimensions: { width: wp(43.8), height: wp(30) },

        },
        {
          uri: 'https://i.ytimg.com/vi/BGshGxVnj-M/maxresdefault.jpg',
          dimensions: { width: wp(43.8), height: wp(30) },
        },

      ],
      publish: [
        {
          'On a page': false,
          'On pixy': false,
          'On my groups': false,
          'On my page': false,
          'On profile': false,
        },
      ],
      policies: [
        {name: 'Cancellation', cancel: false, charges: '0'},
        {name: 'Changes', cancel: false, charges: '0'},
        {name: 'Vaccination', cancel: false, charges: '0'},
        {name: 'Insurance', cancel: false, charges: '0'},
      ],
      petTypes: [
        {
          id: 1,
          name: 'Cat',
          default_page: 'catsLA',
          image: 'v9e6aA2y5eee6ca7bd097.png',
          sort_order: 2,
          have_size: '0',
          created_at: '2020-01-28 01:00:00',
          updated_at: '2020-06-21 00:08:07',
          image_url:
            'https://petmypal.com/admin/public/uploads/pets/v9e6aA2y5eee6ca7bd097.png',
          image_thumb: CatImage,
          url: require('../../assets/images/updated/iconsSignup/cat.png'),
          
        },
        {
          id: 2,
          name: 'Dog',
          default_page: 'DogPals',
          image: 'W9kUUvhx5eee6c9d0d530.png',
          sort_order: 1,
          have_size: '1',
          created_at: '2020-01-29 16:39:46',
          updated_at: '2020-06-21 00:07:57',
          image_url:
            'https://petmypal.com/admin/public/uploads/pets/W9kUUvhx5eee6c9d0d530.png',
          url: require('../../assets/images/updated/iconsSignup/Dog.png'),
          image_thumb: DogImage,
        },
        {
          id: 8,
          name: 'Cow',
          default_page: 'Cows',
          image: 'CjoK4Iu25f199b35cb4cc.png',
          sort_order: 3,
          have_size: '0',
          created_at: '2020-07-23 14:14:13',
          updated_at: '2020-07-23 14:14:13',
          image_url:
            'https://petmypal.com/admin/public/uploads/pets/CjoK4Iu25f199b35cb4cc.png',
          url: require('../../assets/images/updated/iconsSignup/cow.png'),
          image_thumb: CowImage,
        },
        {
          id: 4,
          name: 'Fish',
          default_page: null,
          image: 'K58tjaSU5eee6cc2dc638.png',
          sort_order: 4,
          have_size: '0',
          created_at: '2020-04-01 14:39:12',
          updated_at: '2020-06-21 00:08:34',
          image_url:
            'https://petmypal.com/admin/public/uploads/pets/K58tjaSU5eee6cc2dc638.png',
          url: require('../../assets/images/updated/iconsSignup/fish.png'),
         
          image_thumb: FishImage,
        },
        {
          id: 9,
          name: 'Parrot',
          default_page: null,
          image: 'w1a5QU335eee6cc8a1887.png',
          sort_order: 5,
          have_size: '0',
          created_at: null,
          updated_at: '2020-06-21 00:08:40',
          image_url:
            'https://petmypal.com/admin/public/uploads/pets/w1a5QU335eee6cc8a1887.png',
          url: require('../../assets/images/updated/iconsSignup/Parrot.png'),
          image_thumb: ParrotImage,
        },
        {
          id: 3,
          name: 'Horse',
          default_page: 'HorseLove',
          image: 'WRs322Ml5f199a6dc14c4.png',
          sort_order: 6,
          have_size: '0',
          created_at: '2020-07-23 14:10:53',
          updated_at: '2020-07-23 14:10:53',
          image_url:
            'https://petmypal.com/admin/public/uploads/pets/WRs322Ml5f199a6dc14c4.png',
          url: require('../../assets/images/updated/iconsSignup/Horse.png'),
          image_thumb: HorseImage,
        },
        {
          id: 7,
          name: 'Bird',
          default_page: 'BirdsEye',
          image: 'yNCIOmW15f199a9ad9cbb.png',
          sort_order: 7,
          have_size: '0',
          created_at: '2020-07-23 14:11:38',
          updated_at: '2020-07-23 14:11:38',
          image_url:
            'https://petmypal.com/admin/public/uploads/pets/yNCIOmW15f199a9ad9cbb.png',
          url: require('../../assets/images/updated/iconsSignup/bird.png'),
          image_thumb: BirdImage,
        },
        {
          id: 13,
          name: 'Pig',
          default_page: 'PiggyBay',
          image: 'qrFvje4t5f199abc763e1.png',
          sort_order: 8,
          have_size: '0',
          created_at: '2020-07-23 14:12:12',
          updated_at: '2020-07-23 14:12:12',
          url: require('../../assets/images/updated/iconsSignup/pig.png'),
          image_url:
            'https://petmypal.com/admin/public/uploads/pets/qrFvje4t5f199abc763e1.png',
          image_thumb: PigImage,
        },
        {
          id: 10,
          name: 'Rabbit',
          default_page: 'Rodents and Rabbits',
          image: 'KF1pdyWf5f199aeeb0706.png',
          sort_order: 9,
          have_size: '0',
          created_at: '2020-07-23 14:13:02',
          updated_at: '2020-07-23 14:13:02',
          url: require('../../assets/images/updated/iconsSignup/Rabbit.png'),
          image_url:
            'https://petmypal.com/admin/public/uploads/pets/KF1pdyWf5f199aeeb0706.png',
          image_thumb: RabbitImage,
        },
        {
          id: 11,
          name: 'Snake',
          default_page: 'Rodents and Rabbits',
          image: '9yz1UEmU5f199b0854dc1.png',
          sort_order: 10,
          have_size: '0',
          created_at: '2020-07-23 14:13:28',
          updated_at: '2020-07-23 14:13:28',
          url: require('../../assets/images/updated/iconsSignup/Snake.png'),
          image_url:
            'https://petmypal.com/admin/public/uploads/pets/9yz1UEmU5f199b0854dc1.png',
          image_thumb: SnakeImage,
        },
        {
          id: 21,
          name: 'Rodent',
          default_page: 'Rodents and Rabbits',
          image: 'FBx1NsjZ5f199b5b011a0.png',
          sort_order: 13,
          have_size: '0',
          created_at: '2020-07-23 14:14:51',
          updated_at: '2020-07-23 14:14:51',
          url: require('../../assets/images/updated/iconsSignup/Rodent.png'),
          image_url:
            'https://petmypal.com/admin/public/uploads/pets/FBx1NsjZ5f199b5b011a0.png',
          image_thumb: RodentImage,
        },
        {
          id: 12,
          name: 'Turtle',
          default_page: null,
          image: 'cE507EO55f19aca71810d.png',
          sort_order: 14,
          have_size: '0',
          created_at: null,
          updated_at: '2020-07-23 15:28:39',
          url: require('../../assets/images/updated/iconsSignup/Turtle.png'),
          image_url:
            'https://petmypal.com/admin/public/uploads/pets/cE507EO55f19aca71810d.png',
          image_thumb: TurtleImage,
        },
        {
          id: 17,
          name: 'Others',
          default_page: 'BasicAnimalCare',
          image: 'wTNyqZ6t5f199b84ac0aa.png',
          sort_order: 99,
          have_size: '0',
          created_at: '2020-07-23 14:15:32',
          updated_at: '2020-07-23 15:29:07',
          url: require('../../assets/images/updated/iconsSignup/otherPet.png'),
          image_url:
            'https://petmypal.com/admin/public/uploads/pets/wTNyqZ6t5f199b84ac0aa.png',
          image_thumb: OtherImage,
        },
      ],
     PetList:[
        {value:"2"  ,label:'Dog'},
        {value:"1"  ,label:'Cat'},
        {value:"8"  ,label:'Cow'},
        {value:"4"  ,label:'Fish'},
        {value:"9"  ,label:'Parrot'},
        {value:"3"  ,label:'Horse'},
        {value:"7"  ,label:'Bird'},
        {value:"13"  ,label:'Pig'},
        {value:"10"  ,label:'Rabbit'},
        {value:"11"  ,label:'Snake'},
        {value:"21"  ,label:'Rodent'},
        {value:"12"  ,label:'Turtle'},
        {value:"17"  ,label:'Others'},
       
     
   ]
  };

  export {commonState}
