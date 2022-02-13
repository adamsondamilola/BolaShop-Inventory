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

const AllSales = ({ navigation }) => {


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

    const title = "All Sales"

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


                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        marginTop: 0,
                        marginRight: 10,
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                    }}
                    onPress={() => setModalSearchVisible(true)}
                >
                    <View
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 35,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: COLORS.white
                        }}
                    >
                        <Image
                            source={icons.search}
                            style={{
                                fontSize: 18,
                                height: 30,
                                width: 30,
                                textAlign: 'center',
                                tintColor: COLORS.secondary
                            }}
                        />
                    </View>
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
                routes: [{ name: 'Invoice', params: { orderId: id, lastroute: 'AllSales' } }],
            })

        } catch (error) {
            setErrMsg("Failed. Please try again. " )
            setIsLoading(false)
            setModalVisible(true)
        }

    }

    const getProductList = async () => {

        setIsLoading(true)

        try {
            var pitems = await AsyncStorage.getItem('productCarts');
            if (pitems) {
                
                var x = JSON.parse(pitems)

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

                for (let y of x) {
                    if (parseFloat(y.total_amount) > 0) {
                        total_amount += parseFloat(y.total_amount)
                        setTotalAmount(total_amount)

                    }
                    if (parseFloat(y.total_selling_amount) > 0) {
                        total_selling_amount += parseFloat(y.total_selling_amount)
                        setTotalSellingAmount(total_selling_amount)                        

                    }

                    if (parseFloat(y.items) > 0) {
                        total_items += parseFloat(y.items)
                        setTotalItems(total_items)

                    }

                    if (parseFloat(y.profit) > 0) {
                        profit += parseFloat(y.profit)
                        setTotalProfit(profit)
                    }

                }

                //profit = total_selling_amount - total_amount
                //setTotalProfit(total_selling_amount - profit)

                setProductsCount(counter)

            }


        } catch (e) {
            console.log(e)
            setErrMsg(null)
        }

        setIsLoading(false)

    }


    const searchById = async (id) => {

        setModalSearchVisible(false)

        setIsLoading(true)

        if (parseFloat(id) < 1) {
            setErrMsg("Id can not be less than 1")
            setModalVisible(true)
    }
        else if (isNaN(id) === true) {
            setErrMsg("Id must be a number")
            setModalVisible(true)
        }
        else {
            setErrMsg(null)
            setModalVisible(false)
        try {
            var pitems = await AsyncStorage.getItem('productCarts');
            if (pitems) {

                pitems = JSON.parse(pitems)

                const result = pitems.filter(w => w.id === parseFloat(id))
                //setProductList(result)

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

                for (let y of x) {

                    if (y.id === parseFloat(id)) {
                        
                        if (parseFloat(y.total_amount) > 0) {
                            total_amount += parseFloat(y.total_amount)
                            setTotalAmount(total_amount)

                        }
                        if (parseFloat(y.total_selling_amount) > 0) {
                            total_selling_amount += parseFloat(y.total_selling_amount)
                            setTotalSellingAmount(total_selling_amount)


                        }

                        if (parseFloat(y.items) > 0) {
                            total_items += parseFloat(y.items)
                            setTotalItems(total_items)

                        }
                    }
                }

                profit = total_selling_amount - total_amount
                setTotalProfit(total_selling_amount - profit)

                setProductsCount(counter)

            }


        } catch (e) {
            console.log(e)
            setErrMsg(null)
            setErrMsg("An error occured. Please, try again")
            setModalVisible(true)
        }

        }
        setIsLoading(false)

    }


    const searchByYearMonthDay = async (year, month, day) => {

        setModalSearchVisible(false)
        setModalVisible(false)
        setIsLoading(true)
        
        if (!year) {
            setErrMsg("Enter Year.")
        setModalVisible(true)
    }
        else if (year && year.length < 4 || year && year.length > 4) {
            setErrMsg("Enter a valid year")
            setModalVisible(true)
        }
        else if (month && parseFloat(month) < 1 || month && parseFloat(month) > 12) {
            setErrMsg("Enter a valid month.")
            setModalVisible(true)
        }
        //else if (month && parseFloat(month) < 10 && month.substring(0, 1).toLowerCase() != "0") setErrMsg("Invalid month. Month lower than 10 (October) should start with 0. E.g 03 stands for March")
        else if (month && isNaN(month) === true) {
            setErrMsg("Month should be a number")
        setModalVisible(true)
    }
        else if (year && isNaN(year) === true) {
            setErrMsg("Year should be a number")
            setModalVisible(true)
        }
        else if (day && isNaN(day) === true) {
            setErrMsg("Day should be a number")
            setModalVisible(true)
        }
        else if (day && parseFloat(day) < 1 || day && parseFloat(day) > 31) {
            setErrMsg("Enter a valid day. Minimum is 1 and maximum is 31")
            setModalVisible(true)
        }

        else {
            setErrMsg(null)
            setModalVisible(false)

            if (parseFloat(month) === 1) {
                month = "Jan"
            }
            else if (parseFloat(month) === 2) {
                month = "Feb"
            }

            else if (parseFloat(month) === 3) {
                month = "Mar"
            }

            else if (parseFloat(month) === 4) {
                month = "Apr"
            }

            else if (parseFloat(month) === 5) {
                month = "May"
            }

            else if (parseFloat(month) === 6) {
                month = "Jun"
            }

            else if (parseFloat(month) === 7) {
                month = "Jul"
            }

            else if (parseFloat(month) === 8) {
                month = "Aug"
            }


            else if (parseFloat(month) === 9) {
                month = "Sep"
            }


            else if (parseFloat(month) === 10) {
                month = "Oct"
            }


            else if (parseFloat(month) === 11) {
                month = "Nov"
            }


            else if (parseFloat(month) === 12) {
                month = "Dec"
            }

                setTimeout(async () => {
               
            try {
                var pitems = await AsyncStorage.getItem('productCarts');
                if (pitems) {

                    pitems = JSON.parse(pitems)

                    let result = []

                    //Year Only
                    if (!day && !month && year.length > 0) {
                        result = pitems.filter(w => (w.dateAdded).substring(7, 11) === year)
                        if (result.length < 1) result = pitems.filter(w => (w.dateAdded).substring(6, 10) === year)
                }
                    //Month and Year
                    else if (!day && month.length > 0 && year.length > 0) {
                        result = pitems.filter(w => (w.dateAdded).substring(3, 6) === month && (w.dateAdded).substring(7, 11) === year)
                        if (result.length < 1) result = pitems.filter(w => (w.dateAdded).substring(2, 5) === month && (w.dateAdded).substring(6, 10) === year)
                    }

                    //Month, day, and year search
                    else if ((day && day.length > 0) && (month && month.length > 0) && (year && year.length > 0)) {

                        result = pitems.filter(w => (w.dateAdded).slice(0, 2) === day && (w.dateAdded).substring(3, 6) === month && (w.dateAdded).substring(7, 11) === year)
                        if (result.length < 1) result = pitems.filter(w => (w.dateAdded).slice(0, 1) === day && (w.dateAdded).substring(2, 5) === month && (w.dateAdded).substring(6, 10) === year)
                        //setProductList(result)
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


                            if (parseFloat(yy.total_amount) > 0) {
                                total_amount += parseFloat(yy.total_amount)
                                setTotalAmount(total_amount)

                            }
                            if (parseFloat(yy.total_selling_amount) > 0) {
                                total_selling_amount += parseFloat(yy.total_selling_amount)
                                setTotalSellingAmount(total_selling_amount)


                            }

                            if (parseFloat(yy.items) > 0) {
                                total_items += parseFloat(yy.items)
                                setTotalItems(total_items)

                            }
                    }

                    profit = total_selling_amount - total_amount
                    setTotalProfit(total_selling_amount - profit)

                    setProductsCount(counter)

                }


            } catch (e) {
                console.log(e)
                setErrMsg(null)
                setErrMsg("An error occured. Please, try again.")
                setModalVisible(true)
                    }
                }, 1000);

        

        }
        setIsLoading(false)

    }

    useEffect(() => {
        if (productList == '' || productList == null) {

            getProductList()

        }
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

    function searchModal() {

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalSearchVisible}
                style={{
                    backgroundColor: "#ff4000", color: "#FFFFFF"
                }}
            >
                <TouchableWithoutFeedback
                    onPress={ () => setModalSearchVisible(false)}
                >
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View
                            style={{
                                height: 400,
                                width: 300,
                                backgroundColor: COLORS.white,
                                borderRadius: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                borderColor: COLORS.orange,
                                borderWidth: 2
                            }}
                        >
                            <Text style={{ fontSize:18 }}>Search Record</Text>

                            <View style={{ marginTop: SIZES.padding * 2, flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}>

                                <TextInput
                                    placeholderTextColor={COLORS.primary}
                                    returnKeyType="search"
                                    keyboardType="number-pad"
                                    borderBottomColor={COLORS.primary}
                                    value={searchYear}
                                    onChangeText={text => setSearchYear(text)}
                                    onSubmitEditing={() => searchByYearMonthDay(searchYear, searchMonth, searchDay)}
                                    label='Year'
                                    mode='outlined'
                                    theme={STYLES.textInput}
                                    style={{ width: 100, height: 45, padding: 5 }}
                                    maxLength={4}
                                />

                                <TextInput
                                    placeholderTextColor={COLORS.primary}
                                    returnKeyType="search"
                                    keyboardType="number-pad"
                                    borderBottomColor={COLORS.primary}
                                    value={searchMonth}
                                    onChangeText={text => setSearchMonth(text)}
                                    onSubmitEditing={() => searchByYearMonthDay(searchYear, searchMonth, searchDay)}
                                    label='Month'
                                    mode='outlined'
                                    theme={STYLES.textInput}
                                    style={{ width: 90, height: 45, padding: 5 }}
                                    maxLength={2}
                                />

                                <TextInput
                                    placeholderTextColor={COLORS.primary}
                                    returnKeyType="search"
                                    keyboardType="number-pad"
                                    borderBottomColor={COLORS.primary}
                                    value={searchDay}
                                    onChangeText={text => setSearchDay(text)}
                                    onSubmitEditing={() => searchByYearMonthDay(searchYear, searchMonth, searchDay)}
                                    label='Day'
                                    mode='outlined'
                                    theme={STYLES.textInput}
                                    style={{ width: 90, height: 45, padding: 5 }}
                                    maxLength={2}
                                />

                            </View>

                            <View style={{ marginTop: SIZES.padding * 2, flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}>
                                <TextInput
                                    placeholderTextColor={COLORS.primary}
                                    returnKeyType="search"
                                    keyboardType="number-pad"
                                    borderBottomColor={COLORS.primary}
                                    value={searchId}
                                    onChangeText={text => setSearchId(text)}
                                    onSubmitEditing={() => searchById(searchId)}
                                    label='Search by ID'
                                    mode='outlined'
                                    theme={STYLES.textInput}
                                    style={{ width: 280, height: 45, padding: 5 }}
                                    maxLength={100000}
                                />
                            </View>



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
            {searchModal()}
        </KeyboardAvoidingView>
    )
}

export default AllSales;