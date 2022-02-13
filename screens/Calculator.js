import React, { useEffect, useState } from "react";
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    FlatList,
    KeyboardAvoidingView,
    ScrollView,
    SafeAreaView,
    Platform,
} from "react-native"
import { LinearGradient } from 'expo-linear-gradient'
import { TextInput, Text } from 'react-native-paper';


import { COLORS, SIZES, FONTS, icons, images } from "../constants"
import { STYLES } from "../constants/theme";
import number_format from "../constants/number_format";


const Calculator = ({ route, navigation }) => {

    const [numberEntered, setNumberEntered] = useState('')
    const [result, setResult] = useState(null)

    const title = "Calculator"
    
    let calcNums = [
        {
            "id": 1,
            "num": 1,
            "color": COLORS.emerald,
            "background": COLORS.white
        },
        {
            "id": 2,
            "num": 2,
            "color": COLORS.emerald,
            "background": COLORS.white
        },
        {
            "id": 3,
            "num": 3,
            "color": COLORS.emerald,
            "background": COLORS.white
        },
        {
            "id": 4,
            "num": 4,
            "color": COLORS.emerald,
            "background": COLORS.white
        },
        {
            "id": 5,
            "num": 5,
            "color": COLORS.emerald,
            "background": COLORS.white
        },
        {
            "id": 6,
            "num": 6,
            "color": COLORS.emerald,
            "background": COLORS.white
        },
        {
            "id": 7,
            "num": 7,
            "color": COLORS.emerald,
            "background": COLORS.white
        },
        {
            "id": 8,
            "num": 8,
            "color": COLORS.emerald,
            "background": COLORS.white
        },
        {
            "id": 9,
            "num": 9,
            "color": COLORS.emerald,
            "background": COLORS.white
        },
        {
            "id": 10,
            "num": 0,
            "color": COLORS.emerald,
            "background": COLORS.white
        }
        ,
        {
            "id": 11,
            "num": "+",
            "color": COLORS.tealGreen,
            "background": COLORS.white
        }
        ,
        {
            "id": 12,
            "num": "-",
            "color": COLORS.secondary,
            "background": COLORS.white
        },
        {
            "id": 13,
            "num": "*",
            "color": COLORS.purple,
            "background": COLORS.white
        }
        ,
        {
            "id": 14,
            "num": "/",
            "color": COLORS.black,
            "background": COLORS.white
        }
        ,
         {
            "id": 15,
            "num": "<",
            "color": COLORS.blueGrotto,
            "background": COLORS.white
        },
        {
            "id": 16,
            "num": "C",
            "color": COLORS.primary,
            "background": COLORS.white
        }
        

    ]

    const [calNum, setCalNum] = useState(calcNums)


    function renderNumbers() {

        const renderItem = ({ item }) => (
            <TouchableOpacity
                style={{ width: 80, height: 80}}
                onPress={() => actionsButton(item.num)}
            >
                <View
                    style={styles.shadowContainerStyle}
                >
                    <Text style={{
                        color: item.color, fontSize: 25
                    }}> {item.num} </Text>
                </View>
            </TouchableOpacity>
        )

        return (
            <FlatList
                data={calNum}
                numColumns={4}
                keyExtractor={item => `${item.id}`}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                renderItem={renderItem}
                style={{ marginTop: SIZES.padding * 1 }}
            />
        )
    }


    const actionsButton = (btnText) => {

        let oldEntry = "";
        let newEntry = "";

        //if (numberEntered === 0) setNumberEntered(btnText.toString())
        //if (numberEntered === '') setNumberEntered(btnText.toString())
        //if (numberEntered === null) setNumberEntered(btnText.toString())

        if (btnText === "+")
        {
            if (numberEntered.length > 0) {

                if (isNaN(numberEntered.slice(-1)) === true && btnText !== numberEntered.slice(-1)) {
                    setNumberEntered(numberEntered.slice(0, -1) + btnText)
                }
                else if (isNaN(numberEntered.slice(-1)) === false) {
                    newEntry += btnText.toString()
                    setNumberEntered(numberEntered + newEntry)
                }
            }
        }

        else if (btnText === "C") {
    setNumberEntered('')
}
        else if (btnText === "<") {
            let x = numberEntered.slice(0, -1)
            
            if (numberEntered.length === 1) { setNumberEntered("") }

            if (x) {
                setNumberEntered(x)
                if (isNaN(x.slice(-1)) === false) {
                    setResult(eval(x))
                }
            }
        }

        else if (btnText === "-") {

            if (numberEntered.length > 0) {
                
                if (isNaN(numberEntered.slice(-1)) === true && btnText !== numberEntered.slice(-1))
                {
                setNumberEntered(numberEntered.slice(0, -1) + btnText)
                }
                else if (isNaN(numberEntered.slice(-1)) === false)
                {
                    newEntry += btnText.toString()
                    setNumberEntered(numberEntered + newEntry)
                }
            }
        }

        else if (btnText === "*") {
            if (numberEntered.length > 0) {

                if (isNaN(numberEntered.slice(-1)) === true && btnText !== numberEntered.slice(-1)) {
                    setNumberEntered(numberEntered.slice(0, -1) + btnText)
                }
                else if (isNaN(numberEntered.slice(-1)) === false) {
                    newEntry += btnText.toString()
                    setNumberEntered(numberEntered + newEntry)
                }
            }
        }

        else if (btnText === "/") {
            if (numberEntered.length > 0) {

                if (isNaN(numberEntered.slice(-1)) === true && btnText !== numberEntered.slice(-1)) {
                    setNumberEntered(numberEntered.slice(0, -1) + btnText)
                }
                else if (isNaN(numberEntered.slice(-1)) === false) {
                    newEntry += btnText.toString()
                    setNumberEntered(numberEntered + newEntry)
                }
            }
        }

        else {

            if (btnText === 0 && numberEntered === '') {
                setNumberEntered(numberEntered)
            }
            else if (numberEntered.slice(0, -1) === "0" && btnText === 0) {
                setNumberEntered(numberEntered)
            }
            else if (isNaN(numberEntered.slice(-1)) === true && btnText === 0) {
                setNumberEntered(numberEntered)
            }
            else {
                setNumberEntered(numberEntered + btnText)
                setResult(eval(numberEntered + btnText))
            }
        }

    }


    function renderHeader() {
        return (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    alignItems: "center",
                    marginTop: SIZES.padding * 6,
                    paddingHorizontal: SIZES.padding * 2
                }}
                onPress={() => {
                    //  setProductName(null)
                    //navigation.navigate('ViewProduct')
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Dashboard', params: { lastroute: 'Dashboard' } }],
                    });

                }}
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
        return (
            <View
                style={{
                    marginTop: SIZES.padding * 2,
                    padding: 10,
                    height: 80,
                    minWidth: 300,
                    justifyContent: 'center'
                }}
            >
                <Text style={{ textAlign: 'center', color: COLORS.white, fontSize: 35 }}> = {number_format(result)}</Text>

            </View>
        )
    }




    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={{ flex: 1 }}
        >

            <LinearGradient
                colors={[COLORS.orange, COLORS.lightOrange]}
                style={{ flex: 1}}
            >
                <View>

                    {renderHeader()}
                    {renderLogo()}


                </View>
                <SafeAreaView style={STYLES.signupFooter}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    >

                        <View style={{ alignItems: 'center' }}>

                            <View
                                style={{
                                    height: 70,
                                    minWidth: 300,
                                    justifyContent: 'center',
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    borderColor: '#ddd',
                                    borderBottomWidth: 0,
                                    shadowColor: '#000000',
                                    shadowOffset: { width: 40, height: 30 },
                                    shadowOpacity: 1.5,
                                    shadowRadius: 3,
                                    elevation: 3,
                                    marginTop: 10,
                                    marginBottom: 10
                                }}
                            >

                                <TextInput
                                    value={numberEntered}
                                    placeholder='0'
                                    editable={false}
                                    scrollEnabled={true}
                                    theme={STYLES.textInput}
                                    style={{ backgroundColor: COLORS.white, fontSize: 25 }}

                                />

                            </View>
                            {renderNumbers()}
                        </View>

                    </ScrollView>
                </SafeAreaView>

            </LinearGradient>

        </KeyboardAvoidingView>
    )
}
const styles = StyleSheet.create({
    shadowContainerStyle: {   //<--- Style with elevation
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderBottomWidth: 0,
        shadowColor: COLORS.lightGray,
        backgroundColor: COLORS.white,
        color: COLORS.emerald,
        shadowOffset: { width: 80, height: 200 },
        shadowOpacity: 1.1,
        shadowRadius: 20,
        elevation: 6,
        height: 70,
        width: 70,
        marginBottom: 5,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    shadowBottonContainerStyle: {    //<--- Style without elevation
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ddd',
        borderBottomWidth: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 10,
    },

})
export default Calculator;