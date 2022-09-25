import firebase from 'react-native-firebase'
import { BUSINESS } from '../../constants/firebaseConstants';

export default class Business {
    
    static refBusiness = firebase.database().ref(BUSINESS);

    static async create(business) {
             const uid = firebase.auth().currentUser.uid;
            return this.refBusiness.child(business.bid).set(business);
            
    }

    static getBusinessKey(){
        return this.refBusiness.push().key;
    }

    static getAllBusiness(){
        const uid = firebase.auth().currentUser.uid;

        return this.refBusiness.orderByChild('uid').equalTo(uid);
    }


    // static getUserByID(ID){
    //     return firebase.database().ref(BUSINESS).child(ID);
    // }

}
