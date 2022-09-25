import firebase from 'react-native-firebase'
import { SERVICES } from '../../constants/firebaseConstants';

export default class Services {
   static refService = firebase.database().ref().child(SERVICES);

   static getAll(){
       return this.refService.orderByKey();
   }

}