import firebase from "react-native-firebase";
import { USER } from "../constants/firebaseConstants";
import AsyncStorage from "@react-native-community/async-storage";
import { FCMTOKEN } from "../constants/randomValues";

class PushNotification {
    constructor() {

    }

    async getToken() {
        const fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            this.storeinDB(fcmToken);
            return fcmToken;
        } else {
            throw error;
        }
    }

    storeinDB(fcmToken) {
        // const uid = firebase.auth().currentUser.uid;
        const uid = 'testing'
        AsyncStorage.setItem(FCMTOKEN, fcmToken);

        firebase.database().ref(USER).child(uid).child('Tokens').child(fcmToken).set(true);

    }


    initializeToken() {
        firebase.messaging().onTokenRefresh(fcmToken => {
            if (firebase.auth().currentUser) {
                this.storeinDB(fcmToken);
            }
        });
    }
}
export default PushNotification;