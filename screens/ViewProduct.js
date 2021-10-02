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

const ViewProduct = ({ navigation, route }) => {

    const [lastRoute, setLastRoute] = React.useState(route.params.lastroute)
    const [modalVisible, setModalVisible] = React.useState(false)

    const [delete_, setDelete_] = React.useState(false)

    let errMessage = null;
    const [errMsg, setErrMsg] = React.useState(null);
    const [successMsg, setSuccessMsg] = React.useState(null);

    const [shopName, setShopName] = useState(null);
    const [currencySymbol, setCurrencySymbol] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const title = "Product Details"

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


    const [productData, setProductData] = useState([])

    const [productList, setProductList] = useState([])

    const getProductDetails = async () => {

        setIsLoading(true)

        try {

            var pitems = await AsyncStorage.getItem('productList');
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

                    for (let x of productData) {
                        if (x.id == pageNumber) {

                            setProductList(x)

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
            setLastRoute('AllProducts')
        }

        if (productList.length === 0) {

            getSettings()

            getProductDetails()

        }

    })


    function toEditPage() {

        let productList_ = {
            "id": productList.id,
            "productCode": productList.productCode,
            "productName": productList.productName,
            "productQuantity": productList.productQuantity,
            "productAmount": productList.productAmount,
            "productSelling": productList.productSelling,
            "dateAdded": productList.dateAdded,
            "expiryDate": { "month": productList.expiryDate.month, "year": productList.expiryDate.year }
        };

        navigation.reset({
            index: 0,
            routes: [{ name: 'EditProduct', params: productList_ }],
        });

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
            let data = productData
            var updated = data.filter(item => item.id !== parseInt(pageNumber))
            let newupdate = updated

            await AsyncStorage.setItem('productList', JSON.stringify(newupdate));

            setSuccessMsg("Product Deleted!")

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
            <TouchableOpacity
                style={{ marginBottom: SIZES.padding * 3, alignItems: 'flex-start', marginTop: 3 }}
            >
                <View
                    style={{
                        height: 250,
                        width: '100%',
                        marginBottom: 5,
                        borderRadius: 20,
                        justifyContent: 'center',
                        backgroundColor: COLORS.lightGray
                    }}
                >

                    <Text style={{ textAlign: 'center', flexWrap: 'wrap', fontSize: 20, color: COLORS.black, marginBottom: 10 }}>
                        {productList.productName}</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Image
                            source={icons.quantity}
                            style={{ width: 25, height: 25, tintColor: COLORS.tealGreen }}
                        />
                        <Text style={{ fontSize: 15 }}> In Stock: </Text>
                        <View>
                            <Text style={{ width: 120, textAlign: 'left', fontSize: 18, color: COLORS.secondary, marginLeft: 17 }}> {productList.productQuantity} </Text>
                        </View>

                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>

                        <Image
                            source={icons.product}
                            style={{ width: 30, height: 30, tintColor: COLORS.emerald }}
                        />
                        <Text style={{ fontSize: 15 }}>Price:</Text>
                        <View>
                            <Text style={{ width: 120, textAlign: 'center', fontSize: 18, color: COLORS.secondary, marginLeft: 18 }}> {number_format(productList.productSelling)} {currencySymbol} </Text>
                        </View>

                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>

                        <Image
                            source={icons.product}
                            style={{ width: 30, height: 30, tintColor: COLORS.secondary }}
                        />
                        <Text style={{ fontSize: 15 }}>Amount:</Text>
                        <View>
                            <Text style={{ width: 120, textAlign: 'center', fontSize: 18, color: COLORS.secondary }}> {number_format(productList.productAmount)} {currencySymbol} </Text>
                        </View>

                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>

                        <Image
                            source={icons.expire}
                            style={{ width: 30, height: 30, tintColor: COLORS.primary }}
                        />
                        <Text style={{ fontSize: 15 }}>Expires:</Text>
                        <View>
                            <Text style={{ width: 120, textAlign: 'center', fontSize: 18, color: COLORS.secondary }}> {!productList.expiryDate ? null : productList.expiryDate.month}-{!productList.expiryDate ? null : productList.expiryDate.year} </Text>
                        </View>

                    </View>


                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Image
                            source={icons.date}
                            style={{ width: 25, height: 25, tintColor: COLORS.orange }}
                        />
                        <Text style={{ fontSize: 15 }}> Added:</Text>
                        <View>
                            <Text style={{ width: 120, textAlign: 'right', fontSize: 18, color: COLORS.secondary }}> {productList.dateAdded} </Text>
                        </View>

                        <View>

                            <TouchableOpacity
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 100,
                                }}
                                onPress={() => navigation.reset({
                                    index: 0,
                                    routes: [{
                                        name: 'AddSale',
                                        params: {
                                            scanned: true,
                                            scannedcode: productList.productCode,
                                        }
                                    }],
                                })}
                            >
                                <LinearGradient
                                    colors={[COLORS.secondary, COLORS.secondary]}
                                    style={STYLES.defaultButton}


                                >
                                    <Text style={{
                                        color: '#fff',
                                        fontWeight: 'bold'
                                    }}>Add to Cart</Text>
                                </LinearGradient>

                            </TouchableOpacity>
                        </View>


                    </View>


                </View>


            </TouchableOpacity>


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

    function renderBody() {
        return (
            <View
                style={{
                    marginTop: SIZES.padding * 0,
                    marginHorizontal: SIZES.padding * 3,
                }}
            >
                <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
                    {renderFeatures()}

                </SafeAreaView>


            </View>
        )
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
                                        Do you want to Delete {productList.productName}?
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
                    {renderLogo()}

                </View>

                <SafeAreaView style={STYLES.signupFooter}>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        style={{ marginBottom: 25, marginTop: 2 }}
                    >

                        {productList == '' ?
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
                            : renderProduct()
                        }

                        {!isLoading && productList != '' ? renderButton() : null}


                    </ScrollView>

                </SafeAreaView>

            </LinearGradient>
            {renderAreaCodesModal()}
        </KeyboardAvoidingView>
    )
}

export default ViewProduct;