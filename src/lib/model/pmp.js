// import firebase from 'react-native-firebase'
// import { USER } from '../../constants/firebaseConstants';
import { LOGIN_USER,CURRENT_WORKSPACE, ACCESS_TOKEN } from '../../constants/storageKeys';
import AsyncStorage from '@react-native-community/async-storage';
// import { FCMTOKEN } from '../../constants/randomValues';

export default class PMP {
   
    // static async create(employer) {
          
    //         var currentUser = firebase.auth().currentUser;
    //         await currentUser.updateProfile({
    //             displayName: employer.name,
    //         })
    //         await firebase.database().ref(USER).child(currentUser.uid).set(employer);
    //         return 1;
    // }

    // static async logout(){
    //     var currentUser = firebase.auth().currentUser;

    //     await AsyncStorage.removeItem(LOGIN_USER);
    //     const fcmToken = await AsyncStorage.getItem(FCMTOKEN);
    //     await firebase.database().ref(USER).child(currentUser.uid).child('businessTokens').child(fcmToken).remove();
    //     return firebase.auth().signOut();
    // }
    static async logout(){
       
        await AsyncStorage.removeItem(LOGIN_USER);
        await AsyncStorage.removeItem(CURRENT_WORKSPACE);
        await AsyncStorage.removeItem(ACCESS_TOKEN);
        await AsyncStorage.removeItem('USER_DETAIL')
        
    }

    // static getUserByID(ID){
    //     return firebase.database().ref(USER).child(ID);
    // }

}
