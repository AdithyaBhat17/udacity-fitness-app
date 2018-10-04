import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { getMetricMetaInfo, timeToString } from '../utils/helpers';
import Sliders from './Slider';
import Stepper from './Stepper';
import DateHeader from './DateHeader';

function SubmitBtn({onPress}){
    return(
        <TouchableOpacity
         style={styles.btn} 
         onPress={onPress}>
            <Text style={styles.btnText}>SUBMIT</Text>
        </TouchableOpacity>
    )
}

export default class AddEntry extends React.Component{
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

        this.setState({
            run:0,
            bike:0,
            swim:0,
            sleep:0,
            eat:0
        });
    }

    render(){
        const metaInfo = getMetricMetaInfo();

        return(
            <View>
                <DateHeader date={(new Date()).toLocaleDateString()}/>
                {Object.keys(metaInfo).map(key => {
                    const {type, getIcon, ...rest} = metaInfo[key];
                    const value = this.state[key];
                    return (
                        <View key={key}>
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
    btn: {
        marginLeft: 110,
        marginRight:110,
        backgroundColor: `#161743`,
        padding: 10,
        borderRadius: 40
    },
    btnText: {
        color: `#fff`,   
        fontWeight: `bold`,
        textAlign:`center`,
        fontSize: 24
    }
})