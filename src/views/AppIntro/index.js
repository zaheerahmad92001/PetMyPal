import AsyncStorage from '@react-native-community/async-storage';
import { Content } from 'native-base';
import React ,{Component} from 'react'
import { StyleSheet , View , Text , Image ,SafeAreaView} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { isIphoneX } from 'react-native-iphone-x-helper';
import SkyBlueBtn from '../../components/common/SkyblueBtn';
import StepsUp from '../../components/updated/StepsUp';
import { darkSky } from '../../constants/colors';
import {breadRecognition , socialBounding , socialNetworking , LostFound , petLife}from '../../constants/ConstantValues'
import { labelFont, largeText } from '../../constants/fontSize';
import { IS_INTRO_DONE } from '../../constants/storageKeys';
const slides = [
    {
      key: 1,
      title: 'Social Networking',
    //   text: `Connect with pet owners throughout the world. Share exciting stories, pictures, and videos about your pet. Pet Owners can add unlimited pets while each pet will have its own social media page and followers.`,
    text:`Connect with pet owners throughout the world. Share exciting stories, pictures, and videos about your pet.`,  
    image: socialNetworking,
      backgroundColor: '#59b2ab',
    },
    {
      key: 2,
      title: 'Special Bonding',
    //   text:`Want to make new friends who have something in common with you? Once you sign-up on PetMyPal, we will automatically connect you with similar pet owners who have the same pet breed as yours. What a good way to make new friends throughout the world who share the same passion.`,
    text :`Connect automatically with similar pet owners who have the same pet breed as yours - great way to make new friends throughout the world who share the same passion.`,  
    image: socialBounding,
      backgroundColor: '#22bcb5',
    },
    {
      key: 3,
      title: 'Lost & Found',
    //   text:`Recovering your lost pet is a breeze with PetMyPal's QR tags and its Artificial Intelligence based recognition technology. As a pet owner get notified in real time to find your beloved pet.`,
    text:`Recovering your lost pet is a breeze with PetMyPal's QR tags and its Artificial Intelligence based recognition technology.`,  
    image: LostFound,
      backgroundColor: '#febe29',
    },
    
    {
        key: 4,
        title: 'Breed Recognition',
        // text: `Identifying your pet's breed is no more a mystery with PetMyPal's Artificial Intelligence based breed recognition technology. Over time, we will also offer helpful tidbits on your breed's unique food preferences and allergic sensitivities.`,
        text:`Identifying your pet's breed is no more a mystery with PetMyPal's Artificial Intelligence based breed recognition technology.`,
        image: breadRecognition,
        backgroundColor: '#22bcb5',
      },
      {
        key: 5,
        title:`Your Pet's Life`,
        // text:`PetMyPal offers you special ways to recognize and memorialize your pet's life events including birthdays and when your pet is deceased. Helps establish the emotional connection with other pet owners through happiness and grieving.\n\nExciting Features Coming Soon
        // \n•	Social Responsibility is a personal matter for PetMyPal founders. PetMyPal will develop an eco-system to connect with pet shelters and rescue centers.\n\n•	Breed identity expansion on cats and horses along with face recognition\n\n•	Introduction of GPS tracking along with PetMyPal’s QR tags
        // `,
        text:`PetMyPal offers you special ways to recognize and memorialize your pet's life events including birthdays and when your pet is deceased.`,
        image: petLife,
        backgroundColor: '#22bcb5',
      },
  ];
   
 export default class AppIntro extends Component{
     constructor(props){
         super(props)
         this.state={

         }
     }

     goToNextSlide = async (index)=>{
        
         const i = index 
        //  console.log('next slide is ', i)
         if(i==5){

          // await AsyncStorage.setItem(IS_INTRO_DONE ,'true')
          this.props.navigation.navigate('AuthNavigator')

        }else{
          this.slider?.goToSlide(i, true)
        }
     }
     
     skipIntro= async()=>{
        // await AsyncStorage.setItem(IS_INTRO_DONE ,'true')
        this.props.navigation.navigate('AuthNavigator')
     }

     _renderItem = ({ item }) => {
        return (
            
          <View style={styles.slide}>
              <View style={styles.contentView}>
              <View style={styles.header}>
                 <TouchableOpacity
                  onPress={()=>this.skipIntro()}
                 >
                   {
                   item.key == 5 ? null :
                     <Text style={styles.skipStyle}>Skip</Text>
                   }
                 </TouchableOpacity>
                 <StepsUp steps={item.key}/>
              </View>

              <View style={styles.headingView}>
                 <Text style={styles.titleStyle}>{item.title}</Text>
             </View>

             <View style={styles.textView}>
                 <Text>{item.text}</Text>
             </View>
        
             <View style={styles.imgView}>
                 <Image
                  source={item.image}
                  resizeMode={'contain'}
                  style={{width:'100%', height:400}}
                 />
             </View>
            </View>

             <View style={styles.btnView}>
             <SkyBlueBtn
              title={'Next'}
              onPress={()=>this.goToNextSlide(item.key)}
              btnContainerStyle={styles.btnContainerStyle}
             />
             </View>

            </View>
        );
      }
      _onDone = () => {
        // User finished the introduction. Show real app through
        // navigation or simply by controlling state
        this.setState({ showRealApp: true });
      }

     render(){
         return(
            <AppIntroSlider 
              renderItem={this._renderItem}
              data={slides} onDone={this._onDone}
              ref={(ref) => (this.slider = ref)}
              showNextButton={false}
              showDoneButton={false}
              dotStyle={{backgroundColor:'transparent'}}
              activeDotStyle={{backgroundColor:'transparent'}}
              />
         )
     }
 }

 const styles = StyleSheet.create({
    slide:{
        flex:1,
        // backgroundColor:'green',
        
    },
    header:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginHorizontal:20,
        marginTop:Platform.OS =='android'? 20 : isIphoneX()? 45 : 20
    },
    headingView:{
        marginTop:20,
    },
    titleStyle:{
       fontSize:largeText,
       fontWeight:'600' ,
       textAlign:'center' 
    },
    textView:{
        marginTop:10,
        justifyContent:"center",
        alignItems:'center',
        marginHorizontal:20,
        
    },
    imgView:{
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
    },
    btnContainerStyle:{
        alignItems:'center',
        alignSelf:'center'
    },
    skipStyle:{
      color:darkSky,
      fontSize:labelFont,
      fontWeight:'500'
    },
    contentView:{
      flex:8
    },
    btnView:{
      // backgroundColor:'red',
      flex:2,
      justifyContent:'center',
      alignItems:'center'
    },
 })

