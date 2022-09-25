import { parsePhoneNumberFromString, PhoneNumber, parsePhoneNumber } from 'libphonenumber-js'

// export function checkAvailability (from,to , jobFrom, jobTo){
//     if(from === '00:00' && to === '00:00'){
//         return false;
//     }
//     to = to.replace(':');
//     from = from.replace(':');
//     if(to<=from){
//         return false;
//     }
//     return true;
// }

// export function checkAvailabilityDemo(from,to , jobFrom, jobTo){
//     if(from === '00:00' && to === '00:00'){
//         return false;
//     }
//     to = to.replace(':');
//     from = from.replace(':');
//     if(to<=from){
//         return false;
//     }
//     return true;
// }

// export function checkAvailabilityWithJob (from,to , jobFrom, jobTo){
    
//     if(from === '00:00' && to === '00:00'){
//         return false;
//     }
//     to = to.replace(':','');
//     from = from.replace(':','');
//     jobFrom = jobFrom.replace(':','')
//     jobTo = jobTo.replace(':','')
//     if(jobFrom >= from && jobFrom <= to && jobTo <= to)
//     {
//         return true 
//     }
//     else
//     {
//         return false
//     }
// }

export const passwordValidate = (text) => {
    // let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    let reg = /^(?=.*[A-Za-z])[A-Za-z\d@$!%*?&#]{8}$/
    // let reg = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}$/
    if (reg.test(text) === false) {
      return false;
    } else {
      return true;
    }
  };


export const validate = text => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (reg.test(text) === false) {
    return false;
  } else {
    return true;
  }
};

export function parsePhone(contact){
    const phoneNumber = parsePhoneNumberFromString(contact);
    return phoneNumber;
}

export function validateNumber(contact,cca2){
    try{
        return parsePhoneNumber(contact,cca2).isValid()
    }catch(ex){
       return false;
   } 
}


export function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function ValidateName (input) {
    const Regx = /^([\S]+)([a-zA-Z\s\.]+)*$/
     return Regx.test(input); 
};

export function Capitalize(str) {
    var splitStr = str?.toLowerCase().split(' ');

    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1); 
    }
    return splitStr.join(' '); 
  };
