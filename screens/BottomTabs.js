import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer, useNavigation } from "@react-navigation/native"
import Dashboard from "./Dashboard";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import AddProduct from "./AddProduct";
import Help from "./Help";
import Scanner from "./Scanner";
import { COLORS, icons } from "../constants";
import Settings from "./Settings";
import ScanNew from "./ScanNew";
import AddSale from "./AddSale";
import AllProducts from './AllProducts';
import ViewProduct from './ViewProduct';
import EditProduct from './EditProduct';
import ExpiringSoon from './ExpiringSoon';
import CheckOut from './CheckOut';
import AllSales from './AllSales';
import Invoice from './Invoice';
import TodaysSales from './TodaysSales';
import OutOfStock from './OutOfStock';
import Charts from './Charts';
import Calculator from './Calculator';
import Expenses from './Expenses';
import AddExpenses from './AddExpenses';
import ViewExpenses from './ViewExpenses';
import Customers from './Customers';
import AddCustomer from './AddCustomer';
import ViewCustomer from './ViewCustomer';
import Debtors from './Debtors';
import AddDebtor from './AddDebtor';
import ViewDebtor from './ViewDebtor';
import ExpiredProducts from './ExpiredProducts';

const Tab = createBottomTabNavigator();


const CustomTabBarButton = ({ children, onPress }) => (
    <TouchableOpacity
        style={{
            top: -30,
            justifyContent: 'center',
            alignItems: 'center',
            ...styles.shadow
        }}
        onPress={onPress}
    >
        <View
            style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLORS.emerald
            }}
        >
            <Image
                source={icons.qr}
                resizeMode='contain'
                style={{
                    width: 60,
                    height: 60,
                    tintColor: COLORS.white
                }}
            />
        </View>
    </TouchableOpacity>
)

const BottomTabs = () => {
    return (

        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                style: {
                    position: 'absolute',
                    bottom: 25,
                    left: 20,
                    right: 20,
                    elevation: 0,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 15,
                    height: 90,
                    ...styles.shadow

                }
            }}
            initialRouteName={'Dashboard'}

                
        >
            <Tab.Screen name="Dashboard" component={Dashboard}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', top: 2 }}>
                            <Image
                                source={icons.home}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: focused ? COLORS.secondary : COLORS.emerald
                                }}
                            />
                            <Text style={{ color: focused ? COLORS.secondary : COLORS.emerald, fontSize: 12 }} >Dashboard</Text>
                        </View>
                        ),
                }}
            />
            <Tab.Screen name="ScanNew" component={ScanNew}
            options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', top: 2 }}>
                        <Image
                            source={icons.plus}
                            resizeMode='contain'
                            style={{
                                width: 25,
                                height: 25,
                                tintColor: focused ? COLORS.secondary : COLORS.emerald
                            }}
                        />
                        <Text style={{ color: focused ? COLORS.secondary : COLORS.emerald, fontSize: 12 }} >Add</Text>
                    </View>
                ),
                }}
            />
            <Tab.Screen name="Scanner" component={Scanner}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', top: 10 }}>
                            
                            <Text style={{ color: focused ? COLORS.secondary : COLORS.emerald, fontSize: 12 }} >Sale</Text>
                        </View>
                    ),
                    tabBarButton: (props) => (
                        <CustomTabBarButton {...props} />
                    )
                }}
                
            />
            <Tab.Screen name="Settings" component={Settings}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', top: 2 }}>
                            <Image
                                source={icons.settings}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: focused ? COLORS.secondary : COLORS.emerald
                                }}
                            />
                            <Text style={{ color: focused ? COLORS.secondary : COLORS.emerald, fontSize: 12 }} >Settings</Text>
                        </View>
                    ),
                }}
            />

            <Tab.Screen name="Help" component={Help}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', top: 2 }}>
                            <Image
                                source={icons.info}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: focused ? COLORS.secondary : COLORS.emerald
                                }}
                            />
                            <Text style={{ color: focused ? COLORS.secondary : COLORS.emerald, fontSize: 12 }} >Help</Text>
                        </View>
                    ),
                }}
            />

            <Tab.Screen name="AddProduct" component={AddProduct}
                options={{
                    tabBarButton: () => null,
                    tabBarVisible: false,
                }}
            />

            <Tab.Screen name="AddSale" component={AddSale}
                options={{
                    tabBarButton: () => null,
                    tabBarVisible: false,
                }}
            />

            <Tab.Screen name="AllProducts" component={AllProducts}
                options={{
                    tabBarButton: () => null,
                    tabBarVisible: false,
                }}
            />

            <Tab.Screen name="ViewProduct" component={ViewProduct}
                options={{
                    tabBarButton: () => null,
                    tabBarVisible: false,
                }}
            />

            <Tab.Screen name="EditProduct" component={EditProduct}
                options={{
                    tabBarButton: () => null,
                    tabBarVisible: false,
                }}
            />

            <Tab.Screen name="ExpiringSoon" component={ExpiringSoon}
                options={{
                    tabBarButton: () => null,
                    tabBarVisible: false,
                }}
            />

            <Tab.Screen name="CheckOut" component={CheckOut}
                options={{
                    tabBarButton: () => null,
                    tabBarVisible: false,
                }}
            />

            <Tab.Screen name="AllSales" component={AllSales}
                options={{
                    tabBarButton: () => null,
                    tabBarVisible: false,
                }}
            />

            <Tab.Screen name="Invoice" component={Invoice}
                options={{
                    tabBarButton: () => null,
                    tabBarVisible: false,
                }}
            />

            <Tab.Screen name="TodaysSales" component={TodaysSales}
                options={{
                    tabBarButton: () => null,
                    tabBarVisible: false,
                }}
            />

            <Tab.Screen name="OutOfStock" component={OutOfStock}
                options={{
                    tabBarButton: () => null,
                    tabBarVisible: false,
                }}
            />

            <Tab.Screen name="Charts" component={Charts}
                options={{
                    tabBarButton: () => null,
                    tabBarVisible: false,
                }}
            />

            <Tab.Screen name="Calculator" component={Calculator}
                options={{
                    tabBarButton: () => null,
                    tabBarVisible: false,
                }}
            />

