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
import { Button, TextInput } from 'react-native-paper';

import { COLORS, SIZES, FONTS, icons, images } from "../constants"
import { STYLES } from "../constants/theme";

import AsyncStorage from '@react-native-async-storage/async-storage'
import SettingsModule from "./SettingsModule";
import dateTime from "../constants/dateTime";

const CheckOut = ({ navigation, route }) => {

    const [productList, setProductList] = useState([])

    const [allCarts, setAllCarts] = useState(route.params.allCarts)

    const [productCarts, setProductCarts] = useState([])

    const [modalVisible, setModalVisible] = React.useState(false)

    const [errMsg, setErrMsg] = React.useState(null);

    const [shopName, setShopName] = useState(null);
    const [currencySymbol, setCurrencySymbol] = useState(null);



    const [search, setSearch] = useState(null);

    const [productsCount, setProductsCount] = useState(route.params.items)

    const [isLoading, setIsLoading] = useState(false);

    const [id, setId] = useState(1)

    var timeNow = dateTime.currentTime

    var timeNow = dateTime.currentTime
    var dateNow = dateTime.dateNow + ' ' + timeNow

    const [totalAmount, setTotalAmount] = useState(0)
    const [totalSellingAmount, setTotalSellingAmount] = useState(0)
    const [totalProfit, setTotalProfit] = useState(0)
    const [totalItems, setTotalItems] = useState(0)


    let newProductList = {
        "id": id,
        "total_amount": totalAmount,
        "total_selling_amount": totalSellingAmount,
        "profit": totalProfit,
        "items": totalItems,
        "products": productsCount,
        "data": { allCarts },
        "dateAdded": dateNow
    };


    const title = "Check Out"

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
        getProductCarts()
    }, [])

    const number_format = (x) => {
        if (x == '' || x == null) x = 0;
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
                    //                    AsyncStorage.removeItem('newSale')
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'AddSale', params: { 'scannedcode': '' } }],
                    })
                }
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

    const getProductList = async () => {
        //        await AsyncStorage.removeItem('newSale')
        setIsLoading(true)

        try {

            var pitems = JSON.stringify(allCarts);

            if (pitems) {

                let total_amount = 0
                let total_selling_amount = 0
                let profit = 0
                let total_items = 0

                var productData = JSON.parse(pitems)
                for (let x of productData) {
                    if (parseInt(x.productAmount) > 0) {
                        total_amount += parseInt(x.productAmount)
                        setTotalAmount(total_amount)

                    }
                    if (parseInt(x.productTotalAmount) > 0) {
                        total_selling_amount += parseInt(x.productTotalAmount)
                        setTotalSellingAmount(total_selling_amount)

                    }

                    if (parseInt(x.productQuantity) > 0) {
                        total_items += parseInt(x.productQuantity)
                        setTotalItems(total_items)

                    }

                    if (parseInt(x.productTotalProfit) > 0) {
                        profit += parseInt(x.productTotalProfit)
                        setTotalProfit(profit)

                    }

                }

               // profit = total_selling_amount - total_amount
               // setTotalProfit(profit - total_selling_amount)
           
                setProductsCount(counter)

            }

        } catch (e) {
            console.log(e)
            setErrMsg(null)
        }

        setIsLoading(false)

    }

    useEffect(() => {
        if (productList == '' || productList == null) {

            getSettings()

        }
    }, [])

    const getSearchedProduct = async () => {

        getProductCarts()

        setIsLoading(true)

            setErrMsg(null)
            setModalVisible(false)


                    try {
                        setIsLoading(true)
                        var pitems = await AsyncStorage.getItem('productCarts');
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
                                //alert(productList)
                                let productList_ = {
                                    "id": newId,
                                    "total_amount": totalAmount,
                                    "total_selling_amount": totalSellingAmount,
                                    "profit": totalProfit,
                                    "items": totalItems,
                                    "products": productsCount,
                                    "data": { allCarts },
                                    "dateAdded": dateNow
                                };

                                var str = pitems
                                str = str.substring(1) //str.replace("[", "") //eplace [
                                str = str.slice(0, -1) //str.replace("]", "") //eplace ]
                                var newPitems = "[" + str + "," + JSON.stringify(productList_) + "]"
                                await AsyncStorage.setItem('productCarts', newPitems);

                                //Remove from stock
                                try {
                                    setIsLoading(true)

                                    var products = await AsyncStorage.getItem('productList');

                                    if (products) {
                                    var savedItems = await AsyncStorage.getItem('productCarts');
                                    if (savedItems) {

                                        savedItems = JSON.parse(savedItems)
                                        products = JSON.parse(products)

                                        const result = savedItems.filter(w => w.id === parseInt(newId))

                                        const resultData = result[0].data.allCarts

                                        //alert(JSON.stringify(resultData))
                                        //alert(JSON.stringify(result[0].data.allCarts[0].productQuantity))

                                        for (let x of resultData) {


                                            const result2 = products.filter(v => v.id === parseInt(x.productId))

                                            var objIndex = products.findIndex((obj => obj.id === parseInt(x.productId)));

                                            let qty = JSON.stringify(result2[0].productQuantity)
                                            qty = qty.replace('"', '')

                                            let solution = parseInt(parseInt(qty)) - parseInt(JSON.stringify(x.productQuantity));


                                            if (solution < 1) {
                                                    solution = 0;
                                                }

                                            products[objIndex].productQuantity = solution.toString()

                                                    await AsyncStorage.setItem('productList', JSON.stringify(products));


                                        }


                                        }
                                    }
                                    setIsLoading(false)

                                } catch (e) {
                                    alert(e)
                                    console.log(e)
                                    setIsLoading(false)
                                }

                                AsyncStorage.removeItem('newSale'); //clear cart

                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Invoice', params: { orderId: newId, lastroute: 'Dashboard' } }],
                                })

                            } 
                            setIsLoading(false)

                        } else {
                            await AsyncStorage.setItem('productCarts', JSON.stringify([newProductList]));

                            //Remove from stock
                            try {
                                setIsLoading(true)

                                var products = await AsyncStorage.getItem('productList');

                                if (products) {
                                    var savedItems = await AsyncStorage.getItem('productCarts');
                                    if (savedItems) {

                                        savedItems = JSON.parse(savedItems)
                                        products = JSON.parse(products)

                                        const result = savedItems.filter(w => w.id === 1)

                                        const resultData = result[0].data.allCarts


                                        for (let x of resultData) {

                                            const result2 = products.filter(v => v.id === parseInt(x.productId))

                                            var objIndex = products.findIndex((obj => obj.id === parseInt(x.productId)));

                                            let qty = JSON.stringify(result2[0].productQuantity)
                                            qty = qty.replace('"', '')

                                            let solution = parseInt(qty) - parseInt(JSON.stringify(x.productQuantity));

                                                if (solution < 1) {
                                                    solution = 0;
                                                }
                                                //Update object's property.
                                                products[objIndex].productQuantity = solution.toString()

                                                await AsyncStorage.setItem('productList', JSON.stringify(products));

                                        }


                                    }
                                }
                                setIsLoading(false)

                            } catch (e) {
                                alert(e)
                                console.log(e)
                                setIsLoading(false)
                            }

                            AsyncStorage.removeItem('newSale'); //clear cart

                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Invoice', params: { orderId: 1, lastroute: 'Dashboard' } }],
                            })


                            setIsLoading(false)
                        }
                    } catch (e) {
                        console.log(e)
                        setErrMsg(null)
                        setIsLoading(false)
                    }

            //                }, 1000);
            //            }
            //        }


        getProductCarts()

        setIsLoading(false)
    }




    const getProductCarts = async () => {

        getProductList()

        try {

            var pitems = await AsyncStorage.getItem('productCarts');

            if (pitems) {

                var Data = JSON.parse(pitems)

                setProductCarts(Data)

            }

        } catch (e) {
            console.log(e)
        }
    }

    const deleteAction = async (id) => {
        setModalVisible(false)
        setErrMsg(null)
        try {
            let data = allCarts
            var updated = data.filter(item => item.id !== parseInt(id))
            let newupdate = updated

            await AsyncStorage.setItem('newSale', JSON.stringify(newupdate));

            console.log("Product deleted from cart!")

            getProductCarts()

        } catch (e) {
            setErrMsg("Failed to delete")
            setModalVisible(true)
        }

    }

    const deleteAll = async () => {
        setModalVisible(false)
        setErrMsg(null)
        setIsLoading(true)
        try { 

            var del = await AsyncStorage.removeItem('newSale');

            setAllCarts([])
            setProductsCount(0)
            getProductCarts()
            console.log("Product deleted from cart!")

            navigation.reset({
                index: 0,
                routes: [{ name: 'AddSale', params: { 'scannedcode': '' } }],
            })

            setIsLoading(false)
        } catch (e) {
            setErrMsg("Failed to delete")
            setModalVisible(true)
            setIsLoading(false)
        }

    }

    function renderProducts() {

        const renderItem = ({ item }) => (
            <View
                style={{ marginBottom: SIZES.padding * 3, alignItems: 'flex-start', marginTop: 3 }}
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
                        {item.productName}</Text>
                                        <Text style={{ textAlign: 'center', flexWrap: 'wrap', fontSize: 13, color: COLORS.black }}> Units: {item.productQuantity}</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                        <Image
                            source={icons.product}
                            style={{ width: 30, height: 30, tintColor: COLORS.emerald }}
                        />
                        <View style={{ flex: 1, height: 1, backgroundColor: COLORS.emerald }} />
                        <View>
                            <Text style={{ width: 120, textAlign: 'center', fontSize: 18, color: COLORS.secondary }}> {number_format(item.productTotalAmount)} {currencySymbol} </Text>
                        </View>
                        <View style={{ flex: 1, height: 1, backgroundColor: COLORS.emerald }} />
                        <View>
                            <Image
                                source={icons.product}
                                style={{ width: 30, height: 30, tintColor: COLORS.emerald }}
                            />
                        </View>
                    </View>

                </View>


            </View>
        )

        return (
            <FlatList
                data={allCarts}
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
                            style={{ height: 150 }}
                        >
                        <View style={{ marginTop: SIZES.padding * 2 }}>
                            <Text style={{ fontSize: 15 }}>Products: {number_format(productsCount)}, <Text style={{ fontSize: 15, color: COLORS.tealGreen }}>  Units: {number_format(totalItems)}</Text></Text>
                            <Text style={{ fontSize: 15 }}>Total: <Text style={{ fontSize: 45, color: COLORS.secondary }}> {number_format(totalSellingAmount)}</Text> {currencySymbol} </Text>                    
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

                    <View style={{ flex: 1 }}>
                        <TouchableOpacity
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'absolute', bottom: 0, alignSelf: 'flex-start', width: 70
                            }}
                            onPress={() => { deleteAll() }}
                        >
                            <LinearGradient
                                colors={[COLORS.red, COLORS.primary]}
                                style={STYLES.defaultButton}


                            >
                                <Text style={{
                                    color: '#fff',
                                    fontWeight: 'bold'
                                }}>Cancel </Text>
                            </LinearGradient>

                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'absolute', bottom: 0, alignSelf: 'flex-end', width: 80
                            }}
                            onPress={() => getSearchedProduct() }
                        >
                            <LinearGradient
                                colors={[COLORS.emerald, COLORS.emerald]}
                                style={STYLES.defaultButton}
                            >
                                <Text style={{
                                    color: '#fff',
                                    fontWeight: 'bold'
                                }}>Proceed
                                    </Text>


                            </LinearGradient>

                        </TouchableOpacity>
                    </View>

                </SafeAreaView>


            </LinearGradient>
            {renderAreaCodesModal()}
        </KeyboardAvoidingView>
    )
}

export default CheckOut;