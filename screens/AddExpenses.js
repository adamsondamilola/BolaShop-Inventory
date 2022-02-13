import React, { useEffect, useState } from "react";
import {
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    Modal,
    FlatList,
    KeyboardAvoidingView,
    ScrollView,
    SafeAreaView,
    Platform
} from "react-native"
import { LinearGradient } from 'expo-linear-gradient'
import { TextInput, Text } from 'react-native-paper';

import { COLORS, SIZES, FONTS, icons, images } from "../constants"
import { STYLES } from "../constants/theme";

import AsyncStorage from '@react-native-async-storage/async-storage'
import dateTime from "../constants/dateTime";

const AddExpenses = ({ navigation, route }) => {

    const [modalVisible, setModalVisible] = React.useState(false);
    const [errMsg, setErrMsg] = React.useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [shopName, setShopName] = useState(null);
    const [currencySymbol, setCurrencySymbol] = useState(null);
    const [shopSettings, setShopSettings] = useState([]);

    const [visible, setVisible] = React.useState(false);

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);

    const [title, setTitle] = useState(null)
    const [amount, setAmount] = useState(null)
    const [note, setNote] = useState(null)
    const [id, setId] = useState(1)

    var dateNow = dateTime.todayDate;

    const [ifExists, setIfExists] = useState(false)

    let expensesList = [{
        "id": id,
        "title": title,
        "amount": amount,
        "note": note,
        "dateAdded": dateNow
    }];

    
    const resetFields = () => {
        setTitle(null)
        setAmount(null)
        setNote(null)
    }

    
    
    const getSettings = () => {
        try {
            AsyncStorage.getItem('shopSettings', (err, result) => {
                console.log(result);
                let jsonresult = JSON.parse(result)
                setShopName(jsonresult.shopName)
            });
        } catch (e) {
            console.log(e)
            navigation.navigate('Settings')
        }
    }


    useEffect(() => {

          //  checkIfCodeExists()

    }, [])

    useEffect(() => {
        getSettings();

    }, [])

    const saved = () => {
        resetFields();
        setIsLoading(false);
        navigation.reset({
            index: 0,
            routes: [{ name: 'Expenses' }],
        });
    }



    const addAction = async () => {
        let counter_ = 0;
        try {
            setIsLoading(true)
            var prods = await AsyncStorage.getItem('expensesList');
            if (prods) {
                var y = JSON.parse(prods)
            
            for (let i = 0; i < y.length; i++) {
                if ((y[i].productName).trim().toLowerCase() === productName.trim().toLowerCase()) counter_++;
                }
                
                
            }
            setIsLoading(false)
        } catch (e) {
            setIsLoading(false)
        }
        
//        setIsLoading(false)

        if (!title) setErrMsg("Enter title or item name.");
        else if (!amount) setErrMsg("Enter amount.");
        else if (parseInt(amount) < 1) setErrMsg("Enter a valid amount");

        else {
            setErrMsg(null)

            try {

                setIsLoading(true)
                var pitems = await AsyncStorage.getItem('expensesList');
                if (pitems) {

                    var x = JSON.parse(pitems)
                    let counter = 0;
                    for (let i = 0; i < x.length; i++) {
                        if (x[i].id != '0') counter++;
                    }

                    let row = counter - 1
                    let lastId = x[row].id
                    let newId = lastId + 1
                    

                    if (newId > lastId) {

                        let expensesList_ = {
                            "id": newId,
                            "title": title,
                            "amount": amount,
                            "note": note,
                            "dateAdded": dateNow
                        };

                        x.push(expensesList_) //Add new list to old list in local storage

                        await AsyncStorage.setItem("expensesList", JSON.stringify(x)) //JSON.stringify converts JS object to JSON

                        saved()

                    }

                    setIsLoading(false)
                    
                } else {
                    await AsyncStorage.setItem('expensesList', JSON.stringify(expensesList));
                    saved()
                }
             
                const items_ = await AsyncStorage.getItem('expensesList');
                if (items_ !== null)
                    console.log(JSON.parse(items_));

                
            } catch (e) {
                console.log(e)
                await AsyncStorage.setItem('expensesList', JSON.stringify(expensesList));
                    saved()
                setErrMsg(null)                
                setIsLoading(false)
            }
            

        }

        setModalVisible(true)
    }



    function renderHeader() {
        return (
            <TouchableOpacity
                style={STYLES.headerTitleView}
                onPress={() =>  navigation.navigate('Expenses')}
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

                <Text style={{ marginLeft: SIZES.padding * 1.5, color: COLORS.white, ...FONTS.h4 }}>Add Expenses</Text>
            </TouchableOpacity>
        )
    }

    function renderLogo() {
        return (
            <View
                style={{
                    marginTop: SIZES.padding * 2,
                    height: 100,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Image
                    source={images.logo}
                    style={STYLES.logo}
                    
                />

            </View>
        )
    }



    function renderBody() {
        return (
            <View
                style={{
                    marginTop: SIZES.padding * 3,
                    marginHorizontal: SIZES.padding * 3,
                }}
            >
                <View style={{ marginTop: SIZES.padding * 3 }}>
                    <TextInput
                        returnKeyType="next"
                        value={title}
                        maxLength={50}
                        onChangeText={text => setTitle(text)}
                        label='Expenses Title or Name'
                        mode='outlined'
                        theme={STYLES.textInput}
                    />
                </View>

                <View style={{ marginTop: SIZES.padding * 3 }}>
                    <TextInput
                        returnKeyType="next"
                        keyboardType="number-pad"
                        value={amount}
                        onChangeText={text => setAmount(text)}
                        label='Amount'
                        mode='outlined'
                        theme={STYLES.textInput}
                    />
                </View>

                <View style={{ marginTop: SIZES.padding * 3 }}>
                    <TextInput
                        returnKeyType="next"
                        keyboardType="default"
                        value={note}
                        onChangeText={text => setNote(text)}
                        label='Note (Optional)'
                        mode='outlined'
                        theme={STYLES.textInput}
                    />
                </View>

            </View>
        )
    }

    function renderButton() {
        return (
            <View style={{
                margin: SIZES.padding * 4 }}>

                {isLoading ?
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center'
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
                    onPress={() => addAction()}
                >
                    <LinearGradient
                        colors={["transparent", "transparent"]}
                        style={STYLES.signUpPage}
                    >
                        <Text style={{
                            color: COLORS.secondary,
                            fontWeight: 'bold'
                        }}>Add Expenses</Text>
                    </LinearGradient>

                </TouchableOpacity>
                    )}
            </View>
        )
    }

    function renderAreaCodesModal() {

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                style={{
                    backgroundColor: "#ff4000", color: "#FFFFFF"
                }}
            >
                <TouchableWithoutFeedback
                    onPress={errMsg == null ? () => saved() : () => setModalVisible(false)}
                >
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View
                            style={{
                                height: 300,
                                width: 300,
                                backgroundColor: COLORS.secondary,
                                borderRadius: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                borderColor: "#ff8000",
                                borderWidth: 2
                            }}
                        >

                            <Image
                                source={errMsg == null ? icons.check : icons.error}
                                style={{ height: 45, width: 45, tintColor: "#FFFFFF" }}
                            />

                            {errMsg == null ?
                                <Text style={{ marginLeft: 30, textAlign: "center", marginTop: 30, marginRight: 30, fontSize: 15, color: "#FFFFFF" }}>
                                    Product saved! {}
                                </Text>

                                :
                                <Text style={{ marginLeft: 30, textAlign: "center", marginTop: 30, marginRight: 30, fontSize: 15, color: "#FFFFFF" }}>
                                    {errMsg}
                                </Text>}



                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
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
                    >
                        {renderBody()}
                        {renderButton()}
                    </ScrollView>
                </SafeAreaView>

            </LinearGradient>
            {renderAreaCodesModal()}
        </KeyboardAvoidingView>
    )
}

export default AddExpenses;