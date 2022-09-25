import * as React from 'react';
import { useState } from 'react';
import { MentionInput } from 'react-native-controlled-mentions';
import {Text,View, StyleSheet} from 'react-native';
import { connect } from 'react-redux';


const Mention = (props) => {
  const [value, setValue] = useState('');
  const users = props?.friends?.followers ? props?.friends?.followers.concat(props?.friends?.following) : [];
  let _suggestions =[]
  users.map((item)=>{
    _suggestions.push({
      // id:item.user_id,
      name:item.name,
      id:item.username
    })
  })

  const hashtags = [
    { id: 'todo', name: 'todo' },
    { id: 'help', name: 'help' },
    { id: 'loveyou', name: 'loveyou' },
  ];

  const renderSuggestions = (suggestions) => ({
    keyword,
    onSuggestionPress,
  }) => {
    if (keyword == null) {
      return null;
    }
    return (
      <View>
        {suggestions
          .filter((one) =>
            one.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
          )
          .map((one) => (
            <View style={{ borderTopColor: '#bebebe', borderTopWidth: 1, paddingVertical: 10 }}>
              <Text onPress={() => onSuggestionPress(one)} style={{
                paddingLeft: 5
              }}>{one.name}</Text>
            </View>
          ))}
      </View>
    );
  };

  const renderMentionSuggestions = renderSuggestions(_suggestions);

  const renderHashtagSuggestions = renderSuggestions(hashtags);
  return (

    <MentionInput
      {...props}
      value={value}
      maxLength={100}
      onChange={(text) => {
        // console.log('here is text', text[1]);
      
        setValue(text)

        // return false
        // text = text.replace(/undefined/g, '');
        // text = text.replace(/]/g, '');
        // text = text.split('()').join('');
        // text = text.split('@[').join('@');
 
        text = text.replace(/undefined/g, '');
        text = text.replace(/]/g, '');
        text = text.split('()').join('');
        text = text.split('@[').join('@');

        let temp = text.split(' ')
        let tempText =''
        temp.map((item, index)=>{
          if(item.includes('@')){
            let a = '@'
            if(tempText){
            tempText = `${tempText} ${a}`
          }else{
            tempText = `${tempText}${a}`
          }
          }else if(item.includes('(')){
            let b = item.split('(')[1].replace(')','')
            tempText =`${tempText}${b}`
          }else{
            tempText = `${tempText} ${item}`
          }
        })
        props.onChangeText(tempText)
        // props.onChangeText(text)
      }}
      partTypes={[
        {
          trigger: '@',
          renderSuggestions: renderMentionSuggestions,
          textStyle: { fontWeight: 'bold', color: '#F47D8A' },
        },
        {
          pattern: /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/gi,
        },
      ]}
      containerStyle={props.customContainer?[styles.customContainer]:[styles.containerStyle]}

    />
  );
};
const mapStateToProps = state => ({
  friends: state.friends.friends
});
export default connect( mapStateToProps )(Mention);

const styles = StyleSheet.create({
  containerStyle:  {
    width:'100%'
  }
})
