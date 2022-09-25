
import firebase from 'react-native-firebase'
import { EMPLOYERCARDS } from '../../constants/firebaseConstants';

export default class EmployerCard {
    static getCardByID(ID){
        return firebase.database().ref(EMPLOYERCARDS).child(ID);
    }
}