import React, { useEffect, useState } from "react";
import {
    View,
    Text,
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
import { TextInput } from 'react-native-paper';

import { COLORS, SIZES, FONTS, icons, images } from "../constants"
import { STYLES } from "../constants/theme";

import AsyncStorage from '@react-native-async-storage/async-storage'
import dateToString from "../constants/dateToString";

const ViewExpenses = ({ navigation, route }) => {

    const [lastRoute, setLastRoute] = React.useState(route.params.lastroute)
    const [modalVisible, setModalVisible] = React.useState(false)

    const [delete_, setDelete_] = React.useState(false)
    const [update, setUpdate] = React.useState(false)

    let errMessage = null;
    const [errMsg, setErrMsg] = React.useState(null);
    const [successMsg, setSuccessMsg] = React.useState(null);

    const [shopName, setShopName] = useState(null);
    const [currencySymbol, setCurrencySymbol] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const [title_, setTitle_] = useState(null)
    const [amount, setAmount] = useState(null)
    const [note, setNote] = useState(null)

    const title = "Expenses Details"

    const [pageNumber, setPageNumber] = useState(null);

   

    const getSettings = () => {
        try {
            AsyncStorage.getItem('shopSettings', (err, result) => {
                //   console.log(result);
                let jsonresult = JSON.parse(result)
                if (jsonresult != null) {
                    setShopName(jsonresult.shopName)
                    setCurrencySymbol(jsonresult.currencySymbol)
                }
            });
        } catch (e) {
            console.log(e)
        }
    }


    const number_format = (x) => {
        if (x == '' || x == null) x = 0;
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }


    const [expensesData, setProductData] = useState([])

    const [expensesList, setExpensestList] = useState([])

    const getProductDetails = async () => {

        setIsLoading(true)

        try {

            var pitems = await AsyncStorage.getItem('expensesList');
            if (pitems) {

                var x = JSON.parse(pitems)
                setProductData(x)

            }

        } catch (e) {
            console.log(e)
            setErrMsg(null)
        }

        try {

            await AsyncStorage.getItem('pageNumber', (err, result) => {
                //  console.log(result);
                let jsonresult = result
                if (jsonresult != null) {
                    setPageNumber(jsonresult)

                    for (let x of expensesData) {
                        if (x.id == pageNumber) {

                            setExpensestList(x)

                        }
                    }

                }
            });

        } catch (e) {
            console.log(e)
            setErrMsg(null)
        }

        setIsLoading(false)

    }



    useEffect(() => {

        if (lastRoute === null || lastRoute === '') {
            setLastRoute('Expenses')
        }

        if (expensesList.length === 0) {

            getSettings()

            getProductDetails()

        }

    })


    function toEditPage() {
        setTitle_(expensesList.title)
    setAmount(expensesList.amount)
    setNote(expensesList.note)
    setUpdate(true)
    }

    function renderHeader() {
        return (
            <TouchableOpacity
                style={STYLES.headerTitleView}
                onPress={() =>
                    navigation.reset({
                        index: 0,
                        routes: [{ name: lastRoute }],
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

    const beforeDeleteAction = () => {
        setDelete_(true)
        setModalVisible(true)
    }

    const noDeleteAction = () => {
        setDelete_(false)
        setErrMsg(null)
        setModalVisible(false)
    }

    const deleteAction = async () => {
        setDelete_(false)
        setModalVisible(false)
        try {
            let data = expensesData
            var updated = data.filter(item => item.id !== parseInt(pageNumber))
            let newupdate = updated

            await AsyncStorage.setItem('expensesList', JSON.stringify(newupdate));

            setSuccessMsg("Expense Deleted!")

            //alert(successMsg)
            navigation.reset({
                index: 0,
                routes: [{ name: lastRoute }],
            })

        } catch (e) {
            setErrMsg("Failed to delete")
            setModalVisible(true)

        }

    }


    function renderProduct() {

        return (
            <View
                style={{ marginBottom: SIZES.padding * 3, alignItems: 'center', marginTop: 3 }}
            >
                <View
                    style={{
                        height: 200,
                        width: '100%',
                        marginBottom: 5,
                        borderRadius: 20,
                        justifyContent: 'center',
                        backgroundColor: COLORS.lightGray
                    }}
                >

                    <Text style={{ textAlign: 'center', flexWrap: 'wrap', fontSize: 20, color: COLORS.black, marginBottom: 10 }}>
                        {expensesList.title}</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>

                        <Image
                            source={icons.product}
                            style={{ width: 30, height: 30, tintColor: COLORS.emerald }}
                        />
                        <Text style={{ fontSize: 15 }}>Amount:</Text>
                            <Text style={{ flex: 1, textAlign: 'right', fontSize: 18, color: COLORS.secondary }}> {number_format(expensesList.amount)} {currencySymbol} </Text>

                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>

                        <Image
                            source={icons.product}
                            style={{ width: 30, height: 30, tintColor: COLORS.secondary }}
                        />
                        <Text style={{ fontSize: 15 }}>Note:</Text>
                            <Text style={{ flex: 1, textAlign: 'right', fontSize: 18, color: COLORS.secondary }}> {expensesList.note}</Text>

                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Image
                            source={icons.date}
                            style={{ width: 25, height: 25, tintColor: COLORS.orange }}
                        />
                        <Text style={{ fontSize: 15 }}> Added:</Text>
                            <Text style={{  flex: 1, textAlign: 'right', fontSize: 18, color: COLORS.secondary }}> {dateToString(expensesList.dateAdded)} </Text>
                        
                    </View>


                </View>

                {!isLoading && expensesList != '' ? renderButton() : null}

            </View>


        )


    }

    function renderButton() {
        return (

            <View style={{ marginBottom: 10, alignItems: 'center' }}>                
                <View>

                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 300,
                        }}
                        onPress={() => { toEditPage() }}
                    >
                        <LinearGradient
                            colors={[COLORS.emerald, COLORS.green]}
                            style={STYLES.defaultButton}


                        >
                            <Text style={{
                                color: '#fff',
                                fontWeight: 'bold'
                            }}>Edit</Text>
                        </LinearGradient>

                    </TouchableOpacity>
                </View>
                <View>

                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 300,
                            borderWidth: 0
                        }}
                        onPress={() => beforeDeleteAction()}
                    >
                        <LinearGradient
                            colors={[COLORS.primary, COLORS.secondary]}
                            style={STYLES.defaultButton}

                        >
                            <Text style={{
                                color: '#ffffff',
                                fontWeight: 'bold'
                            }}>Delete</Text>
                        </LinearGradient>

                    </TouchableOpacity>
                </View>



            </View>
        )
    }

    function renderUpdateForm() {
    
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
                        value={title_}
                        maxLength={50}
                        onChangeText={text => setTitle_(text)}
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

                <View style={{ marginTop: SIZES.padding * 3 }}>
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
                    onPress={() => updateAction()}
                >
                    <LinearGradient
                        colors={["transparent", "transparent"]}
                        style={STYLES.signUpPage}
                    >
                        <Text style={{
                            color: COLORS.secondary,
                            fontWeight: 'bold'
                        }}>Update Details</Text>
                    </LinearGradient>

                </TouchableOpacity>
                    )}
</View>
            </View>
        )
    }

    const updateAction = async () => {
        if (!title_) setErrMsg("Enter title or item name.");
        else if (!amount) setErrMsg("Enter amount.");
        else if (parseInt(amount) < 1) setErrMsg("Enter a valid amount");
        else{
            updateExpenses();
        }
    }

    const updateExpenses = async () => {
        setIsLoading(true)
        try {

            var pitems = await AsyncStorage.getItem('expensesList');
            if (pitems) {

                var x = JSON.parse(pitems)
                setProductData(x)

            }


        } catch (e) {
            console.log(e)
            setErrMsg(null)
        }

        //Find index of specific object using findIndex method.
        if (expensesData !== '[]' && expensesData != '') {

            setModalVisible(false)

            var objIndex = expensesData.findIndex((obj => obj.id === parseInt(expensesList.id)));

            //Update object's property.
            expensesData[objIndex].title = title_
            expensesData[objIndex].amount = amount
            expensesData[objIndex].note = note

            await AsyncStorage.setItem('expensesList', JSON.stringify(expensesData));

            navigation.reset({
                index: 0,
                routes: [{ name: 'ViewExpenses', params: { lastroute: 'Expenses' } }],
            })

            setIsLoading(false)

        }

        setIsLoading(false)
        setUpdate(false)
    }
    
    function renderAreaCodesModal() {

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <TouchableWithoutFeedback
                    onPress={errMsg == null ? () =>
                        navigation.reset({
                            index: 0,
                            routes: [{ name: lastRoute }],
                        }) :
                        () => noDeleteAction()}
                >
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View
                            style={{
                                height: 300,
                                width: 300,
                                backgroundColor: COLORS.white,
                                borderRadius: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                borderColor: COLORS.secondary,
                                borderWidth: 2
                            }}
                        >

                            <Image
                                source={errMsg == null && !delete_ ? icons.check : delete_ ? icons.error : icons.error}
                                style={{ height: 45, width: 45, tintColor: COLORS.secondary }}
                            />

                            {delete_ ?
                                <View style={{ marginBottom: 10, alignItems: 'center' }}>

                                    <Text style={{ marginLeft: 30, textAlign: "center", marginTop: 30, marginRight: 30, fontSize: 15, color: COLORS.secondary }}>
                                        Do you want to Delete {expensesList.productName}?
                                </Text>

                                    <View>

                                        <TouchableOpacity
                                            style={{
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 100,
                                            }}
                                            onPress={() => noDeleteAction()}
                                        >
                                            <LinearGradient
                                                colors={[COLORS.emerald, COLORS.emerald]}
                                                style={STYLES.defaultButton}
                                            >
                                                <Text style={{
                                                    color: COLORS.white,
                                                    fontWeight: 'bold'
                                                }}>No</Text>
                                            </LinearGradient>

                                        </TouchableOpacity>
                                    </View>
                                    <View>

                                        <TouchableOpacity
                                            style={{
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 100,
                                            }}
                                            onPress={() => deleteAction()}
                                        >
                                            <LinearGradient
                                                colors={[COLORS.primary, COLORS.primary]}
                                                style={STYLES.defaultButton}
                                                borderWidth={0}
                                            >
                                                <Text style={{
                                                    color: '#ffffff',
                                                    fontWeight: 'bold'
                                                }}>Yes</Text>
                                            </LinearGradient>

                                        </TouchableOpacity>
                                    </View>



                                </View>

                                :
                                null}

                            {errMsg == null ?
                                <Text style={{ marginLeft: 30, textAlign: "center", marginTop: 30, marginRight: 30, fontSize: 15, color: "#FFFFFF" }}>
                                    {successMsg}
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
                        style={{ marginBottom: 25, marginTop: 2 }}
                    >

                        {!update? renderProduct() : renderUpdateForm() }
                        
                        {expensesList == '' ?
                            <TouchableOpacity
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Image source={images.loader} style={{
                                    width: 40, height: 40
                                }} />
                            </TouchableOpacity>
                            : null
                        }

                    </ScrollView>

                </SafeAreaView>

            </LinearGradient>
            {renderAreaCodesModal()}
        </KeyboardAvoidingView>
    )
}

export default ViewExpenses;