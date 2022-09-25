import { SERVER } from "../../constants/server";

export const WORDS = 200;
export const DATE_EXTRACT=  410240376000;
export const UPDATED_GROUP='UPDATED';
export const DELETED_GROUP='DELETED_GROUP';
export const INCORRECT_PASSWORD='INCORRECT_PASSWORD';
export const FAIL_GROUP='FAIL_GROUP';
export const CREATED_GROUP='CREATED_GROUP';
export const AVATAR ='AVATAR';
export const COVER ='COVER';

export const ExtractUrl=(url)=>{
    return url.toString().toLowerCase().replace(/[^A-Z0-9_]/gi, '')
}

export const ShortAboutParseHtml=(about)=>{

   return about!='null'&&about!=undefined?commonParser(about,'short').length > 100 ? commonParser(about,'short').substring(0, 100) + "...." :commonParser(about,'short'):''
}

export const LongAboutParseHtml=(about)=>{
    return about!='null'&&about!=undefined?commonParser(about,'long'):''

}

function commonParser(returnText, type) {
    if (type == 'short') {
        returnText = returnText.replace(/(\r\n|\n|\r)/gm, "");
    }
    // returnText = returnText.replace(""  "\n");
    returnText = returnText.replace(/<br>/gi, type == 'short' ? "" : "\n");
    
  // returnText=returnText.replace(/br/gi,type=='short' ? "":"\n"); // zaheer ahmad


    returnText=returnText.replace(/<br\s\/>/gi, type=='short' ? "":"\n");
    returnText=returnText.replace(/<br\/>/gi, type=='short' ? "":"\n");
   // returnText=returnText.replace(/<br>/gi, type=='short' ? "":"\n");

    //-- remove P and A tags but preserve what's inside of them
    returnText=returnText.replace(/<p.*>/gi,type=='short' ? "":"\n");
    returnText=returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

    //-- remove all inside SCRIPT and STYLE tags
    returnText=returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
    returnText=returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
    //-- remove all else
    returnText=returnText.replace(/<(?:.|\s)*?>/g, "");

    //-- get rid of more than 2 multiple line breaks:
    returnText=returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\n\n");

    //-- get rid of more than 2 spaces:
    returnText = returnText.replace(/ +(?= )/g,'');

    // //-- get rid of html-encoded characters:
    returnText=returnText.replace(/&nbsp;/gi," ");
    returnText=returnText.replace(/&amp;/gi,"&");
    returnText=returnText.replace(/&quot;/gi,'"');
    returnText=returnText.replace(/&lt;/gi,'<');  // zaheer ahmad
    returnText=returnText.replace(/&gt;/gi,'>');  // zaheer ahmad

    // returnText=returnText.replace(/&lt;/gi,''); // zaheer ahmad
    //  returnText=returnText.replace(/&gt;/gi,'');  // zaheer ahamd
    return returnText;

}