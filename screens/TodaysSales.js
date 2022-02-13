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
import SettingsModule from "./SettingsModule";
import dateTime from "../constants/dateTime";

const TodaysSales = ({ navigation }) => {


    const [productData, setProductData] = useState([])
    const [productList, setProductList] = useState([])


    const [showPassword, setShowPassword] = React.useState(false)

    const [areas, setAreas] = React.useState([])
    const [selectedArea, setSelectedArea] = React.useState(null)
    const [modalVisible, setModalVisible] = React.useState(false)
    const [modalSearchVisible, setModalSearchVisible] = React.useState(false)

    let errMessage = null;
    const [errMsg, setErrMsg] = React.useState(null);

    const [shopName, setShopName] = useState(null);
    const [currencySymbol, setCurrencySymbol] = useState(null);
    const [shopSettings, setShopSettings] = useState([])

    const [dataReceived, setDataReceived] = useState([])
    const [search, setSearch] = useState(null);
    const [searchId, setSearchId] = useState(null);
    const [searchDay, setSearchDay] = useState(null);
    const [searchMonth, setSearchMonth] = useState(null);
    const [searchYear, setSearchYear] = useState(null);
    const [searchOn, setSearchOn] = useState(false);
    const [scanned, setScanned] = useState(null);

    const [totalAmount, setTotalAmount] = useState(0)
    const [totalSellingAmount, setTotalSellingAmount] = useState(0)
    const [totalProfit, setTotalProfit] = useState(0)
    const [totalItems, setTotalItems] = useState(0)


    const [productsCount, setProductsCount] = useState(0)



    const [isLoading, setIsLoading] = useState(false);

    const title = "Today Sales"

    const getSettings = () => {
        try {
            AsyncStorage.getItem('shopSettings', (err, result) => {
                console.log(result);
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

    useEffect(() => {

        getSettings()
    }, [])

    const number_format = (x) => {
        if (x == '' || x == null) x = 0;
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }




    function renderHeader() {
        return (
            <View>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: "center",
                        marginTop: SIZES.padding * 6,
                        paddingHorizontal: SIZES.padding * 2
                    }}
                    onPress={() => navigation.reset({
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


            </View>
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
                <Text style={{ fontSize: 15, color: COLORS.white }}><Text style={{ fontSize: 50, color: COLORS.white }}> {number_format(totalSellingAmount)}</Text> {currencySymbol} </Text>

            </View>
        )
    }

    const actionsButton = async (id) => {
        setIsLoading(true)
        setModalVisible(false)

        try {

            setIsLoading(false)

            navigation.reset({
                index: 0,
                routes: [{ name: 'Invoice', params: { orderId: id, lastroute: 'TodaysSales' } }],
            })

        } catch (error) {
            setErrMsg("Failed. Please try again. ")
            setIsLoading(false)
            setModalVisible(true)
        }

    }

    const searchByYearMonthDay = async (year, month, day) => {

        //setIsLoading(true)

        setErrMsg(null)
        setModalVisible(false)

        if (parseInt(month) === 1) {
            month = "Jan"
        }
        else if (parseInt(month) === 2) {
            month = "Feb"
        }

        else if (parseInt(month) === 3) {
            month = "Mar"
        }

        else if (parseInt(month) === 4) {
            month = "Apr"
        }

        else if (parseInt(month) === 5) {
            month = "May"
        }

        else if (parseInt(month) === 6) {
            month = "Jun"
        }

        else if (parseInt(month) === 7) {
            month = "Jul"
        }

        else if (parseInt(month) === 8) {
            month = "Aug"
        }


        else if (parseInt(month) === 9) {
            month = "Sep"
        }


        else if (parseInt(month) === 10) {
            month = "Oct"
        }


        else if (parseInt(month) === 11) {
            month = "Nov"
        }


        else if (parseInt(month) === 12) {
            month = "Dec"
        }

        setTimeout(async () => {

            try {
                var pitems = await AsyncStorage.getItem('productCarts');
                if (pitems) {

                    pitems = JSON.parse(pitems)

                    let result = []

                    result = pitems.filter(w => (w.dateAdded).slice(0, 2) === day && (w.dateAdded).substring(3, 6) === month && (w.dateAdded).substring(7, 11) === year)
                    if (result.length < 1) {
                        result = pitems.filter(w => (w.dateAdded).slice(0, 1) === day && (w.dateAdded).substring(2, 5) === month && (w.dateAdded).substring(6, 10) === year)
                    }
                    var x = result

                    setProductData(x)
                    setProductList(x.sort((a, b) => b.id - a.id).slice(0, 500)) //descending order by id

                    let counter = 0
                    for (let i = 0; i < x.length; i++) {
                        if (x[i].id != "0") counter++;
                    }

                    let total_amount = 0
                    let total_selling_amount = 0
                    let profit = 0
                    let total_items = 0

                    for (let yy of x) {


                        if (parseInt(yy.total_amount) > 0) {
                            total_amount += parseInt(yy.total_amount)
                            setTotalAmount(total_amount)

                        }
                        if (parseInt(yy.total_selling_amount) > 0) {
                            total_selling_amount += parseInt(yy.total_selling_amount)
                            setTotalSellingAmount(total_selling_amount)

                        }

                        if (parseInt(yy.items) > 0) {
                            total_items += parseInt(yy.items)
                            setTotalItems(total_items)

                        }

                        if (parseInt(yy.profit) > 0) {
                            profit += parseInt(yy.profit)
                            setTotalProfit(profit)

                        }
                    }

//                    profit = total_selling_amount - total_amount
//                    setTotalProfit(total_selling_amount - profit)

                    setProductsCount(counter)

                    setIsLoading(false)
                }


            } catch (e) {
                console.log(e)
                setErrMsg("An error occured. Please, try again")
                setModalVisible(true)
                setIsLoading(false)

            }
        }, 1000);        

    }

    useEffect(() => {

            getSettings()

            searchByYearMonthDay((dateTime.thisYear).toString(), (dateTime.thisMonth).toString(), (dateTime.todayDay).toString())
     
    }, [])



    function renderProducts() {

        const renderItem = ({ item }) => (
            <TouchableOpacity
                style={{ marginBottom: SIZES.padding * 3, alignItems: 'flex-start', marginTop: 3 }}
                onPress={() => actionsButton(item.id)}
            >
                <View
                    style={{
                        height: 70,
                        width: '100%',
                        marginBottom: 5,
                        borderRadius: 20,
                        justifyContent: 'center',
                        backgroundColor: COLORS.lightGray
                    }}
                >

                    <Text style={{ textAlign: 'center', flexWrap: 'wrap', fontSize: 18, color: COLORS.black }}>
                        ID #{item.id}</Text>
                    <Text style={{ textAlign: 'center', flexWrap: 'wrap', fontSize: 13, color: COLORS.black }}> {item.dateAdded}</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                        <Image
                            source={icons.product}
                            style={{ width: 30, height: 30, tintColor: COLORS.emerald }}
                        />
                        <View style={{ flex: 1, height: 1, backgroundColor: COLORS.emerald }} />
                        <View>
                            <Text style={{ width: 120, textAlign: 'center', fontSize: 18, color: COLORS.secondary }}> {number_format(item.total_selling_amount)} {currencySymbol} </Text>
                        </View>
                        <View style={{ flex: 1, height: 1, backgroundColor: COLORS.emerald }} />
                        <Image
                            source={icons.product}
                            style={{ width: 30, height: 30, tintColor: COLORS.emerald }}
                        />

                    </View>


                </View>


            </TouchableOpacity>
        )

        return (
            <FlatList
                data={productList}
                renderItem={renderItem}
                style={{ marginTop: SIZES.padding * 2 }}
            />
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
                    onPress={errMsg == null ? () => setModalVisible(false) : () => setModalVisible(false)}
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

                            {errMsg != null ?
                                <Text style={{ marginLeft: 30, textAlign: "center", marginTop: 30, marginRight: 30, fontSize: 15, color: "#FFFFFF" }}>
                                    {errMsg}
                                </Text>
                                : null}



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
                    {renderLogo()}

                </View>

                <SafeAreaView style={STYLES.signupFooter}>



                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        scrollEnabled={false}
                        style={{ height: 100 }}
                    >
                        <View style={{ marginTop: SIZES.padding * 1 }}>
                            <Text style={{ fontSize: 15 }}>Transactions: <Text style={{ fontSize: 20, color: COLORS.back }}> {number_format(productsCount)}</Text></Text>
                            <Text style={{ fontSize: 15 }}>Profit: <Text style={{ fontSize: 25, color: COLORS.secondary }}> {number_format(totalProfit)}</Text> {currencySymbol} </Text>

                        </View>

                    </ScrollView>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        style={{ marginBottom: 25, marginTop: 2 }}
                    >

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

                            renderProducts()

                        }



                    </ScrollView>

                </SafeAreaView>


            </LinearGradient>
            {renderAreaCodesModal()}
        </KeyboardAvoidingView>
    )
}

export default TodaysSales;