<Tab.Screen name="Expenses" component={Expenses}
                options={{
                    tabBarButton: () => null,
                    tabBarVisible: false,
                }}
            />
<Tab.Screen name="AddExpenses" component={AddExpenses}
                options={{
                    tabBarButton: () => null,
                    tabBarVisible: false,
                }}
            />

<Tab.Screen name="ViewExpenses" component={ViewExpenses}
                options={{
                    tabBarButton: () => null,
                    tabBarVisible: false,
                }}
            />

<Tab.Screen name="Customers" component={Customers}
                options={{
                    tabBarButton: () => null,
                    tabBarVisible: false,
                }}
            />

            <Tab.Screen name="AddCustomer" component={AddCustomer}
                            options={{
                                tabBarButton: () => null,
                                tabBarVisible: false,
                            }}
                        />
            
            <Tab.Screen name="ViewCustomer" component={ViewCustomer}
                options={{
                    tabBarButton: () => null,
                    tabBarVisible: false,
                }}
            />
            
            <Tab.Screen name="Debtors" component={Debtors}
                options={{
                    tabBarButton: () => null,
                    tabBarVisible: false,
                }}
            />
            
            <Tab.Screen name="AddDebtor" component={AddDebtor}
                options={{
                    tabBarButton: () => null,
                    tabBarVisible: false,
                }}
            />
            
            <Tab.Screen name="ViewDebtor" component={ViewDebtor}
                options={{
                    tabBarButton: () => null,
                    tabBarVisible: false,
                }}
            />

<Tab.Screen name="ExpiredProducts" component={ExpiredProducts}
                options={{
                    tabBarButton: () => null,
                    tabBarVisible: false,
                }}
            />
            
            </Tab.Navigator>


    );
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#7F5DF0',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.5,
        elevation: 5
    }
})

export default BottomTabs;