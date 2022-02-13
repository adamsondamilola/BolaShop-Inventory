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

const AddSale = ({ navigation, route }) => {

    const [productData, setProductData] = useState([])
    const [productList, setProductList] = useState([])
    const [allCarts, setAllCarts] = useState([])

    const [showPassword, setShowPassword] = React.useState(false)

    const [areas, setAreas] = React.useState([])
    const [selectedArea, setSelectedArea] = React.useState(null)
    const [modalVisible, setModalVisible] = React.useState(false)

    let errMessage = null;
    const [errMsg, setErrMsg] = React.useState(null);

    const [shopName, setShopName] = useState(null);
    const [currencySymbol, setCurrencySymbol] = useState(null);
    const [shopSettings, setShopSettings] = useState([])

    const [unitAdded, setUnitAdded] = useState(false)

    const [search, setSearch] = useState(null);
    const [searchOn, setSearchOn] = useState(false);

    const [scanned, setScanned] = useState(route.params.scannedcode);
    const [productName, setProductName] = useState(null)
    const [productQuantity, setProductQuantity] = useState(null)
    const [productAmount, setProductAmount] = useState("0")
    const [productSelling, setProductSelling] = useState("0")
    const [productId, setProductId] = useState(null)

    const [productsCount, setProductsCount] = useState(0)

    const [isLoading, setIsLoading] = useState(false);

    const [id, setId] = useState(1)

    var dateNow = dateTime.dateNow
    var timeNow = dateTime.currentTime

    const [checkCode_, setCheckCode_] = useState(false)


    let newProductList = {
        "id": id,
        "productId": productId,
        "productCode": scanned,
        "productName": productName,
        "productQuantity": parseInt(search),
        "productAmount": parseInt(productAmount),
        "productTotalAmount": parseInt(productSelling) * parseInt(search),
        "productTotalProfit": (parseInt(productSelling) - parseInt(productAmount)) * parseInt(search),
        "productSelling": parseInt(productSelling),
        "dateAdded": dateNow + ' ' + timeNow
    };


    const title = "Cart"

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

    const getAllProducts = async () => {
            
        try {
            
                var pitems = await AsyncStorage.getItem('productList');

                if (pitems) {

                    var Data = JSON.parse(pitems)

                    for (let x of Data) {
                        if (x.productCode === scanned) {
                            const result = Data.filter(y => y.productCode === scanned)
                            setProductList(result)
                            if (productList !== '') {
                                setProductId(productList[0].id)
                                setProductSelling(productList[0].productSelling)
                                setProductName(productList[0].productName)
                                setProductAmount(productList[0].productAmount)
                            }

                            setIsLoading(false)
                        }

                    }


                }


            } catch (e) {
                console.log(e)

                setIsLoading(false)
                setCheckCode_(false)

            }

    }


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
                    routes: [{ name: 'Dashboard' }],
                })}
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
                {/*<Image*/}
                {/*    source={images.logo}*/}
                {/*    style={STYLES.logo}*/}
                {/*/>*/}
                {productsCount > 0 ?

                     <TouchableOpacity
                            style={{
                                alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute', width: 200, marginBottom: 10, padding: 10
                            }}
                            onPress={() => { parseInt(productsCount) > 0 ? checkOut() : alert("Nothing in cart") }}
                        >
                        <LinearGradient
                            colors={[COLORS.white, COLORS.white]}
                                style={STYLES.defaultButton}
                            >
                            <Text style={{
                                color: COLORS.secondary,
                                fontWeight: 'bold',
                                    
                            }}>Check Out ({productsCount})
                                    </Text>

                                
                            </LinearGradient>

                        </TouchableOpacity>

                    :
                    null
                }
            </View>
        )
    }


    const getCartList = async () => {
        //        await AsyncStorage.removeItem('newSale')
        setIsLoading(true)

        try {

            var pitems = await AsyncStorage.getItem('newSale');
            if (pitems) {

                var x = JSON.parse(pitems)

                let counter = 0
                for (let i = 0; i < x.length; i++) {
                    if (x[i].id != "0") counter++;
                }
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


    useEffect(() => {
        getSettings()
        getAllCarts()
    }, [])



    useEffect(() => {

        if (unitAdded === false && productName === null) {

            getAllProducts()
        }
    })

    const getSearchedProduct = async (code, unit) => {


        setSearch(unit)

        setIsLoading(true)

        if (isNaN(unit) === true) {
            setErrMsg("Unit should be a number")
            setModalVisible(true)
            setIsLoading(false)
    }
        else if (parseInt(unit) < 1) {
            setErrMsg("Unit can not be less than 1")
            setModalVisible(true)
            setIsLoading(false)
        }
        else if (!unit) {
            setErrMsg("Unit can not be empty")
            setModalVisible(true)
            setIsLoading(false)
        }
        else {


            setErrMsg(null)
            setModalVisible(false)



            let status_added = 0
            let status_list = 0

            //check if already added

            try {

                var pitems = await AsyncStorage.getItem('newSale');

                if (pitems) {

                    var Data = JSON.parse(pitems)
                //    alert(JSON.stringify(Data))
                    for (let x of Data) {
                        if (x.productCode === scanned) {

                            status_added = 1 //already added 
                            setErrMsg("Item already added to cart. Remove to add again.")
                            setModalVisible(true)

                        }


                    }

                }

                setIsLoading(false)

            } catch (e) {

                console.log(e)
                setIsLoading(false)
            }


            //check if in record list
            try {
                
                var pitems = await AsyncStorage.getItem('productList');

                if (pitems) {

                    var Data = JSON.parse(pitems)

                  //  setProductData(Data)
//                    var Data = pitems

                    for (let x of Data) {
                        if (x.productCode === scanned) {
                            const result = Data.filter(y => y.productCode === scanned)
                
//                            setProductUnits(search)
                            
//                            status_list = 1 //in product list
                            if (result) status_list = 1

                            else {
                                setErrMsg("Product not found. Add product to list before adding to cart")
                                setModalVisible(true)
                            }

                            setIsLoading(false)
                        }
                        

                    }

                }


            } catch (e) {
                console.log(e)
                setIsLoading(false)
                setCheckCode_(false)

            }

            if (status_list === 1 && status_added === 0) {

                if (productList.length > 0) {

                    try {
                        //  await AsyncStorage.removeItem('productList')
                        setIsLoading(true)
                        var pitems = await AsyncStorage.getItem('newSale');
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
                                    "productId": productId,
                                    "productCode": scanned,
                                    "productName": productName,
                                    "productQuantity": parseInt(search),
                                    "productAmount": parseInt(productAmount),
                                    "productTotalAmount": parseInt(productSelling) * parseInt(search),
                                    "productTotalProfit": (parseInt(productSelling) - parseInt(productAmount)) * parseInt(search),
                                    "productSelling": parseInt(productSelling),
                                    "dateAdded": dateNow + ' ' + timeNow
                                };

                                x.push(productList_) //Add new list to old list in local storage

                                await AsyncStorage.setItem("newSale", JSON.stringify(x)) //JSON.stringify converts JS object to JSON

                            }
                            setUnitAdded(true)
                            setIsLoading(false)

                        } else {
                            await AsyncStorage.setItem('newSale', JSON.stringify([newProductList]));
                            setUnitAdded(true)
                            setIsLoading(false)
                        }
                    } catch (e) {
                        console.log(e)
                        setErrMsg(null)
                        setIsLoading(false)
                    }

                }
                if (productList.length === 0) {
                    setErrMsg("Error fecting data. Please try again.")
                    setModalVisible(true)
                }
            }
            else if (status_list === 0) {
                setErrMsg("Product not found. Add product to list before adding to cart")
                setModalVisible(true)
            }
//                }, 1000);
//            }
//        }

        }
        getAllCarts()
        setIsLoading(false)
    }


   
  

    const getAllCarts = async () => {
    //    setSearch("1")
        getCartList()

        try {

            var pitems = await AsyncStorage.getItem('newSale');

            if (pitems) {

                var Data = JSON.parse(pitems)

                //setAllCarts(Data)
                setAllCarts(Data.sort((a, b) => b.id - a.id))

                if (pitems === '[]') {
                    await AsyncStorage.removeItem('newSale')
                }

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

            getAllCarts()

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
                getAllCarts()
                console.log("Product deleted from cart!")

            setIsLoading(false)
        } catch (e) {
            setErrMsg("Failed to delete")
            setModalVisible(true)
            setIsLoading(false)
        }
    }

    const checkOut = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'CheckOut', params: { 'allCarts': allCarts, 'items': productsCount } }],
        })
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
                    <Text style={{ textAlign: 'center', flexWrap: 'wrap', fontSize: 13, color: COLORS.black }}> Units: {item.productQuantity} </Text>

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
                        <TouchableOpacity
                            onPress={() => deleteAction(item.id)}
                        >
                        <Image
                            source={icons.close}
                            style={{ width: 25, height: 25, tintColor: COLORS.primary }}
                            />
                        </TouchableOpacity>
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
                    backgroundColor: COLORS.white, color: COLORS.secondary
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
                                backgroundColor: COLORS.white,
                                color: COLORS.secondary,
                                borderRadius: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                borderColor: COLORS.secondary,
                                borderWidth: 2
                            }}
                        >

                            <Image
                                source={errMsg == null ? icons.check : icons.error}
                                style={{ height: 45, width: 45, tintColor: COLORS.secondary }}
                            />

                            {errMsg != null ?
                                <Text style={{ marginLeft: 30, textAlign: "center", marginTop: 30, marginRight: 30, fontSize: 15, color: COLORS.secondary }}>
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

                    {!unitAdded ?
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        scrollEnabled={false}
                        style={{ height: 150 }}
                        >
                            <View style={{ marginTop: SIZES.padding * 2 }}>
                                <Text style={{ fontSize: 20, textAlign: 'center' }}>{productName}</Text>

                            <TextInput
                                placeholderTextColor={COLORS.primary}
                                    returnKeyType="send"
                                    keyboardType="number-pad"
                                borderBottomColor={COLORS.primary}
                                value={search}
                                    onChangeText={text => setSearch(text)}
                                    onSubmitEditing={() => getSearchedProduct(scanned, search)}
                                label='Enter unit(s)'
                                mode='outlined'
                                theme={STYLES.textInput}
                            />

                                <TouchableOpacity
                                    style={{
                                        position: 'absolute',
                                        right: 5,
                                        bottom: 8,
                                        height: 40,
                                        width: 40,
                                        zIndex: 1
                                    }}
                                    onPress={() => getSearchedProduct(scanned, search) }
                                >
                                    <Image
                                        source={icons.send}
                                        style={{
                                            height: 40,
                                            width: 40,
                                            tintColor: COLORS.secondary
                                        }}
                                    />
                                </TouchableOpacity>
                           
                        </View>

                        </ScrollView> :

                       null }

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

                    {productsCount > 0 ?
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
                                    }}>Clear All </Text>
                                </LinearGradient>

                            </TouchableOpacity>


                        </View>
                        : null }
                </SafeAreaView>


            </LinearGradient>
            {renderAreaCodesModal()}
        </KeyboardAvoidingView>
    )
}

export default AddSale;