import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator, TransitionPresets } from 'react-navigation-stack';
import Splash from './splash';
import AppIntro from './AppIntro';
import AuthView from './AuthView';
// import SignupView from './SignupView';
import LoginView from './LoginView';
import LoginMethod from './LoginMethod';
import ForgotPassword from './ForgotPassword/SendPhone';
import VerifyAccount from './ForgotPassword/VerifyAccount';
import VerifyAccountByEmail from './ForgotPassword/VerifyByEmail';
import Password from './ForgotPassword/password';  //TODO Manually fixed Password  line 13

import Chat from './Messages/Chat';
import FooterBarView from './FooterBarView';
import StatusView from './StatusView';
import EventPostScreen from './StatusView/EventPostScreen';
import ChoosePet from './SignupConnectView/choosePet';
import VerifyPhoneNumber from './SignupConnectView/verifyPhoneNumber'
import PetDetails from './SignupConnectView/petDetails';
import UserDetails from './SignupConnectView/userDetails';
import PetAddView from './PetAddView';
import MyPets from './MyPets/MyPets';
import MyPetsWebView from './MyPets/MyPetsWebView';
import SearchView from './SearchView';
import UserPagesView from './UserPagesView';
import EventsView from './EventsView';
import EditEvent from './EventsView/EditEvent';
import InviteFriends from './EventsView/InviteFriends';
import EventDetails from './EventsView/EventDetails';
import CreateEvent from './EventsView/CreateEvent'
import UserGroupsView from './UserGroupsView';
import PixxyView from './PixxyView';
import PixxyCreateView from './PixxyCreateView';
import UserProfile from './UserProfile';
import Profile from './Profile';
import Page from './Page';
import Group from './Group';
import Followers from './Followers';  /********** my circle  screen **********/
import PetProfile from './PetProfile';
import TermsConditions from './TermsConditions';
import StoryView from './StoryView';
import EditProfile from './EditProfile';
import VerifyOTP from './EditProfile/verifyOTP'

import EditPet from './EditPet';
import EditPage from './EditPage';
import EditGroup from './EditGroup';
import ViewPost from './ViewPost';
import ChangePassword from './ChangePassword';
import PixxyWorldView from './PixxyWorldView';
import ProductDetail from './ProductDetail';
import ProductList from './ProductList';
import CartView from './CartView';
import ShippingAddress from './ShippingAddress';
import FAQ from './FAQView'
import ContactUs from './ContactUs'
import AboutUs from './AboutUs';
import PreviousOrder from './PreviousOrder';
import Notification from './Notification';
import PrivacyPolicy from './PrivacyPolicy';
import BlockUsers from './BlockUsers';
import TrendingStory from './TrendingStory';
import Trends from './Trends';
import DeactivateUser from './DeactivateUser';
import AccountRecovery from './AccountRecovery';
import ActivateAccountByPhone from './AccountRecovery/Activate_Acc_Phone'
import ActivateAccountByEmail from './AccountRecovery/Activate_Acc_email'
import BreedIdentifier from './BreedIdentifier'
import PostDetail from './PostDetail';
import TourPetMyPal from './PmpTour';
import BecomeVendor from './Vendor/BecomeVendor';
import VendorProfile from './Vendor/VendorProfile';
import EditVendorProfile from './Vendor/EditVendorProfile';
// import AboutYourBusiness from './Vendor/AboutYourBusiness'


const LoadingNavigator = createStackNavigator(
  {
    Splash,
  },
  {
    initialRouteName: 'Splash',
    headerMode: 'none',
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
);

const AppIntroNavigator = createStackNavigator(
  {
    AppIntro,
  },
  {
    initialRouteName: 'AppIntro',
    headerMode: 'none',
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
);

const AuthNavigator = createStackNavigator(
  {
    // SignupView,
    AuthView,
    LoginView,
    LoginMethod,
    ChoosePet,
    VerifyPhoneNumber,
    PetDetails,
    UserDetails,
    ForgotPassword,
    VerifyAccount,
    VerifyAccountByEmail,
    Password,
  },
  {
    // initialRouteName: 'UserDetails',
    initialRouteName: 'AuthView',
    headerMode: 'screen',
    headerMode: 'none',
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
);

const ActivationNav = createStackNavigator({
  AccountRecovery,
  ActivateAccountByPhone,
  ActivateAccountByEmail,
}, {
  initialRouteName: 'AccountRecovery',
  headerMode: 'none',//screen
  defaultNavigationOptions: {
    ...TransitionPresets.SlideFromRightIOS,
  },
},
)


const AppNavigator = createStackNavigator(
  {
    FooterBarView,
    StatusView,
    EventPostScreen,
    // PetRegisterView,
    // PetRegisterStepsView,
    // PetSitterServiceStepsView,
    MyPets,
    MyPetsWebView,
    PetAddView,
    SearchView,
    Chat,
    Followers,
    PixxyView,
    PixxyCreateView,
    UserProfile,
    Profile,
    Page,
    Group,
    PetProfile,
    TermsConditions,
    StoryView,
    EditProfile,
    VerifyOTP,
    EditEvent,
    EditPet,
    EditPage,
    EditGroup,
    ViewPost,
    EventDetails,
    CreateEvent,
    UserPagesView,
    UserGroupsView,
    InviteFriends,
    EventsView,
    ChangePassword,
    Notification,
    PrivacyPolicy,
    PixxyWorldView,
    BlockUsers,
    ProductList,
    ProductDetail,
    CartView,
    ShippingAddress,
    PreviousOrder,
    FAQ,
    ContactUs,
    AboutUs,
    TrendingStory,
    Trends,
    DeactivateUser,
    BreedIdentifier,
    PostDetail,
    TourPetMyPal,
    BecomeVendor,
    VendorProfile,
    EditVendorProfile,
    // AboutYourBusiness
  },
  {
    initialRouteName: 'FooterBarView',
    headerMode: 'none',//screen
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
);



const RootNavigator = createSwitchNavigator(
  {
    LoadingNavigator,
    AppIntroNavigator,
    AuthNavigator,
    AppNavigator,
    ActivationNav,
  },
  {
    initialRouteName: 'LoadingNavigator',
    headerMode: 'none',
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
);
export default createAppContainer(RootNavigator);
