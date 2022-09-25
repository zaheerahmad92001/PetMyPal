// import React, { useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   Dimensions,
//   Image,
//   Text,
//   TouchableOpacity,
// } from 'react-native';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import Arrow from 'react-native-vector-icons/MaterialIcons';
// import { DeckSwiper, Card, } from 'native-base';
// import { black, darkSky, grey } from '../../constants/colors';
// import { labelFont, mediumText, textInputFont } from '../../constants/fontSize';
// import { cards } from '../../constants/ConstantValues'
// import { Platform } from 'react-native';

// const window = Dimensions.get('window');
// // const cards = [
// //   {
// //     index: 0,
// //     text: 'Small Dog',
// //     weight: '6 - 11 lbs',
// //     w_kg: '3 - 5 Kgs',
// //     image: require('../../assets/images/updated/SmallDog.png'),
// //   },
// //   {
// //     index: 1,
// //     text: 'Medium Dog',
// //     weight: '12 - 25 lbs',
// //     w_kg: '6 - 12 kgs',
// //     image: require('../../assets/images/updated/medumDog.png'),
// //   },
// //   {
// //     index: 2,
// //     text: 'Large Dog',
// //     weight: '26 - 40 lbs',
// //     w_kg: '12 - 18 kgs',
// //     image: require('../../assets/images/updated/LargeDog.png'),
// //   },
// //   {
// //     index: 3,
// //     text: 'X-Large Dog',
// //     weight: '41+ lbs',
// //     w_kg: '19+ kgs',
// //     image: require('../../assets/images/updated/xLargedog.png'),
// //   },
// // ];
// export default class DeckCard extends React.Component {
//   constructor(props)
//  {
//     super(props)
// }

//   onSwipeRight = (value) => {
//   //  alert(value.index)
//     this.props.handlePetSizeSelectRight(value+1)
//   }
//   onSwipeLeft = (value) => {
//   //  alert(value.index)

//     this.props.handlePetSizeSelectLeft(value+1)
//   }



//   render() {
//     const {  lbsSelected, kgSelected, handleUnitSelection } = this.props
// console.log('behjebfhjewb',this.props);
//     return (

//       <DeckSwiper
//         ref={(c) => this._deckSwiper = c}
//         dataSource={cards}
//         useNativeDriver={true}
//         renderEmpty={() =>
//           <View style={{ alignSelf: "center" }}>
//             <Text>Over</Text>
//           </View>
//         }
//         onSwipeRight={(pet) => this.onSwipeRight(pet)}
//         onSwipeLeft={(pet) => this.onSwipeLeft(pet)}
//         dragStart={(s)=>  console.log('Drag start', s)}
//         renderItem={(item) =>
//           <Card style={styles.cardStyle}>
//             <View style={styles.mainContainer}>

//               <TouchableOpacity onPress={() => {
//                 console.log('left swipe',item);
//                 this.onSwipeLeft(item)
//                 this._deckSwiper._root.swipeLeft()

//               }} style={{ justifyContent: 'center', zIndex: 100 }}>
//                 <View style={styles.leftArrow}>
//                   <Arrow size={25} name="keyboard-arrow-left" color={'#fff'} />
//                 </View>
//               </TouchableOpacity>

//                 <View style={styles.imgContainer}>
//                   <Image
//                     style={styles.imgStyle}
//                     resizeMode="contain"
//                     source={item.image}
//                   />
//                 </View>

//                 <View style={styles.contentView}>
//                   <Text style={styles.textStyle}>{item.text}</Text>
//                   <View style={{ flexDirection: 'row', alignItems: 'center', }}>
//                     <TouchableOpacity
//                       onPress={() => handleUnitSelection('lbs')}
//                     >
//                       <Text style={
//                         lbsSelected ?
//                           [styles.textStyle,] :
//                           [styles.textStyle, { color: black }]
//                       }>lbs  </Text>
//                     </TouchableOpacity>
//                     <Text style={[styles.textStyle]}>/</Text>
//                     <TouchableOpacity
//                       onPress={() => handleUnitSelection('kg')}
//                     >
//                       <Text style={
//                         kgSelected ?
//                           [styles.textStyle,] :
//                           [styles.textStyle, { color: black }]
//                       }>  kgs</Text>
//                     </TouchableOpacity>
//                   </View>
//                   {
//                     lbsSelected ?
//                       <Text style={styles.weightText}>Weight: {item.weight}</Text> :
//                       <Text style={styles.weightText}>Weight: {item.w_kg}</Text>
//                   }
//                   <Text style={styles.weightText}>Size: {item.size}</Text>
//                 </View>

