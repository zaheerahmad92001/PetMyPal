import React, { PureComponent } from 'react';
import { View, TextInput, StyleSheet, Dimensions , TouchableOpacity} from 'react-native';
import PropTypes, { number } from 'prop-types';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { black, darkSky, grey } from '../../constants/colors';
import { Platform } from 'react-native';


class OTPTextView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      focusedInput: 0,
      otpText: [],
      runOnce:true
    };
    this.inputs = [];
  }

  componentDidMount() {
    const { defaultValue, cellTextLength} = this.props;
    this.otpText = defaultValue.match(
      new RegExp('.{1,' + cellTextLength + '}', 'g'),
    );
    
  }

  
 removeOptValue=()=>{
    const {inputCount} = this.props
    for(let i= 4; i-- ; i>inputCount){
      this.inputs[i].clear()
      this.inputs[i].focus()
    }
    this.setState({otpText:[]})
  // remove value on POPUP ok butn   
  this.props.StopRemovingOTPValue(false)
    // this.setState({runOnce:false})
  }


  onTextChange = (text, i) => {
    const { cellTextLength, inputCount, handleTextChange } = this.props;

    if (/^\d+$/.test(text)) {
      this.setState(
        prevState => {
          let { otpText } = prevState;
          otpText[i] = text;
          return {
            otpText,
          };
        },
        () => {
          handleTextChange(this.state.otpText.join(''));
          if (text.length === cellTextLength && i !== inputCount - 1) {
            this.inputs[i + 1].focus();
          }
        },
      );
    } else { 
  /******** To Remove the value from box  *********/
      this.inputs[i].clear()
      this.setState(
        prevState => {
          let { otpText } = prevState;
          otpText[i] = text;
          return {
            otpText,
          };
        },
        () => {
          handleTextChange(this.state.otpText.join(''));
        })
    }

  };



  onInputFocus = i => {
    this.setState({ focusedInput: i });

  };

  handleBorderColor = (index) => {
    const {focusedInput} = this.state
    return index === this.state.focusedInput ? darkSky :grey
  }

  onKeyPress = (e, i) => {
    const { otpText = [] } = this.state;
    if (e.nativeEvent.key === 'Backspace' && i !== 0) {
      this.inputs[i - 1].focus();
    }
  };

  render() {
    const {
      inputCount,
      offTintColor,
      tintColor,
      defaultValue,
      cellTextLength,
      containerStyle,
      textInputStyle,
      removeText,
      ...textInputProps
    } = this.props;

    const TextInputs = [];

    for (let i = 0; i < inputCount; i += 1) {
      let defaultChars = [];
      if (defaultValue) {
        defaultChars = defaultValue.match(
          new RegExp('.{1,' + cellTextLength + '}', 'g'),
        );
      }
      const inputStyle = [
        styles.textInput,
        textInputStyle && textInputStyle,
        { borderColor: grey },
        // {borderColor: offTintColor},
      ];


      TextInputs.push(
        <TextInput
          ref={e => {
            this.inputs[i] = e;
          }}
          key={i}
          defaultValue={defaultValue ? defaultChars[i] : ''}
          style={[inputStyle,{borderColor:this.handleBorderColor(i)}]}
          maxLength={this.props.cellTextLength}
          onFocus={() => this.onInputFocus(i)}
          onChangeText={text => this.onTextChange(text, i)}
          multiline={false}
          keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}
          onKeyPress={e => this.onKeyPress(e, i)}
          {...textInputProps}
        />,
      );
    }
  
    // {
    //   this.state.runOnce && removeText &&
    //     this.removeOptValue()
      
    // }

    { removeText &&
        this.removeOptValue()
    }
    
    return <View style={[styles.container, containerStyle]}>{TextInputs}</View>;
  
  }
}

OTPTextView.propTypes = {
  defaultValue: PropTypes.string,
  inputCount: PropTypes.number,
  containerStyle: PropTypes.object,
  textInputStyle: PropTypes.object,
  cellTextLength: PropTypes.number,
  tintColor: PropTypes.string,
  offTintColor: PropTypes.string,
  handleTextChange: PropTypes.func,
  inputType: PropTypes.string,
};

OTPTextView.defaultProps = {
  defaultValue: '',
  inputCount: 4,
  tintColor: '#3CB371',
  offTintColor: '#DCDCDC',
  cellTextLength: 1,
  containerStyle: {},
  textInputStyle: {},
  handleTextChange: () => { },
};

export default OTPTextView;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(4),
  },
  textInput: {
    height: 50,
    width: 50,
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    color: black,
  },
});
