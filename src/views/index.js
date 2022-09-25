/**
 * @format
 */

import {AppRegistry, NativeModules, Alert} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import invokeApp from 'react-native-invoke-app';
import RNCallKeep from 'react-native-callkeep';
import {PermissionsAndroid} from 'react-native';
import {Platform} from 'react-native';
import {RtcEngine} from 'react-native-agora';
const {Agora} = NativeModules; //Define Agora object as a native module
const {FPS30, AudioProfileDefault, AudioScenarioDefault, Adaptative} = Agora; //Set defaults for Stream
import {AppId, ChannelName} from 'react-native-dotenv';

if (Platform.OS === 'android') {
  const config = {
    //Setting config of the app
    appid: AppId, //App ID
    channelProfile: 0, //Set channel profile as 0 for RTC
    videoEncoderConfig: {
      //Set CallPerson feed encoder settings
      width: 720,
      height: 1080,
      bitrate: 1,
      frameRate: FPS30,
      orientationMode: Adaptative,
    },
    audioProfile: AudioProfileDefault,
    audioScenario: AudioScenarioDefault,
  };
  RtcEngine.init(config); //Initialize the RTC engine
}

const onAnswerCallAction = id => {
  RtcEngine.joinChannel(id);
  RtcEngine.enableAudio(); //Enable the audio
  RNCallKeep.setCurrentCallActive(id);
};
const onEndCallAction = id => {
  RtcEngine.disableAudio();
  RNCallKeep.endCall(id);
};

const options = {
  ios: {
    appName: 'ReactNativeWazoDemo',
    imageName: 'sim_icon',
    supportsVideo: false,
    maximumCallGroups: '1',
    maximumCallsPerCallGroup: '1',
  },
  android: {
    alertTitle: 'Permissions Required',
    alertDescription:
      'This application needs to access your phone calling accounts to make calls',
    cancelButton: 'Cancel',
    okButton: 'ok',
    imageName: 'sim_icon',
    additionalPermissions: [PermissionsAndroid.PERMISSIONS.READ_CONTACTS],
  },
};

RNCallKeep.setup(options).then(accepted => {
 
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  const {data} = remoteMessage;
  if (data.call) {
    RNCallKeep.displayIncomingCall(
      data.appointmentId,
      'Telemed',
      data.callerName,
    );

    RNCallKeep.addEventListener('answerCall', () =>
      onAnswerCallAction(data.appointmentId),
    );
    RNCallKeep.addEventListener('endCall', () =>
      onEndCallAction(data.appointmentId),
    );
    RtcEngine.on('userJoined', data => {

    });

  }
});

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask(
  'RNCallKeepBackgroundMessage',
  () => ({name, callUUID, handle}) => {
    // Make your call here

    return Promise.resolve();
  },
);
