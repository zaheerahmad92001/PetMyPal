import firebase from 'react-native-firebase'
import { JOBS, SQUAD_JOBS } from '../../constants/firebaseConstants';

export default class Jobs {
   static refJobs = firebase.database().ref().child(JOBS);
   static refSquadsJobs = firebase.database().ref(SQUAD_JOBS);

   static getJobByID(id){
       return this.refJobs.child(id);
   }

   static getByDateRange(uid,bid,squadId,startDate,endDate){
       return this.refSquadsJobs.child(uid).child(bid).child(squadId).orderByChild('day').startAt(startDate).endAt(endDate);
   }

}