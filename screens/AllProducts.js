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

const AllProducts = ({ navigation }) => {

    //let productData = []

    //productData = [{
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
    const [productList, setProductList] = useState([])

    const [productsCartCount, setProductsCartCount] = useState(0)

    const [modalVisible, setModalVisible] = React.useState(false)

    let errMessage = null;
    const [errMsg, setErrMsg] = React.useState(null);

    const [shopName, setShopName] = useState(null);
    const [currencySymbol, setCurrencySymbol] = useState(null);

    const [search, setSearch] = useState(null);
    const [searchOn, setSearchOn] = useState(false);

    const [productsCount, setProductsCount] = useState(0)

    

    const [isLoading, setIsLoading] = useState(false);

    const title = "Products"

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


    



    function expirySoon() {

    }


    function renderHeader() {
        return (
            <View>
            <TouchableOpacity
                style={STYLES.headerTitleView}
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

                {productsCartCount > 0 ?
            <TouchableOpacity
                style={{
                    marginTop: 0,
                    marginRight: 10,
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                }}
                onPress={() => navigation.reset({
                    index: 0,
                    routes: [{ name: 'AddSale', params: { 'scannedcode': '' } }],
                })}
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
                    <Text

                        style={{
                            fontSize: 18,
                            textAlign: 'center',
                            tintColor: COLORS.secondary
                                }}
                            >{productsCartCount}</Text>
                </View>
            </TouchableOpacity>
            :
            null
        }
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
                routes: [{ name: 'ViewProduct', params: { lastroute: 'AllProducts' } }],
            })

        } catch (error) {
            setErrMsg("Failed. Please try again. " + error)
            setIsLoading(false)
            setModalVisible(true)
        }

    }

    const getProductList = async () => {
//        await AsyncStorage.removeItem('productList')
        setIsLoading(true)

        try {

            var pitems = await AsyncStorage.getItem('productList');
            if (pitems) {

                var x = JSON.parse(pitems)
                setProductData(x)
                setProductList(x.sort((a, b) => b.id - a.id).slice(0, 100)) //descending order by id

                let counter = 0
                for (let i = 0; i < x.length; i++) {
                    if (x[i].id != "0") counter++;
                }
                setProductsCount(counter)

                if (pitems === '[]') {
                    await AsyncStorage.removeItem('productList')
                }

            }


        } catch (e) {
            console.log(e)
            setErrMsg(null)
        }

        setIsLoading(false)

    }

    const getCartList = async () => {

        setIsLoading(true)

        try {

            var pitems = await AsyncStorage.getItem('newSale');
            if (pitems) {

                var x = JSON.parse(pitems)

                let counter = 0
                for (let i = 0; i < x.length; i++) {
                    if (x[i].id != "0") counter++;
                }
                setProductsCartCount(counter)

            }

        } catch (e) {
            console.log(e)
            setErrMsg(null)
        }

        setIsLoading(false)

    }

    useEffect(() => {

        getCartList()

        if (productList == '' || productList == null) {

            getProductList()

        }
    }, [])

    const getSearchedProduct = (searching) => {
        //alert(searching)
        setSearch(searching)
        setSearchOn(false)
        setIsLoading(true)

        setModalVisible(false)

        setTimeout(async () => {

            try {
                for (let x of productData) {
                    if ((x.productName).includes(searching)) {
                        setModalVisible(false)
                        setErrMsg(null)
                        const result = productData.filter(y => (y.productName).includes(searching))
                        setProductList(result)
                        
                    }
                    else if (x.productAmount.includes(searching)) {

                        const result = productData.filter(y => y.productAmount === searching)
                        setProductList(result)
                        setModalVisible(false)
                        setErrMsg(null)                        
                        
                    }
                    else if (x.productSelling === searching) {
                        const result = productData.filter(y => y.productSelling === searching)
                        setProductList(result)
                        setModalVisible(false)
                        setErrMsg(null)
                    }
                    else if (x.productQuantity === searching) {
                        const result = productData.filter(y => y.productQuantity === searching)
                        setProductList(result)
                        setModalVisible(false)
                        setErrMsg(null)
                    }
                    else if ((x.productCode).includes(searching)) {
                        const result = productData.filter(y => (y.productCode).includes(searching))
                        setProductList(result)
                        setModalVisible(false)
                        setErrMsg(null)
                    }
                }

                setIsLoading(false)
            } catch (e) {
                console.log(e)
                setIsLoading(false)
            }

        }, 1000);

    }


   


    function renderProducts() {

        const renderItem = ({ item }) => (
            <View
  style={{ marginBottom: 2, alignItems: 'flex-start', marginTop: 3 }}                
  >
  <View
      style={{
          height: 70,
          width: '100%',
          marginBottom: 5,
          borderRadius: 10,
          justifyContent: 'center',
          backgroundColor: COLORS.lightGray
      }}
  >
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{flex: 1, fontSize: 18, fontWeight: 'bold', color: COLORS.black }}>
      {item.productName}</Text>
      <Text style={{textAlign: 'center', fontSize: 18, color: COLORS.secondary }}> {number_format(item.productSelling)} {currencySymbol} </Text>                    
          </View>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ flex: 1, color: COLORS.black }} >In Stock: {item.productQuantity}{"\n"}{item.expiryDate.month !== null ? ("#Exp :"+ item.expiryDate.month  +"-"+ item.expiryDate.year ) : null }</Text>
      <TouchableOpacity
  style={{backgroundColor: COLORS.secondary, color: COLORS.white,borderRadius: 5, width: 50, height: 20,
  alignItems: 'center', marginRight: 6}}
  onPress={() => actionsButton(item.id)}>
  <Text style={{ flex: 1, color: COLORS.white }} >Details </Text>
  
  </TouchableOpacity>
  
  <TouchableOpacity
  style={{backgroundColor: COLORS.secondary, color: COLORS.white,borderRadius: 5, height: 20,
  alignItems: 'center', marginRight: 6}}
  onPress={() => navigation.reset({
    index: 0,
    routes: [{
        name: 'AddSale',
        params: {
            scanned: true,
            scannedcode: item.productCode,
        }
    }],
})}>
  <Text style={{ flex: 1, color: COLORS.white }} >Add to Cart </Text>
  
  </TouchableOpacity>
      </View>
  </View>
  
  
  </View>
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

                </View>

                <SafeAreaView style={STYLES.signupFooter}>



                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        scrollEnabled={false}
                        style={{ height: 150 }}
                    >
                        <View style={{ marginTop: SIZES.padding * 2 }}>
                            <Text style={{ fontSize: 15 }}>Total Products: {number_format(productsCount)}</Text>

                            <TextInput
                                placeholderTextColor={COLORS.primary}
                                returnKeyType="search"
                                borderBottomColor={COLORS.primary}
                                value={search}
                                onChangeText={text => getSearchedProduct(text)}
                                onSubmitEditing={() => getSearchedProduct(search)}
                                label='Search'
                                mode='outlined'
                                theme={STYLES.textInput}
                            />

                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    right: 2,
                                    bottom: 10,
                                    height: 30,
                                    width: 30,
                                    zIndex: 1
                                }}
                                onPress={() => navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'ScanNew' }],
                                })
                                }
                            >
                                <Image
                                    source={icons.qr}
                                    style={{
                                        height: 30,
                                        width: 30,
                                        tintColor: COLORS.primary
                                    }}
                                />
                            </TouchableOpacity>
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

export default AllProducts;