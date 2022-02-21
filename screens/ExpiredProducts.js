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

const ExpiredProducts = ({ navigation }) => {

    const [effectCounter, setEffectCounter] = React.useState(0)

    const [productData, setProductData] = useState([])
    const [productList, setProductList] = useState([])
    const [productListNextYear, setProductListNextYear] = useState([])
    const [productListExpired, setProductListExpired] = useState([])


    const [showPassword, setShowPassword] = React.useState(false)

    const [areas, setAreas] = React.useState([])
    const [selectedArea, setSelectedArea] = React.useState(null)
    const [modalVisible, setModalVisible] = React.useState(false)

    let errMessage = null;
    const [errMsg, setErrMsg] = React.useState(null);

    const [shopName, setShopName] = useState(null);
    const [currencySymbol, setCurrencySymbol] = useState(null);
    const [shopSettings, setShopSettings] = useState([])

    const [dataReceived, setDataReceived] = useState([])
    const [search, setSearch] = useState(null);
    const [searchOn, setSearchOn] = useState(false);
    const [scanned, setScanned] = useState(null);

    const [productsExpired, setProductsExpired] = useState(0)
    const [productsCount, setProductsCount] = useState(0)
    const [productsCountExpNextYr, setProductsCountExpNextYr] = useState(0)

    var today = new Date();
    var thisYear = today.getFullYear()
    var nextYear = today.getFullYear() + 1
    var thisMonth = today.getMonth() + 1

    const [isLoading, setIsLoading] = useState(false);

    const title = "Expired Products"

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

    const month_diff = (x, y) => {
        if (x === '' || x === null) x = 0;
        if (y === '' || y === null) y = 0;
        let z = x - y;
        return z;
    }

    const month_diff_next = (x, y) => {
        if (x === '' || x === null) x = 0;
        if (y === '' || y === null) y = 0;
        let z = (y + 12) - x;
        return z;
    }

    






    function renderHeader() {
        return (
            <TouchableOpacity
                style={STYLES.headerTitleView}
                onPress={() => navigation.reset({
                    index: 0,
                    routes: [{ name: 'ExpiringSoon' }],
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

    const actionsButton = async (id) => {
        setIsLoading(true)

        try {
            await AsyncStorage.setItem('pageNumber', JSON.stringify(id));
            setIsLoading(false)

            navigation.reset({
                index: 0,
                routes: [{ name: 'ViewProduct', params: { lastroute: 'ExpiredProducts' } }],
            })

        } catch (error) {
            setErrMsg("Failed. Please try again. " + error)
            setIsLoading(false)
            setModalVisible(true)
        }

    }

    const getProductList = async () => {

        setIsLoading(true)

        try {

            var pitems = await AsyncStorage.getItem('productList');
            if (pitems) {

                var x = JSON.parse(pitems) 

                setProductData(x)

                let counter = 0

                        const result = x.filter(w => w.expiryDate.year === thisYear.toString())
                        setProductList(result.sort((a, b) => b.expiryDate.month - a.expiryDate.month).slice(0, 100)) //descending order by id
                        
                for (let i = 0; i < x.length; i++) {
                    if (x[i].expiryDate.year === thisYear.toString()) counter++;
                }

                setProductsCount(counter)

                setIsLoading(false)
            }


        } catch (e) {
            console.log(e)
            setErrMsg(null)
            setIsLoading(false)
        }
        
    }


    const getProductList2 = async () => {

        setIsLoading(true)

        try {

            var pitems = await AsyncStorage.getItem('productList');
            if (pitems) {

                var x = JSON.parse(pitems)

                setProductData(x)

                let counter2 = 0

                        const result = x.filter(w => w.expiryDate.year === nextYear.toString())
                        setProductListNextYear(result.sort((a, b) => b.expiryDate.month - a.expiryDate.month).slice(0, 100)) //descending order by id


                for (let i = 0; i < x.length; i++) {
                    if (x[i].expiryDate.year === nextYear.toString()) counter2++;
                }

                setProductsCountExpNextYr(counter2)

                setIsLoading(false)
            }


        } catch (e) {
            console.log(e)
            setErrMsg(null)
            setIsLoading(false)
        }

    }


    const getExpiredProducts = async () => {

        setIsLoading(true)

        try {

            var pitems = await AsyncStorage.getItem('productList');
            if (pitems) {

                var x = JSON.parse(pitems)

                setProductData(x)

                let counter3 = 0

                        const result = x.filter(w => parseInt(w.expiryDate.year) < parseInt(thisYear))
                        setProductListExpired(result.sort((a, b) => b.expiryDate.month - a.expiryDate.month).slice(0, 100)) //descending order by id


                for (let i = 0; i < x.length; i++) {
                    //if (x[i].expiryDate.year === nextYear.toString()) 
                    counter3++;
                }

                setProductsExpired(counter3)

                setIsLoading(false)
            }


        } catch (e) {
            console.log(e)
            setErrMsg(null)
            setIsLoading(false)
        }

    }

    useEffect(() => {

        getProductList()

    }, [])

    useEffect(() => {

        getExpiredProducts()

    }, [])



    useEffect(() => {

        getProductList2()

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
                        {item.productName}</Text>
                    <Text style={{ textAlign: 'center', flexWrap: 'wrap', fontSize: 13, color: COLORS.black }}> In Stock: {item.productQuantity}, Expires: <Text style={{ fontSize: 18 }}> {!item.expiryDate ? null : item.expiryDate.month}-{!item.expiryDate ? null : item.expiryDate.year}</Text></Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>


                    <Image
                                source={icons.product}
                                style={{ width: 30, height: 30, tintColor: COLORS.red }}
                            />
                        

                        <View style={{ flex: 1, height: 1, backgroundColor: COLORS.emerald }} />
                        <View>
                            <Text style={{ width: 120, textAlign: 'center', fontSize: 18, color: COLORS.secondary }}> {number_format(item.productSelling)} {currencySymbol} </Text>
                        </View>

                        <View style={{ flex: 1, height: 1, backgroundColor: COLORS.emerald }} />

                        <Image
                                source={icons.product}
                                style={{ width: 30, height: 30, tintColor: COLORS.red }}
                            />

                         
</View>
                        


                </View>


            </TouchableOpacity>
        )

        return (
            <FlatList
                data={productListExpired}
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

                </View>

                <SafeAreaView style={STYLES.signupFooter}>



                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        scrollEnabled={false}
                        style={{ height: 100 }}
                    >
                        <View style={{ marginTop: SIZES.padding * 2 }}>
                        <Text style={{ fontSize: 15, color: COLORS.red }}>Expired Products: {number_format(productsExpired)}</Text>
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

export default ExpiredProducts;