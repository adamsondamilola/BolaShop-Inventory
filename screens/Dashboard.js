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
    Platform,
    TouchableHighlight
} from "react-native"
import { LinearGradient } from 'expo-linear-gradient'
import { Avatar } from 'react-native-paper';

import { COLORS, SIZES, FONTS, icons, images } from "../constants"
import { STYLES } from "../constants/theme";

import AsyncStorage from '@react-native-async-storage/async-storage'

import RNHTMLtoPDF from 'react-native-html-to-pdf';


const Dashboard = ({ navigation }) => {


    const [modalVisible, setModalVisible] = React.useState(false)

    const [errMsg, setErrMsg] = React.useState(null);

    const [shopName, setShopName] = useState(null);
    const [currencySymbol, setCurrencySymbol] = useState(null);

    const [productsCount, setProductsCount] = useState(0)

    const [isLoading, setIsLoading] = useState(false);

    const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

    const title = "Dashboard"


    const createPDF = async () => {
        let options = {
            html: '<h1>PDF TEST</h1>',
            fileName: 'test',
            directory: 'Documents',
        };

        let file = await RNHTMLtoPDF.convert(options)
         console.log(file.filePath);
        //alert(file.filePath);
    }

    const downloandPDF = () => {
        return (
            <View>
                <TouchableHighlight onPress={() => createPDF()}>
                    <Text>Create PDF</Text>
                </TouchableHighlight>
            </View>
        )
    }


    const getSettings = () => {
        try {
            AsyncStorage.getItem('shopSettings', (err, result) => {
                console.log(result);
                let jsonresult = JSON.parse(result)
                if (jsonresult !== null) {
                    setShopName(jsonresult.shopName)
                    setCurrencySymbol(jsonresult.currencySymbol)
                }
                else {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Settings'}],
                    })
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
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const [productData, setProductData] = useState([])
    const [productList, setProductList] = useState([])
   


    const featuresData = [
        {
            id: 1,
            icon: images.logo,
            color: COLORS.emerald,
            backgroundColor: COLORS.lightGray,
            description: "All Products"
        },
        {
            id: 2,
            icon: icons.deposit,
            color: COLORS.secondary,
            backgroundColor: COLORS.lightGray,
            description: "Sales Today"
        },
        {
            id: 3,
            icon: icons.shop,
            color: COLORS.emerald,
            backgroundColor: COLORS.lightGray,
            description: "All Sales"
        },
        {
            id: 4,
            icon: icons.piechart,
            color: COLORS.secondary,
            backgroundColor: COLORS.lightGray,
            description: "Charts"
        },
        {
            id: 5,
            icon: icons.stockout,
            color: COLORS.emerald,
            backgroundColor: COLORS.lightGray,
            description: "Out of Stock"
        },
        {
            id: 6,
            icon: icons.expire,
            color: COLORS.secondary,
            backgroundColor: COLORS.lightGray,
            description: "Expires Soon"
        },
    ]



    const [features, setFeatures] = React.useState(featuresData)


    const getProductList = async () => {

        setIsLoading(true)

        try {

            var pitems = await AsyncStorage.getItem('productList');
            if (pitems) {
               
                var x = JSON.parse(pitems)
                setProductData(x)
                setProductList(x.sort((a, b) => b.id - a.id).slice(0, 5)) //descending order by id

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

            getProductList()

            getCartList()
        }
    },[])


    function renderHeader() {
        return (
            <View>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: "center",
                    marginTop: SIZES.padding * 6,
                    paddingHorizontal: SIZES.padding * 2
                }}
                
                >
                    <TouchableOpacity
                        style={{
                            marginTop: 0,
                            marginRight: 10,
                            justifyContent: 'flex-end',
                            alignItems: 'flex-end',
                        }}
                        onPress={() => navigation.reset({
                            index: 0,
                            routes: [{ name: 'Calculator' }]
                        })}
                    >
                    <Image
                        source={icons.calculator}
                    resizeMode="contain"
                    style={{
                        width: 35,
                        height: 35,
                        tintColor: COLORS.white
                    }}
                        />
                    </TouchableOpacity>

                <Text style={{ marginLeft: SIZES.padding * 1.5, color: COLORS.white, ...FONTS.h4 }}>{shopName}</Text>
                </View>

                {productsCount > 0 ?
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
                                    tintColor: COLORS.secondary
                                }}
                            >{productsCount}</Text>
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
                    marginTop: SIZES.padding * 5,
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Text style={{ fontSize: 25, color: COLORS.white }}>{title}</Text>

            </View>
        )
    }

    const actionsButton = async (description) => {
        if (description === "All Products") {

            await navigation.reset({
                index: 0,
                routes: [{ name: 'AllProducts' }],
            });
        }

        if (description === "Sales Today") {
            await navigation.reset({
                index: 0,
                routes: [{ name: 'TodaysSales' }],
            });
        }

        if (description === "All Sales") {
            await navigation.navigate("AllSales");
        }

        if (description === "Charts") {
            await navigation.reset({
                index: 0,
                routes: [{ name: 'Charts' }],
            });
        }

        if (description === "Out of Stock") {
            await navigation.reset({
                index: 0,
                routes: [{ name: 'OutOfStock' }],
            });
        }

        if (description === "Expires Soon") {
            await navigation.reset({
                index: 0,
                routes: [{ name: 'ExpiringSoon' }],
            });
        }

    }

    function renderFeatures() {

        const renderItem = ({ item }) => (
            <TouchableOpacity
                style={{ marginBottom: SIZES.padding * 0, width: 80, height:80, alignItems: 'center' }}
                onPress={() => actionsButton(item.description)}
            >
                <View
                    style={{
                        height: 50,
                        width: 50,
                        marginBottom: 5,
                        borderRadius: 20,
                        backgroundColor: item.backgroundColor,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Image
                        source={item.icon}
                        resizeMode="contain"
                        style={{
                            height: 40,
                            width: 40,
                            tintColor: item.color
                        }}
                    />
                </View>
                <Text style={{ textAlign: 'center', flexWrap: 'wrap', fontSize: 12 }}>{item.description}</Text>
            </TouchableOpacity>
        )

        return (
            <FlatList
                data={features}
                numColumns={3}
                keyExtractor={item => `${item.id}`}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                renderItem={renderItem}
                style={{ marginTop: SIZES.padding * 1 }}
            />
        )
    }




    const viewAction = async (id) => {
        setIsLoading(true)

        try {
            await AsyncStorage.setItem('pageNumber', JSON.stringify(id));
            setIsLoading(false)

            navigation.reset({
                index: 0,
                routes: [{ name: 'ViewProduct', params: { lastroute: 'Dashboard' } }],
            })

        } catch (error) {
            setErrMsg("Failed. Please try again. " + error)
            setIsLoading(false)
            setModalVisible(true)
        }

    }

    function renderProducts() {

        const renderItem = ({ item }) => (
            <TouchableOpacity
                style={{ marginBottom: SIZES.padding * 3, alignItems: 'flex-start', marginTop: 3 }}
                onPress={() => viewAction(item.id)}
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
                    <Text style={{ textAlign: 'center', flexWrap: 'wrap', fontSize: 13, color: COLORS.black }}> In Stock: {item.productQuantity} {item.expiryDate.month !== null ? (", Expires :"+ item.expiryDate.month  +"-"+ item.expiryDate.year ) : null } </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                       
                         <View style={{ flex: 1, height: 1, backgroundColor: COLORS.emerald }} />
                        <View>
                            <Text style={{ width: 120, textAlign: 'center', fontSize: 18, color: COLORS.secondary }}> {number_format(item.productSelling)} {currencySymbol} </Text>
                        </View>
                        <View style={{ flex: 1, height: 1, backgroundColor: COLORS.emerald }} />
                                             

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

    function renderBody() {
        return (


            <View
                style={{
                    marginTop: SIZES.padding * 0,
                    marginHorizontal: SIZES.padding * 0,
                }}
            >

                
                <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
                    {renderFeatures()}

                </SafeAreaView>
                

            </View>
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
                            style={{ height: 320 }}
                        >

                            {renderBody()}

                        </ScrollView>
                        <ScrollView>
                            <Text style={{
                                padding: 5,
                                fontSize: 15,
                                marginBottom: 25,
                                color: COLORS.white,
                                backgroundColor: COLORS.emerald,
                                marginTop: 5,
                                textAlign: 'center',
                                borderBottomRightRadius: 20,
                                borderBottomLeftRadius: 20
                            }}> Recently Added Products </Text>
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
            {/*{renderAreaCodesModal()}*/}
        </KeyboardAvoidingView>
    )
}

export default Dashboard;