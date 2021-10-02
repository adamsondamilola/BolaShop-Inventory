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

const AddProduct = ({ navigation, route }) => {

    const [modalVisible, setModalVisible] = React.useState(false)

    const [errMsg, setErrMsg] = React.useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [shopName, setShopName] = useState(null);
    const [currencySymbol, setCurrencySymbol] = useState(null);
    const [shopSettings, setShopSettings] = useState([])

    const [visible, setVisible] = React.useState(false);

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);

    const [newlyScanned, setNewlyScanned] = useState(route.params.scannedcode)
    const [productName, setProductName] = useState(null)
    const [productQuantity, setProductQuantity] = useState(null)
    const [productAmount, setProductAmount] = useState(null)
    const [productSelling, setProductSelling] = useState(null)
    const [productExpiryYear, setProductExpiryYear] = useState(null)
    const [productExpiryMonth, setProductExpiryMonth] = useState(null)
    const [id, setId] = useState(1)

    var today = new Date();
    var dateNow = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    const [ifExists, setIfExists] = useState(false)

    let productList = {
        "id": id,
        "productCode": newlyScanned,
        "productName": productName,
        "productQuantity": productQuantity,
        "productAmount": productAmount,
        "productSelling": productSelling,
        "dateAdded": dateNow,
        "expiryDate": { "month": productExpiryMonth, "year": productExpiryYear }
    };



    const checkIfCodeExists = async () => {
        
        var counter_ = 0
        try {
            setIsLoading(true)
            var prods = await AsyncStorage.getItem('productList');
            if (prods) {
                var y = JSON.parse(prods)

                for (let i = 0; i < y.length; i++) {
                    if (y[i].productCode === newlyScanned) counter_++;
                }

                if (counter_ > 0) {
                    
                    for (let x of y) {
                        if (x.productCode == newlyScanned) {

                            await AsyncStorage.setItem('pageNumber', JSON.stringify(x.id));

                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'ViewProduct', params: { lastroute: 'Dashboard' } }],
                                })


                            setIsLoading(false)

                        }
                    }
                    setIfExists(true)
                }


            }
            setIsLoading(false)
        } catch (e) {
            setIsLoading(false)
            setModalVisible(true)
        }

    }


    const resetFields = () => {
        setProductQuantity(null)
        setProductSelling(null)
        setProductName(null)
        setProductAmount(null)
        setProductExpiryMonth(null)
        setProductExpiryYear(null)
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

            checkIfCodeExists()

    }, [])

    useEffect(() => {
        getSettings();

    }, [])

    const saved = () => {
        setIsLoading(false)
        navigation.reset({
            index: 0,
            routes: [{ name: 'Dashboard' }],
        })
    }



    const addAction = async () => {
        let counter_ = 0;
        try {
            setIsLoading(true)
            var prods = await AsyncStorage.getItem('productList');
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

        if (!productQuantity) setErrMsg("Enter Quantity.");
        else if (!productSelling) setErrMsg("Enter Selling Price.");
        else if (!productName) setErrMsg("Enter Name of Product.");
        else if (!productAmount) setErrMsg("Enter Product Amount.");
        else if (parseInt(productSelling) < parseInt(productAmount)) setErrMsg("Sorry, selling price can not be less than amount purchased");
        else if (counter_ > 0) {
            setErrMsg("Product Name Already Exists. Use a different name")
        }

        else {
            setErrMsg(null)

            try {
            //  await AsyncStorage.removeItem('productList')
                setIsLoading(true)
                var pitems = await AsyncStorage.getItem('productList');
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

                        let productList_ = {
                            "id": newId,
                            "productCode": newlyScanned,
                            "productName": productName,
                            "productQuantity": productQuantity,
                            "productAmount": productAmount,
                            "productSelling": productSelling,
                            "dateAdded": dateNow,
                            "expiryDate": { "month": productExpiryMonth, "year": productExpiryYear }
                        };

                            var str = pitems
                            str = str.replace("[", "") //eplace [
                            str = str.replace("]", "") //eplace ]
                            var newPitems = "[" + str + "," + JSON.stringify(productList_) + "]"
                            await AsyncStorage.setItem('productList', newPitems);

                        saved()


                    }

                    setIsLoading(false)
                    
                } else {
                    await AsyncStorage.setItem('productList', JSON.stringify([productList]));
                    saved()

                }
             
                const items_ = await AsyncStorage.getItem('productList');
                if (items_ !== null)
                    console.log(JSON.parse(items_));

                
            } catch (e) {
                console.log(e)
                setErrMsg(null)                
                setIsLoading(false)
            }
            

        }

        setModalVisible(true)
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
                onPress={() => navigation.goBack()}
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

                <Text style={{ marginLeft: SIZES.padding * 1.5, color: COLORS.white, ...FONTS.h4 }}>Add Product</Text>
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
                            color: '#ff4000',
                            fontWeight: 'bold'
                        }}>Add New</Text>
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
                    {renderLogo()}


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

export default AddProduct;