//               {/* </View> */}

//               <TouchableOpacity onPress={() => {
//                 console.log('right swipe',item);

//                 this.onSwipeRight(item)
//                 this._deckSwiper._root.swipeRight()

//               }} style={{ justifyContent: 'center' }}>
//                 <View style={styles.rightArrow}>
//                   <Arrow size={25} name="keyboard-arrow-right" color={'#fff'} />
//                 </View>
//               </TouchableOpacity>

//             </View>

//           </Card>
//         }
//       />
//     );
//   }
// };

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';


import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Arrow from 'react-native-vector-icons/MaterialIcons';
import { black, darkSky, grey } from '../../constants/colors';
import { labelFont, mediumText, textInputFont } from '../../constants/fontSize';
import { cards } from '../../constants/ConstantValues'
import { Platform } from 'react-native';
const window = Dimensions.get('window');
const { width } = Dimensions.get('window');
export default class DeckCard extends React.Component {
  constructor() {
    super()
    this.state = {
      cardIndex: 0
    }
  }
  onSwipeRight = (value) => {
    this.props.handlePetSizeSelectRight(value)
  }
  onSwipeLeft = (value) => {
    this.props.handlePetSizeSelectLeft(value)
  }




  render() {
    const { handlePetSizeSelect, lbsSelected, kgSelected, handleUnitSelection } = this.props

    const { cardIndex } = this.state
    if (cardIndex === 0) {

      return (

        <View style={styles.cardStyle}>
          <View style={styles.mainContainer}>
            <TouchableOpacity onPress={() => {
              if (cardIndex == 0) {
                 this.setState({ cardIndex: 3 },()=>{
                  this.onSwipeLeft(cards[cardIndex]) // 3rd index of array
                 })

              }

            }} style={{ justifyContent: 'center', zIndex: 100 }}>
              <View style={styles.leftArrow}>
                <Arrow size={25} name="keyboard-arrow-left" color={'#fff'} />
              </View>
            </TouchableOpacity>

            <View style={styles.imgContainer}>
              <Image
                style={styles.imgStyle}
                resizeMode="contain"
                source={cards[0].image}
              />
            </View>

            <View style={styles.contentView}>
              <Text style={styles.textStyle}>{cards[0].text}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <TouchableOpacity
                  onPress={() => handleUnitSelection('lbs')}
                >
                  <Text style={
                    lbsSelected ?
                      [styles.textStyle,] :
                      [styles.textStyle, { color: black }]
                  }>lbs  </Text>
                </TouchableOpacity>
                <Text style={[styles.textStyle]}>/</Text>
                <TouchableOpacity
                  onPress={() => handleUnitSelection('kg')}
                >
                  <Text style={
                    kgSelected ?
                      [styles.textStyle,] :
                      [styles.textStyle, { color: black }]
                  }>  kgs</Text>
                </TouchableOpacity>
              </View>
              {
                lbsSelected ?
                  <Text style={styles.weightText}>Weight: {cards[0].weight}</Text> :
                  <Text style={styles.weightText}>Weight: {cards[0].w_kg}</Text>
              }
              {/* <Text style={styles.weightText}>Size: {cards[0].size}</Text> */}
            </View>


            <TouchableOpacity onPress={() => {
              this.setState({ cardIndex: cardIndex + 1 })
              this.onSwipeRight(cards[cardIndex])

            }} style={{ justifyContent: 'center' }}>
              <View style={styles.rightArrow}>
                <Arrow size={25} name="keyboard-arrow-right" color={'#fff'} />
              </View>
            </TouchableOpacity>

          </View>
        </View>

      );
    }

    else if (this.state.cardIndex === 1) {
      return (

        <View style={styles.cardStyle}>
          <View style={styles.mainContainer}>
            <TouchableOpacity onPress={() => {
              this.setState({ cardIndex: cardIndex - 1 },()=>{
                this.onSwipeLeft(cards[cardIndex])
              })


            }} style={{ justifyContent: 'center', zIndex: 100 }}>
              <View style={styles.leftArrow}>
                <Arrow size={25} name="keyboard-arrow-left" color={'#fff'} />
              </View>
            </TouchableOpacity>

            <View style={styles.imgContainer}>
              <Image
                style={styles.imgStyle}
                resizeMode="contain"
                source={cards[1].image}
              />
            </View>

            <View style={styles.contentView}>
              <Text style={styles.textStyle}>{cards[1].text}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <TouchableOpacity
                  onPress={() => handleUnitSelection('lbs')}
                >
                  <Text style={
                    lbsSelected ?
                      [styles.textStyle,] :
                      [styles.textStyle, { color: black }]
                  }>lbs  </Text>
                </TouchableOpacity>
                <Text style={[styles.textStyle]}>/</Text>
                <TouchableOpacity
                  onPress={() => handleUnitSelection('kg')}
                >
                  <Text style={
                    kgSelected ?
                      [styles.textStyle,] :
                      [styles.textStyle, { color: black }]
                  }>  kgs</Text>
                </TouchableOpacity>
              </View>
              {
                lbsSelected ?
                  <Text style={styles.weightText}>Weight: {cards[1].weight}</Text> :
                  <Text style={styles.weightText}>Weight: {cards[1].w_kg}</Text>
              }
              {/* <Text style={styles.weightText}>Size: {cards.size}</Text> */}
            </View>


            <TouchableOpacity onPress={() => {
              this.setState({ cardIndex: cardIndex + 1 })

              this.onSwipeRight(cards[cardIndex])


            }} style={{ justifyContent: 'center' }}>
              <View style={styles.rightArrow}>
                <Arrow size={25} name="keyboard-arrow-right" color={'#fff'} />
              </View>
            </TouchableOpacity>

          </View>
        </View>

      );
    }
    else if (this.state.cardIndex === 2) {
      return (

        <View style={styles.cardStyle}>
          <View style={styles.mainContainer}>
            <TouchableOpacity onPress={() => {
              this.setState({ cardIndex: cardIndex - 1 },()=>{
                this.onSwipeLeft(cards[cardIndex])
              })


            }} style={{ justifyContent: 'center', zIndex: 100 }}>
              <View style={styles.leftArrow}>
                <Arrow size={25} name="keyboard-arrow-left" color={'#fff'} />
              </View>
            </TouchableOpacity>

            <View style={styles.imgContainer}>
              <Image
                style={styles.imgStyle}
                resizeMode="contain"
                source={cards[2].image}
              />
            </View>

            <View style={styles.contentView}>
              <Text style={styles.textStyle}>{cards[2].text}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <TouchableOpacity
                  onPress={() => handleUnitSelection('lbs')}
                >
                  <Text style={
                    lbsSelected ?
                      [styles.textStyle,] :
                      [styles.textStyle, { color: black }]
                  }>lbs  </Text>
                </TouchableOpacity>
                <Text style={[styles.textStyle]}>/</Text>
                <TouchableOpacity
                  onPress={() => handleUnitSelection('kg')}
                >
                  <Text style={
                    kgSelected ?
                      [styles.textStyle,] :
                      [styles.textStyle, { color: black }]
                  }>  kgs</Text>
                </TouchableOpacity>
              </View>
              {
                lbsSelected ?
                  <Text style={styles.weightText}>Weight: {cards[2].weight}</Text> :
                  <Text style={styles.weightText}>Weight: {cards[2].w_kg}</Text>
              }
              {/* <Text style={styles.weightText}>Size: {cards[2].size}</Text> */}
            </View>


            <TouchableOpacity onPress={() => {
              this.onSwipeRight(cards[cardIndex])
              this.setState({ cardIndex: cardIndex + 1 })


            }} style={{ justifyContent: 'center' }}>
              <View style={styles.rightArrow}>
                <Arrow size={25} name="keyboard-arrow-right" color={'#fff'} />
              </View>
            </TouchableOpacity>

          </View>
        </View>

      );
    }
    else if (this.state.cardIndex === 3) {
      return (

        <View style={styles.cardStyle}>
          <View style={styles.mainContainer}>
            <TouchableOpacity onPress={() => {
              this.setState({ cardIndex: cardIndex - 1 },()=>{
                this.onSwipeLeft(cards[cardIndex])
              })


            }} style={{ justifyContent: 'center', zIndex: 100 }}>
              <View style={styles.leftArrow}>
                <Arrow size={25} name="keyboard-arrow-left" color={'#fff'} />
              </View>
            </TouchableOpacity>

            <View style={styles.imgContainer}>
              <Image
                style={styles.imgStyle}
                resizeMode="contain"
                source={cards[3].image}
              />
            </View>

            <View style={styles.contentView}>
              <Text style={styles.textStyle}>{cards[3].text}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <TouchableOpacity
                  onPress={() => handleUnitSelection('lbs')}
                >
                  <Text style={
                    lbsSelected ?
                      [styles.textStyle,] :
                      [styles.textStyle, { color: black }]
                  }>lbs  </Text>
                </TouchableOpacity>
                <Text style={[styles.textStyle]}>/</Text>
                <TouchableOpacity
                  onPress={() => handleUnitSelection('kg')}
                >
                  <Text style={
                    kgSelected ?
                      [styles.textStyle,] :
                      [styles.textStyle, { color: black }]
                  }>  kgs</Text>
                </TouchableOpacity>
              </View>
              {
                lbsSelected ?
                  <Text style={styles.weightText}>Weight: {cards[3].weight}</Text> :
                  <Text style={styles.weightText}>Weight: {cards[3].w_kg}</Text>
              }
              {/* <Text style={styles.weightText}>Size: {cards[3].size}</Text> */}
            </View>


            <TouchableOpacity onPress={() => {
              if (cardIndex == 3) {
                 this.setState({ cardIndex: 0 })
              } 
              // else {
              //   this.setState({ cardIndex: cardIndex + 1 })
              // }

              this.onSwipeRight(cards[cardIndex])


            }} style={{ justifyContent: 'center' }}>
              <View style={styles.rightArrow}>
                <Arrow size={25} name="keyboard-arrow-right" color={'#fff'} />
              </View>
            </TouchableOpacity>

          </View>
        </View>

      );
    }
  }
};


