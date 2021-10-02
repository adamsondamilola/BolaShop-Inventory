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

const OutOfStock = ({ navigation }) => {


    const [productData, setProductData] = useState([])
    const [productList, setProductList] = useState([])
    const [productListNextYear, setProductListNextYear] = useState([])

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

    const [productsCount, setProductsCount] = useState(0)

    var today = new Date();
    var thisYear = today.getFullYear()
    var nextYear = today.getFullYear() + 1
    var thisMonth = today.getMonth() + 1

    const [isLoading, setIsLoading] = useState(false);

    const title = "Out of Stock"

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
                routes: [{ name: 'ViewProduct', params: { lastroute: 'OutOfStock' } }],
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

//                for (let y of productData) {
//                    if (parseInt(y.productQuantity) < 20) {
                        const result = x.filter(w => parseInt(w.productQuantity) < 20)
                        setProductList(result.sort((a, b) => a.productQuantity - b.productQuantity).slice(0, 100)) //Ascending order by quantity/i stock

//                    }

//                }

                for (let i = 0; i < productData.length; i++) {
                    if (productData[i].productQuantity === "0") counter++;
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

    useEffect(() => {
       
        if (AsyncStorage.getItem('productList') && productList.length === 0) {
//            if (productList.length === 0) {

            getProductList()

                }

    })






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
                    <Text style={{ textAlign: 'center', flexWrap: 'wrap', fontSize: 13, color: COLORS.black }}> In Stock: <Text style={{ fontSize: 18 }}> {item.productQuantity}</Text></Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>


                        {parseInt(item.productQuantity) === 0 ? (

                            <Image
                                source={icons.product}
                                style={{ width: 30, height: 30, tintColor: COLORS.red }}
                            />

                        ) :

                            parseInt(item.productQuantity) === 1 ? (

                                <Image
                                    source={icons.product}
                                    style={{ width: 30, height: 30, tintColor: COLORS.red }}
                                />

                            ) :

                                parseInt(item.productQuantity) === 2 ? (

                                    <Image
                                        source={icons.product}
                                        style={{ width: 30, height: 30, tintColor: COLORS.primary }}
                                    />

                                ) :

                                    parseInt(item.productQuantity) === 3 ? (

                                        <Image
                                            source={icons.product}
                                            style={{ width: 30, height: 30, tintColor: COLORS.secondary }}
                                        />

                                    ) :

                                        parseInt(item.productQuantity) > 3 && parseInt(item.productQuantity) < 11 ? (

                                            <Image
                                                source={icons.product}
                                                style={{ width: 30, height: 30, tintColor: COLORS.orange }}
                                            />

                                        ) :

                                            <Image
                                                source={icons.product}
                                                style={{ width: 30, height: 30, tintColor: COLORS.emerald }}
                                            />
                        }


                        <View style={{ flex: 1, height: 1, backgroundColor: COLORS.emerald }} />
                        <View>
                            <Text style={{ width: 120, textAlign: 'center', fontSize: 18, color: COLORS.secondary }}> {number_format(item.productSelling)} {currencySymbol} </Text>
                        </View>

                        <View style={{ flex: 1, height: 1, backgroundColor: COLORS.emerald }} />

                        {parseInt(item.productQuantity) === 0 ? (

                            <Image
                                source={icons.product}
                                style={{ width: 30, height: 30, tintColor: COLORS.red }}
                            />

                        ) :

                            parseInt(item.productQuantity) === 1 ? (

                                <Image
                                    source={icons.product}
                                    style={{ width: 30, height: 30, tintColor: COLORS.red }}
                                />

                            ) :

                                parseInt(item.productQuantity) === 2 ? (

                                    <Image
                                        source={icons.product}
                                        style={{ width: 30, height: 30, tintColor: COLORS.primary }}
                                    />

                                ) :

                                    parseInt(item.productQuantity) === 3 ? (

                                        <Image
                                            source={icons.product}
                                            style={{ width: 30, height: 30, tintColor: COLORS.secondary }}
                                        />

                                    ) :

                                        parseInt(item.productQuantity) > 3 && parseInt(item.productQuantity) < 11 ? (

                                            <Image
                                                source={icons.product}
                                                style={{ width: 30, height: 30, tintColor: COLORS.orange }}
                                            />

                                        ) :

                                            <Image
                                                source={icons.product}
                                                style={{ width: 30, height: 30, tintColor: COLORS.emerald }}
                                            />
                        }

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
                        <View style={{ marginTop: SIZES.padding * 2 }}>
                            <Text style={{ fontSize: 15, color: COLORS.secondary }}>Out of Stock: {number_format(productsCount)}</Text>

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

export default OutOfStock;