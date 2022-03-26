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
    Linking
} from "react-native"
import { LinearGradient } from 'expo-linear-gradient'
import { TextInput } from 'react-native-paper';

import { COLORS, SIZES, FONTS, icons, images } from "../constants"
import { STYLES } from "../constants/theme";

import AsyncStorage from '@react-native-async-storage/async-storage'
import dateToString from "../constants/dateToString";
import DatePicker from "react-native-datepicker";
import dateTime from "../constants/dateTime";

const Customers = ({ navigation }) => {

    const [customersData, setCustomersData] = useState([])
    const [customersList, setCustomersList] = useState([])

    const [modalVisible, setModalVisible] = React.useState(false)

    let errMessage = null;
    const [errMsg, setErrMsg] = React.useState(null);
    
    const [search, setSearch] = useState(null);
    const [shopName, setShopName] = useState(null);
    const [currencySymbol, setCurrencySymbol] = useState(null);

    const [fromDate, setFromDate] = useState(dateTime.todayDate)
    const [toDate, setToDate] = useState(dateTime.todayDate);
    const [totalCount, setTotalCount] = useState(0);

    const [customersCount, setCustomersCount] = useState(0)

    var today = new Date();
    var thisYear = today.getFullYear()
    var nextYear = today.getFullYear() + 1
    var thisMonth = today.getMonth() + 1

    const [isLoading, setIsLoading] = useState(false);

    const title = "Customers"

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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
            <Text style={{ flex: 1,marginTop: 50, marginLeft: SIZES.padding * 1.5, color: COLORS.white, ...FONTS.h2 }}>{number_format(customersCount)}</Text>
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
                routes: [{ name: 'ViewCustomer', params: { lastroute: 'Customers' } }],
            })

        } catch (error) {
            setErrMsg("Failed. Please try again. " + error)
            setIsLoading(false)
            setModalVisible(true)
        }
    }

    const getCustomersData = async () => {

        setIsLoading(true)

        try {

            var pitems = await AsyncStorage.getItem('customersList');

            if (pitems) {

                var x = JSON.parse(pitems)

                setCustomersData(x)

                let counter = 0

                setCustomersList(x.sort((a, b) => b.id - a.id).slice(0, 100)) //Ascending order by quantity/i stock

                for (let i = 0; i < x.length; i++) {
                    if (x[i].id > 0) counter++;
                }
                setCustomersCount(counter)
                setIsLoading(false)

            }


        } catch (e) {
            console.log(e)
            setErrMsg(null)
            setIsLoading(false)

        }
        setIsLoading(false);
        
    }

    const filterCustomersList = async (text) => {
        
        setIsLoading(true)
       
        try {
            
            var pitems = await AsyncStorage.getItem('customersList');

            if (pitems) {

                var x = JSON.parse(pitems)
                setCustomersData(x)
                if(isNaN(text) === true){
                    var result = x.filter(w => (w.name).toLowerCase().includes(text.toLowerCase()) === true);
                    if(result.length > 0){
                    setCustomersList(result.sort((a, b) => b.id - a.id).slice(0, 100))
                    }
                }
                else{
                    var result = x.filter(w => (w.phone).includes(text) === true);
                    if(result.length > 0){
                        setCustomersList(result.sort((a, b) => b.id - a.id).slice(0, 100))
                        }
                } 
             
                setIsLoading(false)
                
            }


        } catch (e) {
            console.log(e)
            setErrMsg(null)
            setIsLoading(false)

        }
        setIsLoading(false);
        
    }

    useEffect(() => {
       
        getCustomersData()

    },[])

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
                    <Text style={{flex: 1, fontSize: 18, color: COLORS.black }}>
                         {item.name}</Text>
                        <Text style={{flex: 1, textAlign: 'right', fontSize: 18, color: COLORS.secondary }}> {(item.phone).slice(0,6)}...</Text>                    
                        </View>
<View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    <Text style={{ flex: 1, color: COLORS.emerald }} > {dateToString(item.dateAdded)}</Text>
                        
                    <TouchableOpacity
style={{backgroundColor: COLORS.secondary, color: COLORS.white,borderRadius: 5, width: 50,
    alignItems: 'center', marginRight: 6}}
onPress={() => actionsButton(item.id)}>
                            <Text style={{ flex: 1, color: COLORS.white, textAlign: 'center', fontSize: 12 }} > Details </Text>

</TouchableOpacity>
    
<TouchableOpacity
style={{backgroundColor: COLORS.emerald, color: COLORS.white,borderRadius: 5, width: 50,
    alignItems: 'center'}}
onPress={() => Linking.openURL("tel:"+item.phone)}>
                            <Text style={{ flex: 1, color: COLORS.white, textAlign: 'center', fontSize: 12 }} > Call </Text>

</TouchableOpacity>
    

                    </View>
                </View>


            </View>
        )

        return (
            <FlatList
                data={customersList}
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
                <TouchableOpacity
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={() => 
                         navigation.navigate('AddCustomer')
                    }
                >
                    <LinearGradient
                        colors={["transparent", "transparent"]}
                        style={STYLES.signUpPage}
                    >
                        <Text style={{
                            color: COLORS.secondary,
                            fontWeight: 'bold'
                        }}>Add Customer</Text>
                    </LinearGradient>

                </TouchableOpacity>

                <View
                    style={{
                        width: '100%',
                        borderRadius: 10,
                        justifyContent: 'center',
                        padding: 10
                    }}
                >
<View>
                    <TextInput
                        returnKeyType="next"
                        value={search}
                        maxLength={100}
                        onChangeText={(text) =>{
                            setSearch(text);
                            filterCustomersList(text);}}
                        label='Search'
                        mode='outlined'
                        theme={STYLES.textInput}
                    />
                </View>
</View>
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

export default Customers;