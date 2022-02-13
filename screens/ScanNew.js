import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';


import { COLORS, SIZES, FONTS, icons, images } from "../constants"
import { STYLES } from "../constants/theme";

import AsyncStorage from '@react-native-async-storage/async-storage';

import { LinearGradient } from 'expo-linear-gradient';
import randomString from '../constants/randomString';

const ScanNew = ({ navigation }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [code, setCode] = useState(null);
    const [scannerVisible, setScannerVisible] = useState(true);
    let title = "Scan New Product"

    function renderHeader() {
        return (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    alignItems: "center",
                    marginTop: SIZES.padding * 6,
                    paddingHorizontal: SIZES.padding * 2
                }}
                onPress={() => navigation.reset({
                    index: 0,
                    routes: [{ name: 'AllProducts' }],
                })
                }
            >
                <Image
                    source={icons.back}
                    resizeMode="contain"
                    style={{
                        width: 20,
                        height: 20,
                        tintColor: COLORS.secondary
                    }}
                />

                <Text style={{ marginLeft: SIZES.padding * 1.5, color: COLORS.secondary, ...FONTS.h4 }}>{title}</Text>
            </TouchableOpacity>
        )
    }

    function renderLogo() {
        return (<View
            style={{
                marginTop: SIZES.padding * 1,
                height: 170,
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Image
                source={images.logo}
                style={{ height: 80, width: 80, tintColor: COLORS.secondary }}
            />

            {renderButton()}

        </View>
        )
    }

    const addWithoutQr = () => {
        setIsLoading(true)
        setScanned(true);
        setCode(randomString.createRandom(15))

        if (scanned && code !== null) {
            navigation.reset({
                index: 0,
                routes: [{
                    name: 'AddProduct',
                    params: {
                        scanned: scanned,
                        scannedcode: code,
                    }
                }],
            })
        }
        setIsLoading(false)

    }

    function renderButton() {
        return (
            <View style={{
                margin: SIZES.padding * 1
            }}>

                {isLoading ?
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 20
                        }}
                    >
                        <Image source={images.loader} style={{
                            width: 40, height: 40
                        }} />
                    </TouchableOpacity> :
                    (
                        <TouchableOpacity
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onPress={() => addWithoutQr()}
                        >
                            <LinearGradient
                                colors={[COLORS.secondary, COLORS.secondary]}
                                style={STYLES.defaultButton}
                            >
                                <Text style={{
                                    color: COLORS.white,
                                    fontWeight: 'bold'
                                }}>Add Without Code
                                     <Image
                                        source={icons.plus}
                                        style={{
                                            height: 20,
                                            width: 20,
                                            tintColor: COLORS.white
                                        }}
                                    /></Text>
                            </LinearGradient>

                        </TouchableOpacity>
                    )}
            </View>
        )
    }
    



    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScannerVisible(false)
        setScanned(true);
        setCode(data)
        //        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    };

    if (hasPermission === null) {

        //        return <Text>Requesting for camera permission</Text>;
        console.log("Allow camera access!")

    }
    if (hasPermission === false) {
        //return <Text>No access to camera</Text>;
        alert("No camera access!");
    }

    return (
        <LinearGradient
            colors={[COLORS.white, COLORS.white]}
            style={{ flex: 1 }}
        >
            {renderHeader()}
            {renderLogo()}
            {scannerVisible ?
                <View style={styles.container}>

                    <BarCodeScanner
                        onBarCodeScanned={scanned && code != null ?
                            navigation.reset({
                                index: 0,
                                routes: [{
                                    name: 'AddProduct',
                                    params: {
                                        scanned: scanned,
                                        scannedcode: code,
                                    }
                                }],
                            }) : handleBarCodeScanned}
                        style={StyleSheet.absoluteFillObject}
                    />

                    <Image
                        source={icons.scanning}
                        style={{
                            height: 200,
                            width: 200,
                            padding: 5,
                            alignItems: 'center',
                            tintColor: COLORS.white
                        }}
                    />
                    {/*{scanned ? actionsButton() : null }*/}
                    {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
                </View>
                : navigation.reset({
                    index: 0,
                    routes: [{
                        name: 'AddProduct',
                        params: {
                            scanned: scanned,
                            scannedcode: code,
                        }
                    }],
                })}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
});


export default ScanNew;