import React from 'react';
import { View, Slider, Text } from 'react-native';

export default function Sliders({max, step, unit, value, onChange}){
    return(
        <View>
            <Slider
             step={step}
             maximumValue={max}
             minimumValue={0}
             value={value}
             onValueChange={onChange}
            />
            <View>
                <Text>{value}</Text>
                <Text>{unit}</Text>
            </View>
        </View>
    );
}