import React, { useEffect, useState, useRef } from "react";
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

import ViewShot from "react-native-view-shot";
import * as Sharing from 'expo-sharing';


const Invoice = ({ navigation, route }) => {

    const [lastRoute, setLastRoute] = useState(route.params.lastroute)

    const [productList, setProductList] = useState([])

    const [modalVisible, setModalVisible] = React.useState(false)

    const [errMsg, setErrMsg] = React.useState(null);

    const [shopName, setShopName] = useState(null);
    const [currencySymbol, setCurrencySymbol] = useState(null);

    const [orderId, setOrderId] = useState(route.params.orderId)

    const [isLoading, setIsLoading] = useState(false);

    const [id, setId] = useState(1)

    var timeNow = dateTime.currentTime
    var dateNow = dateTime.dateNow + ' ' + timeNow

    const [dateAdded, setDateAdded] = useState(null)
    const [totalSellingAmount, setTotalSellingAmount] = useState(0)
    const [totalProducts, setTotalProducts] = useState(0)
    const [totalItems, setTotalItems] = useState(0)

    const [imageUrl, setImageUrl] = useState(null)

    const [data, setData] = useState([])

    const title = "Invoice"

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

    //screenshop
    const viewShot = useRef()

    const shareInvoice = () => {
        viewShot.current.capture().then(uri => {
            console.log("do something with ", uri);
            setImageUrl(uri)
            //setModalVisible(true)
            Sharing.shareAsync(uri)
        });
    }

    useEffect(() => {

        getSettings()
        
    }, [])

    useEffect(() => {

        if (totalSellingAmount === 0) {

            searchByYearMonthDay(orderId)
        }
    })

    useEffect(() => {
        if (lastRoute === null || lastRoute === '') {
            setLastRoute('Dashboard')
        }
    })


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
                        routes: [{ name: lastRoute }],
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
                <Text style={{ fontSize: 15, color: COLORS.white }}><Text style={{ fontSize: 50, color: COLORS.white }}> {number_format(totalSellingAmount)}</Text> {currencySymbol} </Text>

            </View>
        )
    }

    const searchByYearMonthDay = async (id) => {
       
        setModalVisible(false)
        setIsLoading(true)


            setErrMsg(null)
            setModalVisible(false)

            setTimeout(async () => {

                try {
                    var pitems = await AsyncStorage.getItem('productCarts');
                    if (pitems) {

                        pitems = JSON.parse(pitems)

                        let result = pitems.filter(w => w.id === parseInt(id))


                        var x = result

                        setProductList(x.sort((a, b) => b.id - a.id).slice(0, 500)) //descending order by id

                        if (productList !== '') {
                            
                            setDateAdded(productList[0].dateAdded)
                            setTotalItems(productList[0].items)
                            setTotalSellingAmount(productList[0].total_selling_amount)
                            setTotalProducts(productList[0].products)
                            setData(productList[0].data.allCarts)

                         //   alert(JSON.stringify(productList))

                            setIsLoading(false)
                        }


                    }


                } catch (e) {
                    console.log(e)
                    setErrMsg(null)
                    setErrMsg("An error occured. Please, try again")
                    setModalVisible(true)
                }
            }, 1000);


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
                    <Text style={{ textAlign: 'center', flexWrap: 'wrap', fontSize: 15, color: COLORS.black }}> Units: {item.productQuantity}</Text>
                    

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                        <View style={{ flex: 1, height: 1, backgroundColor: COLORS.emerald }} />
                        <View>
                            <Text style={{ width: 120, textAlign: 'center', fontSize: 18, color: COLORS.secondary }}> {number_format(item.productTotalAmount)} {currencySymbol} </Text>
                        </View>
                        <View style={{ flex: 1, height: 1, backgroundColor: COLORS.emerald }} />
                        
                    </View>

                </View>


            </View>
        )

        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                collapsable={false}
            >
            <FlatList
                data={data}
                renderItem={renderItem}
                style={{ marginTop: SIZES.padding * 2 }}
                />
            </ScrollView>

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
                    <ViewShot ref={viewShot}
                        options={{ format: "jpg", quality: 0.9 }}
                        style={{ backgroundColor: COLORS.white }}
                        >

                          <View>
                            <View
                                style={{ marginTop: SIZES.padding * 3, flexDirection: 'row' }}>
                                <Text style={{ alignContent: 'flex-start', textAlign: 'center', flexWrap: 'wrap', fontSize: 18, color: COLORS.black, marginLeft: 10 }}>
                                    Order ID: <Text style={{ fontSize: 25, color: COLORS.secondary }}>#{orderId}</Text></Text>
                                <Text style={{ justifyContent: 'flex-end', fontSize: 18, color: COLORS.black, marginLeft: 10 }}> Products: <Text style={{ fontSize: 25, color: COLORS.secondary }}> {number_format(totalProducts)} </Text> </Text>                                    
                            </View>
                            <View>
                                <Text style={{ fontSize: 15, color: COLORS.black, marginLeft: 10 }}>Total: <Text style={{ fontSize: 25, color: COLORS.secondary }}> {number_format(totalSellingAmount)}</Text> {currencySymbol} </Text>
                            </View>
                            <View style={{marginLeft: 10 }}>
                                <Text style={{ textAlign: 'left', flexWrap: 'wrap', fontSize: 15, color: COLORS.black }}>{dateAdded}</Text>
                                <Text style={{ textAlign: 'left', flexWrap: 'wrap', fontSize: 15, fontWeight: 'bold', color: COLORS.black }}>{shopName}</Text>
                            </View>
                            </View>
                    </ViewShot>

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
                                </TouchableOpacity>
                                :
                            
                             renderProducts()

                        }

                           
                        
                    
                </SafeAreaView>

            </LinearGradient>
            {renderAreaCodesModal()}

            <TouchableOpacity
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    bottom: 0,
                    alignSelf: 'flex-end',
                    width: 80
                }}
                onPress={() => shareInvoice()}
            >
                <LinearGradient
                    colors={[COLORS.emerald, COLORS.emerald]}
                    style={STYLES.defaultButton}
                >

                    <Image
                            source={icons.share}
                            resizeMode="contain"
                            style={{
                                width: 40,
                                height: 40,
                                tintColor: COLORS.white
                            }}
                        />


                </LinearGradient>

            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}

export default Invoice;