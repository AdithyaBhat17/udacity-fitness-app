import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AddEntry from './components/AddEntry';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Reducer from './reducers';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={createStore(Reducer)}>
        <View>
          <AddEntry/>
        </View>
      </Provider>
    );
  }
}


