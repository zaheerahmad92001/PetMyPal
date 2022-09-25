import React, { Component } from 'react';
import { StatusBar, View, } from 'react-native';
import { Tab, Tabs, ScrollableTab, } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';

import Going from './Going';
import Past from './Past';
import Interested from './Interested';
import Invited from './Invited';
import MyEvents from './MyEvents';
import PMPHeader from '../../components/common/PMPHeader';
import { addEvents } from '../../redux/actions/events';
import { allEvents, pressInterestEvent, pressGoingEvent } from '../../services/index';
import Events from './Events';
import PlaceholderLoader from '../../components/updated/PlaceholderLoader';
import CustomLoader from '../../components/common/CustomLoader';
import InfoModal from '../../components/common/InfoModal';
import { LongAboutParseHtml } from '../../components/helpers';

class TabsExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pastEvents: [],
      allEvents: [],
      myEvents: [],
      InterestedEvents: [],
      InvitedEvents: [],
      GoingEvents: [],
      loading: false,
      change: false,
      goingLoader: false,
      aboutModal: false,
      aboutText: undefined
    };
  }
  goBack = () => {
    this.props.navigation.pop();
  };
  componentDidMount() {
    
      this.setState({ loading: true, change: false })

      allEvents((data) => {
        console.log('data is ', data);

        let obj = {
          allEvents: data.events,
          myEvents: data.my_events,
          pastEvents: data.past_events,
          InterestedEvents: data.interested_events,
          InvitedEvents: data.invited_events,
          GoingEvents: data.going_events
        }
        this.props.addEvents(obj)
        this.setState({ loading: false, change: false })
      })
  
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }
  closeAboutModal = () => {
    this.setState({
      aboutModal: false
    })
  }
  commonApiCall(data){
    this.commonApiInterval=setTimeout(()=>{
      allEvents((data) => {
        let obj = {
          allEvents: data.events,
          myEvents: data.my_events,
          pastEvents: data.past_events,
          InterestedEvents: data.interested_events,
          InvitedEvents: data.invited_events,
          GoingEvents: data.going_events
        }
        this.props.addEvents(obj)
        this.setState({ goingLoader: false, change: false })
      })

    },100)
  
  }
  pressInterest(id) {
    pressInterestEvent(id, (status) => {
      this.commonApiCall();
    })
  }
  pressGoing(id) {

    pressGoingEvent(id, (status) => {
      this.commonApiCall();
     
    })

  }
  showAboutModal = (about) => {
    this.setState({ aboutModal: true, aboutText: about })
  }
  componentWillUnmount() {
    this.setState({ loading: false });
    this.commonApiInterval;
  }
  render() {
    const { pastEvents, InterestedEvents, InvitedEvents, GoingEvents, allEvents, myEvents } = this.props.events
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} translucent={false} />
        <PMPHeader
          ImageLeftIcon={'arrow-back'}
          LeftPress={() => this.goBack()}
          RightPress={() => {
            this.props.navigation.navigate({
              routeName: 'CreateEvent',
              key: 'CreateEvent'
            });
          }}
          centerText={'Events'}
          rightBtnText={'Add Event'}
        />
        <InfoModal
          isVisible={this.state.aboutModal}
          onBackButtonPress={() => this.closeAboutModal()}
          info={LongAboutParseHtml(this.state.aboutText)}
          headerText={''}
          policy={''}
          leftAlign={true}
          onPress={() => this.closeAboutModal()}
        />
        {this.state.loading &&
          <View style={{ position: 'absolute', top: wp(15), width: '100%', justifyContent: 'center', zIndex: 1 }}><PlaceholderLoader /></View>}
        {this.state.goingLoader && <View style={{
          position: 'absolute',
          top: 10, left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1, width: '100%', height: 50
        }}>
          <CustomLoader />
        </View>
        }

        <Tabs renderTabBar={() => (
          <ScrollableTab style={{ backgroundColor: 'white', padding: 5, borderWidth: 0 }} />
        )} tabBarActiveTextColor="#20ACE2" tabBarUnderlineStyle={{ backgroundColor: '#20ACE2', width: wp(10), marginHorizontal: wp(7.6) }}>
          <Tab
            textStyle={{ color: '#aeaeae', fontWeight: 'bold', letterSpacing: 1 }}
            activeTextStyle={{ color: '#20ACE2', fontWeight: 'bold', letterSpacing: 1 }}
            tabStyle={{ backgroundColor: "white" }}
            activeTabStyle={{ backgroundColor: "white" }}
            heading="Events">
            <Events events={allEvents}
              navigation={this.props.navigation}
              pressInterestEvent={(id) => this.pressInterest(id)}
              pressGoingEvent={(id) => this.pressGoing(id)}
              goToCreate={this.props.navigation}
              showButtons={false}
              aboutModal={this.showAboutModal}
            />

          </Tab>
          <Tab textStyle={{ color: '#aeaeae', fontWeight: 'bold', letterSpacing: 1 }} activeTextStyle={{ color: '#20ACE2', fontWeight: 'bold', letterSpacing: 1 }} tabStyle={{ backgroundColor: "white" }} activeTabStyle={{ backgroundColor: "white" }} heading="My Events">
            <MyEvents
              navigation={this.props.navigation}
              pressInterestEvent={(id) => this.pressInterest(id)}
              pressGoingEvent={(id) => this.pressGoing(id)}
              events={myEvents}
              aboutModal={this.showAboutModal} />
          </Tab>
          <Tab textStyle={{ color: '#aeaeae', fontWeight: 'bold', letterSpacing: 1 }} activeTextStyle={{ color: '#20ACE2', fontWeight: 'bold', letterSpacing: 1 }} tabStyle={{ backgroundColor: "white" }} activeTabStyle={{ backgroundColor: "white" }} heading="Going">
            <Going
              navigation={this.props.navigation}

              pressInterestEvent={(id) => this.pressInterest(id)}
              pressGoingEvent={(id) => this.pressGoing(id)}
              events={GoingEvents}
              aboutModal={this.showAboutModal} />
          </Tab>
          <Tab textStyle={{ color: '#aeaeae', fontWeight: 'bold', letterSpacing: 1 }} activeTextStyle={{ color: '#20ACE2', fontWeight: 'bold', letterSpacing: 1 }} tabStyle={{ backgroundColor: "white" }} activeTabStyle={{ backgroundColor: "white" }} heading="Not Going">
            <Events
              navigation={this.props.navigation}
              pressInterestEvent={(id) => this.pressInterest(id)}
              pressGoingEvent={(id) => this.pressGoing(id)}
              events={allEvents}
              showButtons={true}
              aboutModal={this.showAboutModal} />
          </Tab>

          <Tab textStyle={{ color: '#aeaeae', fontWeight: 'bold', letterSpacing: 1 }} activeTextStyle={{ color: '#20ACE2', fontWeight: 'bold', letterSpacing: 1 }} tabStyle={{ backgroundColor: "white" }} activeTabStyle={{ backgroundColor: "white" }} heading="Interested">
            <Interested
              navigation={this.props.navigation}
              pressInterestEvent={(id) => this.pressInterest(id)}
              pressGoingEvent={(id) => this.pressGoing(id)}
              events={InterestedEvents}
              aboutModal={this.showAboutModal} />

          </Tab>
          <Tab textStyle={{ color: '#aeaeae', fontWeight: 'bold', letterSpacing: 1 }} activeTextStyle={{ color: '#20ACE2', fontWeight: 'bold', letterSpacing: 1 }} tabStyle={{ backgroundColor: "white", }} activeTabStyle={{ backgroundColor: "white" }} heading="Invited">
            <Invited
              navigation={this.props.navigation}
              events={InvitedEvents}
              pressInterestEvent={(id) => this.pressInterest(id)}
              pressGoingEvent={(id) => this.pressGoing(id)}
              aboutModal={this.showAboutModal} />

          </Tab>
          <Tab textStyle={{ color: '#aeaeae', fontWeight: 'bold', letterSpacing: 1 }} activeTextStyle={{ color: '#20ACE2', fontWeight: 'bold', letterSpacing: 1 }} tabStyle={{ backgroundColor: "white" }} activeTabStyle={{ backgroundColor: "white" }} heading="Past">
            <Past
              navigation={this.props.navigation}
              events={pastEvents}
              aboutModal={this.showAboutModal} />

          </Tab>
        </Tabs>
      </View>
    );
  }
}
const mapStateToProps = state => ({
  events: state.events.events,
  
});

const mapDispatchToProps = dispatch => ({
  addEvents: event => dispatch(addEvents(event))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TabsExample);