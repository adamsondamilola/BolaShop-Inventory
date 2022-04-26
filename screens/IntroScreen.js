import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Image, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Text, Menu } from 'react-native-paper';
import { COLORS, SIZES, FONTS, icons, images } from "../constants"
import { STYLES } from "../constants/theme";

import AsyncStorage from '@react-native-async-storage/async-storage';

import { LinearGradient } from 'expo-linear-gradient';
import { BarCodeScanner } from 'expo-barcode-scanner';

const IntroScreen = ({ route, navigation }) => {
    const [iHaveUsedCamera, setIHaveUsedCamera] = useState(AsyncStorage.getItem('iHaveUsedCamera'));
    let title = "Welcome"

    const continueWithCamera = async () => {
        let x = null;
        try {
            x = await AsyncStorage.getItem('welcomeNewUser')
        } catch (e) {
            console.log(e)
        }
        if (x === null) {
            await AsyncStorage.setItem('welcomeNewUser', 'YES');
            //const { status } = await BarCodeScanner.requestPermissionsAsync();
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Dashboard' }],
                })
            
        }
    }

    function renderHeader() {
        return (
            <TouchableOpacity
                style={STYLES.headerTitleView}
                onPress={() =>
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Dashboard' }],
                    })
                }
            >
                <Image
                    source={icons.back}
                    resizeMode="contain"
                    style={{
                        width: 20,
                        height: 20,
                        tintColor: COLORS.white
                    }}
                />

                <Text style={{ marginLeft: SIZES.padding * 1.5, color: COLORS.white, ...FONTS.h4 }}>{title}</Text>
            </TouchableOpacity>
        )
    }


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={{ flex: 1 }}
        >

            <LinearGradient
                colors={[COLORS.orange, COLORS.lightOrange]}
                style={{ flex: 1 }}
            >
                <View>

                    {renderHeader()}

                </View>

                <SafeAreaView style={STYLES.signupFooter}>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        style={{ marginBottom: 25, marginTop: 2 }}
                    >

                        <Menu.Item icon="camera" title="Camera Permission" />


                        <Text>Welcome onboard! </Text>
                        <Text>Bola Shop Inventory is an offline mobile inventory app.
                            In other words, no internet is required to use all the features on this app. </Text>
                        <Text>{"\n"}However, there are some features on this app that requires camera permission{"\n"}</Text>
                        <Text>Below are the reasons we request for camera permission</Text>

                        <View style={{ flex: 1 }}>
                            <Menu.Item icon="barcode" title="To Scan Code" />
                            <Text>Products code are scanned before it gets added to the App.</Text>

                            <Menu.Item icon="qrcode" title="To Add Product" />
                            <Text>Product Bar code and QR code are scanned with the help of camera. </Text>

                            <Menu.Item icon="cart" title="For Sales:" />
                            <Text>Camera is also used for scanning code to add product to cart.{"\n"}</Text>

                        </View>
                        <Text>If you are okay with these reasons listed above, kindly click the continue button below and grant permission to use camera.{"\n"}</Text>

                        <View style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>


                            <TouchableOpacity
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 300,
                                    marginBottom: 50
                                }}
                                onPress={() => { continueWithCamera() }}
                            >
                                <LinearGradient
                                    colors={[COLORS.secondary, COLORS.primary]}
                                    style={STYLES.defaultButton}
                                >
                                    <Text style={{
                                        color: '#fff',
                                        fontWeight: 'bold'
                                    }}>Continue</Text>
                                </LinearGradient>

                            </TouchableOpacity>
                        </View>

                    </ScrollView>

                </SafeAreaView>

            </LinearGradient>
        </KeyboardAvoidingView>
    )

}

export default IntroScreen;