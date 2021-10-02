import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme, useNavigation } from '@react-navigation/native';

import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Settings from './screens/Settings';
import Scanner from './screens/Scanner';
import Dashboard from './screens/Dashboard';
import BottomTabs from './screens/BottomTabs';
import AddProduct from './screens/AddProduct';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        border: "transparent",
    },
};


const Stack = createStackNavigator();
const Tab = createStackNavigator();


export default function App() {


    return (
        <NavigationContainer theme={theme}>
            <BottomTabs/>

        </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
