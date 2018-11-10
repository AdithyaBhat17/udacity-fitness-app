import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { getMetricMetaInfo, timeToString, getDailyReminderValue, clearLocalNotification, setLocalNotification } from '../utils/helpers';
import Sliders from './Slider';
import Stepper from './Stepper';
import DateHeader from './DateHeader';
import TextButton from './TextButton';
import { Ionicons } from '@expo/vector-icons';
import { submitEntry, resetEntry } from '../utils/api';
import { addEntry } from '../actions';
import { connect } from 'react-redux'; 
import { NavigationActions } from 'react-navigation';

function SubmitBtn({onPress}){
    return(
        <TouchableOpacity
         style={styles.btn} 
         onPress={onPress}>
            <Text style={styles.btnText}>SUBMIT</Text>
        </TouchableOpacity>
    )
}

class AddEntry extends React.Component{
    state = {
        run: 0,
        bike: 0,
        swim: 0,
        sleep: 0,
        eat: 0
    }

    increment = (metric) => {
        const { step, max } = getMetricMetaInfo(metric);
        this.setState((state) => {
            const count = state[metric] + step;
            return {
                ...state,
                [metric]: count > max ? max : count
            }
        }) 
    }

    decrement = (metric) => {
        this.setState((state) => {
            const count = state[metric] - getMetricMetaInfo(metric).step;
            return {
                ...state,
                [metric]: count < 0 ? 0 : count
            }
        }) 
    }
    //for the sliders
    slide = (metric, value) => {
        this.setState(() => ({
            [metric]: value
        }))
    }

    submit = () => {
        const key = timeToString();
        const entry = this.state;

        this.props.dispatch(addEntry({
            [key]: entry
        }))

        this.setState({
            run:0,
            bike:0,
            swim:0,
            sleep:0,
            eat:0
        });

        this.toHome()

        submitEntry({key, entry});
        clearLocalNotification()
        .then(setLocalNotification())
    }

    reset = () => {
        const key = timeToString()

        //Update redux
        this.props.dispatch(addEntry({
            [key]: getDailyReminderValue()
        }))
        this.toHome()
        //Update the DB
        resetEntry(key);
    }

    toHome = () => {
        this.props.navigation.dispatch(NavigationActions.back({
            key: 'AddEntry'
        }))
    }

    render(){
        const metaInfo = getMetricMetaInfo();

        if(this.props.alreadyLogged){
            return(
                <View style={styles.center}>
                    <Ionicons
                        name={ Platform.OS === 'ios' ? 'ios-happy-outline' : 'md-happy' }
                        size={100}
                    />
                    <Text>You already logged your information for the day</Text>
                    <TextButton style={{padding: 10}} onPress={this.reset}>
                        RESET
                    </TextButton>
                </View>
            )
        }

        return(
            <View style={styles.container}>
                <DateHeader date={(new Date()).toLocaleDateString()}/>
                {Object.keys(metaInfo).map(key => {
                    const {type, getIcon, ...rest} = metaInfo[key];
                    const value = this.state[key];
                    return (
                        <View key={key} style={styles.row}>
                            {getIcon()}
                            {type === 'slider'
                            ? <Sliders
                                value={value}
                                onChange={(value) => this.slide(key, value)}
                                {...rest}
                              />
                            : <Stepper
                                value={value}
                                onIncrement={() => this.increment(key)}
                                onDecrement={() => this.decrement(key)}
                                {...rest}
                              />
                            }
                        </View>
                    )
                })}
                <SubmitBtn onPress={this.submit}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },  
    row: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    },
    btn: {
        marginLeft: 110,
        marginRight:110,
        backgroundColor: `#161743`,
        padding: 10,
        borderRadius: 8
    },
    btnText: {
        color: `#fff`,   
        fontWeight: `bold`,
        textAlign:`center`,
        fontSize: 24
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 30,
        marginRight: 30
    }
});

function mapStateToProps (state) {
    const key = timeToString()
  
    return {
      alreadyLogged: state[key] && typeof state[key].today === 'undefined'
    }
  }

export default connect(mapStateToProps)(AddEntry);