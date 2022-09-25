import React from 'react';
import { StyleSheet, View, Text, FlatList, Image, Dimensions } from 'react-native';
import { Thumbnail, } from 'native-base';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const squadlyProfiles =
	[
		{ img: require('../img/SquadlyLogoNEW.png'),key:'1' },
		{ img: require('../img/SquadlyLogoNEW.png'),key:'2' },
		{ img: require('../img/SquadlyLogoNEW.png'),key:'3' },
		{ img: require('../img/SquadlyLogoNEW.png'),key:'4' },
		{ img: require('../img/SquadlyLogoNEW.png'),key:'5' },
		{ img: require('../img/SquadlyLogoNEW.png'),key:'6' },
		{ img: require('../img/SquadlyLogoNEW.png'),key:'7' },
		{ img: require('../img/SquadlyLogoNEW.png'),key:'8' },
		{ img: require('../img/SquadlyLogoNEW.png'),key:'9' },
		{ img: require('../img/SquadlyLogoNEW.png'),key:'10' },

	]

class ProfilesFlatList extends React.Component {

	render() {
		const { img } = this.props;
		return (
			<View style={styles.container}>


				<Thumbnail source={img} />

			</View>
		)
	}

}

export default class MemberList extends React.Component {
	static navigationOptions = {

		header: null,
	};
	constructor() {
		super();
		this.state = {
			profiles: squadlyProfiles,
		}
	}
	renderProfiles = ({ item }) => {
		
		return (
			<ProfilesFlatList
				img={item.img}
				key={item.key}
			/>

		)
	}
	render() {
		const { profiles } = this.state;
		return (
		<View style={{height: WINDOW_HEIGHT * 0.15, borderRadius:20, backgroundColor:'#222326',}}>
			
		<FlatList
				data={profiles}
				keyExtractor={(item) => item.key}
				renderItem={this.renderProfiles}
				horizontal={true}
			/>
	  </View>
		);
	}
}
var styles = StyleSheet.create({
	container: {
		padding: 20,
		paddingHorizontal:10,
		justifyContent:'center',

		
	},
});