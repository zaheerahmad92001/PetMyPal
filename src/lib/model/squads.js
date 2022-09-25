import firebase from 'react-native-firebase'
import { SQUADS } from '../../constants/firebaseConstants';

export default class Squads {
    
    static ref = firebase.database().ref(SQUADS);

    // static async create(business) {
    //          const uid = firebase.auth().currentUser.uid;
    //         return this.refBusiness.child(business.bid).set(business);
            
    // }

    static getSquadKey(){
        return this.ref.push().key;
    }

    static getSquadForBusiness(bid){
        const uid = firebase.auth().currentUser.uid;

        return this.ref.orderByChild("bid").equalTo(bid);
    }


    static getSquadByID(ID){
        return this.ref.child(ID);
    }

    static removeMember(squadID,uid){
       return this.ref.child(squadID).child('members').child(uid).remove();
    }

    // static getUserByID(ID){
    //     return firebase.database().ref(BUSINESS).child(ID);
    // }

}
