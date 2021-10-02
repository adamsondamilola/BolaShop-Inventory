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
import { TextInput, Menu, Button, Divider, List, Text } from 'react-native-paper';

import DropDown from "react-native-paper-dropdown";

import { COLORS, SIZES, FONTS, icons, images } from "../constants"
import { STYLES } from "../constants/theme";

import AsyncStorage from '@react-native-async-storage/async-storage'

const EditProduct = ({ route, navigation }) => {

    const [showPassword, setShowPassword] = React.useState(false)

    const [areas, setAreas] = React.useState([])
    const [selectedArea, setSelectedArea] = React.useState(null)
    const [modalVisible, setModalVisible] = React.useState(false)

    let errMessage = null;
    const [errMsg, setErrMsg] = React.useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [shopName, setShopName] = useState(null);
    const [currencySymbol, setCurrencySymbol] = useState(null);
    const [shopSettings, setShopSettings] = useState([])

    const [visible, setVisible] = React.useState(false);

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);

    const [productList, setProductList] = useState(route.params)
    //const { itemId, otherParam } = route.params;

    const [newlyScanned, setNewlyScanned] = useState(null)
    const [productCode, setProductCode] = useState(productList.productCode)
    const [productName, setProductName] = useState(productList.productName)
    const [productQuantity, setProductQuantity] = useState(productList.productQuantity)
    const [productAmount, setProductAmount] = useState(productList.productAmount)
    const [productSelling, setProductSelling] = useState(productList.productSelling)
    const [productExpiryYear, setProductExpiryYear] = useState(productList.expiryDate.year)
    const [productExpiryMonth, setProductExpiryMonth] = useState(productList.expiryDate.month)
    const [products, setProducts] = useState(null)
    const [productId, setProductId] = useState(productList.id)
    const [dateAdded, setDateAdded] = useState(productList.dateAdded)
    const [id, setId] = useState(productList.id)

    const [pageNumber, setPageNumber] = useState(productId);


    //let productData = [{
    //    "id": 1,
    //    "productCode": "1013195800001",
    //    "productName": "Ascobitone Vitamin C Syrup",
    //    "productQuantity": "12",
    //    "productAmount": "200",
    //    "productSelling": "230",
    //    "dateAdded": "2021-09-09",
    //    "expiryDate": { "month": "02", "year": "2022" }
    //},
    //{
    //    "id": 2,
    //    "productCode": "1013195800002",
    //    "productName": "Product Name 2",
    //    "productQuantity": "12",
    //    "productAmount": "400",
    //    "productSelling": "430",
    //    "dateAdded": "2021-09-09",
    //    "expiryDate": { "month": "09", "year": "2021" }
    //},
    //{
    //    "id": 3,
    //    "productCode": "1013195800003",
    //    "productName": "Product Name 3",
    //    "productQuantity": "10",
    //    "productAmount": "1000",
    //    "productSelling": "500",
    //    "dateAdded": "2021-09-09",
    //    "expiryDate": { "month": "01", "year": "2021" }
    //},
    //{
    //    "id": 4,
    //    "productCode": "1013195800004",
    //    "productName": "Product Name 4",
    //    "productQuantity": "10",
    //    "productAmount": "1000",
    //    "productSelling": "1200",
    //    "dateAdded": "2021-09-09",
    //    "expiryDate": { "month": "11", "year": "2021" }
    //},
    //{
    //    "id": 5,
    //    "productCode": "8906096001438",
    //    "productName": "Product Name 5",
    //    "productQuantity": "10",
    //    "productAmount": "1000",
    //    "productSelling": "1200",
    //    "dateAdded": "2021-09-09",
    //    "expiryDate": { "month": "11", "year": "2021" }
    //}

    //];

    const [productData, setProductData] = useState([])


    const getSettings = () => {
        try {
            AsyncStorage.getItem('shopSettings', (err, result) => {
                if (result !== null) {
                console.log(result);
                let jsonresult = JSON.parse(result)
                    setShopName(jsonresult.shopName)
                }
            });
        } catch (e) {
            console.log(e)
            navigation.navigate('Settings')
        }
    }


    const updateProduct = async () => {
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

        //Find index of specific object using findIndex method.
        if (productData !== '[]' && productData != '') {

            setModalVisible(false)

            var objIndex = productData.findIndex((obj => obj.id === parseInt(productId)));

            //Log object to Console.
            //console.log("Before update: ", productData[objIndex])

            //Update object's property.
            productData[objIndex].productName = productName
            productData[objIndex].productAmount = productAmount
            productData[objIndex].productSelling = productSelling
            productData[objIndex].productQuantity = productQuantity
            productData[objIndex].expiryDate.year = productExpiryYear
            productData[objIndex].expiryDate.month = productExpiryMonth

            //Log object to console again.
            //console.log("After update: ", productData[objIndex])
           // console.log("List updated: ", productData)

            await AsyncStorage.setItem('productList', JSON.stringify(productData));

            navigation.reset({
                index: 0,
                routes: [{ name: 'ViewProduct', params: { lastroute: 'AllProducts' } }],
            })

            setIsLoading(false)

        }

        setIsLoading(false)
    }


    const updateAction = async () => {

        setModalVisible(true)
        
        if (!productQuantity) setErrMsg("Enter Quantity.");
        else if (!productSelling) setErrMsg("Enter Selling Price.");
        else if (!productName) setErrMsg("Enter Name of Product.");
        else if (!productAmount) setErrMsg("Enter Product Amount.");
        //else if (!productExpiryMonth) setErrMsg("Enter Expiry Month.");
        //else if (!productExpiryYear) setErrMsg("Enter Expiry Year.");
        //else if (productExpiryYear && productExpiryYear.length < 4 || productExpiryYear && productExpiryYear.length > 4) setErrMsg("Enter a valid year")
        //else if (productExpiryMonth && parseInt(productExpiryMonth) < 1 || productExpiryMonth && parseInt(productExpiryMonth) > 12) setErrMsg("Enter a valid month. Eg. March will be 03")
        //else if (productExpiryMonth && parseInt(productExpiryMonth) < 10 && productExpiryMonth.substring(0, 1).toLowerCase() != "0") setErrMsg("Invalid month")
        //else if (isNaN(productExpiryYear) == true) setErrMsg("Year should be a number");
        else if (parseInt(productSelling) < parseInt(productAmount)) setErrMsg("Sorry, selling price can not be less than amount purchased");


        else {
            try {
                setModalVisible(false)
                setErrMsg(null)
                updateProduct()

            } catch (e) {
                console.log(e)
               // alert(e)
                setErrMsg(null)
                setIsLoading(false)
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
                        routes: [{ name: 'ViewProduct', params: { lastroute: 'AllProducts' } }],
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

                <Text style={{ marginLeft: SIZES.padding * 1.5, color: COLORS.white, ...FONTS.h4 }}>Edit Product</Text>
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
                        value={productName}
                        onChangeText={text => setProductName(text)}
                        label='Product Name'
                        mode='outlined'
                        theme={STYLES.textInput}
                    />
                </View>

                <View style={{ marginTop: SIZES.padding * 3 }}>
                    <TextInput
                        returnKeyType="next"
                        keyboardType="number-pad"
                        value={productAmount}
                        onChangeText={text => setProductAmount(text)}
                        label='Product Amount'
                        mode='outlined'
                        theme={STYLES.textInput}
                    />
                </View>

                <View style={{ marginTop: SIZES.padding * 3 }}>
                    <TextInput
                        returnKeyType="next"
                        keyboardType="numeric"
                        value={productSelling}
                        onChangeText={text => setProductSelling(text)}
                        label='Selling Price'
                        mode='outlined'
                        theme={STYLES.textInput}
                    />
                </View>

                <View style={{ marginTop: SIZES.padding * 3 }}>
                    <TextInput
                        returnKeyType="next"
                        keyboardType="numeric"
                        value={productExpiryMonth}
                        onChangeText={text => setProductExpiryMonth(text)}
                        label='Expiry Month'
                        mode='outlined'
                        maxLength={2}
                        theme={STYLES.textInput}
                    />

                    <TextInput
                        returnKeyType="next"
                        keyboardType="numeric"
                        value={productExpiryYear}
                        onChangeText={text => setProductExpiryYear(text)}
                        label='Expiry Year'
                        mode='outlined'
                        mask="YYYY"
                        maxLength={4}
                        theme={STYLES.textInput}
                    />



                </View>

                <View style={{ marginTop: SIZES.padding * 3 }}>
                    <TextInput
                        keyboardType='default'
                        returnKeyType='done'
                        keyboardType="numeric"
                        value={productQuantity}
                        onChangeText={text => setProductQuantity(text)}
                        label='In Stock'
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
                margin: SIZES.padding * 3,
                marginBottom: 50,
                marginTop: 25
            }}>

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
                                    color: '#ff4000',
                                    fontWeight: 'bold'
                                }}>Update</Text>
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

                            {errMsg == null ?
                                <Text style={{ marginLeft: 30, textAlign: "center", marginTop: 30, marginRight: 30, fontSize: 15, color: "#FFFFFF" }}>
                                    Product saved! { }
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
                    >
                        {productList == null ? (
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
                        ): renderBody()}
                        {productList == null ? null: renderButton()}

                    </ScrollView>
                </SafeAreaView>

            </LinearGradient>
            {renderAreaCodesModal()}
        </KeyboardAvoidingView>
    )
}

export default EditProduct;