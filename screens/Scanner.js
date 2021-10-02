import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import { COLORS, SIZES, FONTS, icons, images } from "../constants"
import { STYLES } from "../constants/theme";

import AsyncStorage from '@react-native-async-storage/async-storage';

import { LinearGradient } from 'expo-linear-gradient';

const Scanner = ({ navigation }) => {

    let title = "Scan Product"

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
                    routes: [{ name: 'AddSale', params: {'scannedcode': ''} }],
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

    function renderLogo() {
        return (<View
            style={{
                marginTop: SIZES.padding * 5,
                height: 170,
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Image
                source={images.logo}
                style={{ height: 80, width: 80, tintColor: COLORS.white }}
            />

            {renderButton()}

        </View>
        )
    }

    function renderButton() {
        return (
            <View style={{
                margin: SIZES.padding * 1
            }}>

                        <TouchableOpacity
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                    onPress={() => navigation.reset({
                        index: 0,
                        routes: [{
                            name: 'AllProducts',
                        }],
                    })}
                        >
                    <LinearGradient
                        colors={[COLORS.white, COLORS.white]}
                                style={STYLES.defaultButton}
                            >
                        <Text style={{
                            color: COLORS.emerald,
                            fontWeight: 'bold',
                            fontSize: 20
                        }}>Search Product  <Image
                                source={icons.search}
                                style={{
                                    height: 20,
                                    width: 20,
                                    tintColor: COLORS.emerald
                                }}
                            /></Text>
                    </LinearGradient>

                   
                        </TouchableOpacity>
            </View>
        )
    }

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [code, setCode] = useState(null);


    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        setCode(data)
        
//        await AsyncStorage.setItem("newlyScanned", data);
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
            colors={[COLORS.green, COLORS.emerald]}
            style={{ flex: 1 }}
        >
            {renderHeader()}
            {renderLogo()}

            <View style={styles.container}>


                <BarCodeScanner
                    onBarCodeScanned={scanned && code != null ?
                        navigation.reset({
                            index: 0,
                            routes: [{
                                name: 'AddSale',
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


export default Scanner;