const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 14,
    // backgroundColor:'red'
  },
  container: { flex: 1, backgroundColor: 'white' },
  child: { width, justifyContent: 'center' },
  text: { fontSize: width * 0.5, textAlign: 'center' },
  cardStyle: {
    borderWidth: 2,
    borderRadius: 20,
    borderColor: '#0000001A',
    // backgroundColor:'red'
  },

  leftArrow: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F596A0',
    marginLeft: -10,
    height: hp(4),
    width: wp(7),
    borderRadius: 8,
  },
  rightArrow: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F596A0',
    marginRight: -10,
    height: hp(4),
    width: wp(7),
    borderRadius: 8,
  },
  textStyle: {
    // fontWeight: 'bold',
    color: darkSky,
    fontSize: labelFont
  },
  imgContainer: {
    borderWidth: 2,
    borderRadius: 20,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: darkSky,
    height: 90, width: 90,
    alignSelf: 'flex-start',
    alignSelf: 'center',
    overflow: 'hidden',
    // backgroundColor:'red'
  },
  imgStyle: {
    // flex: 1,
    height: 70,
    width: 70,
  },
  weightView: {
    flexDirection: 'row',
  },
  weightText: {
    color: grey,
    fontSize: labelFont,
    // marginTop: 6,
    // marginTop: 10,
  },
  contentView: {
    justifyContent: 'space-between',
    marginLeft: 10,
    // backgroundColor:'red',
    // marginLeft: 20,
    // marginVertical: 10
  }

})