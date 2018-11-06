import React from 'react';
import { StyleSheet, Text, View, Platform, StatusBar } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AddEntry from './components/AddEntry';
import History from './components/History';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Reducer from './reducers';
import { TabNavigator } from 'react-navigation';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { purple, white } from './utils/colors';
import { Constants } from 'expo'

function UdaciStatusBar({backgroundColor, ...props}){
  return(
    <View style={{backgroundColor,height: Constants.statusBarHeight}}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props}/>
    </View>
  )
}


const Tabs = TabNavigator({
  History:{
    screen: History,
    navigationOptions: {
      tabBarLevel: 'History',
      tabBarIcons: ({tintColor}) => <Ionicons name={ios-bookmarks} size={30} color={tintColor}/>
    }
  },
  AddEntry:{
    screen: AddEntry,
    navigationOptions: {
      tabBarLevel: 'Add Entry',
      tabBarIcons: ({tintColor}) => <FontAwesome name={plus-square} size={30} color={tintColor}/>
    }
  },
},{
  navigationOptions:{
    header: null
  },
  tabBarOptions:{
    activeTintColor: Platform.OS === 'ios' ? purple : white,
    style: {
      height: 56,
      backgroundColor: Platform.OS === 'ios' ? white : purple,
      shadowColor: 'rgba(0,0,0,0.24)',
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 6,
      shadowOpacity: 1
    }
  }
})

export default class App extends React.Component {
  render() {
    return (
      <Provider store={createStore(Reducer)}>
        <View style={{flex: 1}}>
          <UdaciStatusBar backgroundColor={purple} barStyle='light-content'/>
          <Tabs />
        </View>
      </Provider>
    );
  }
}


