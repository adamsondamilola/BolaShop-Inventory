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

const ViewCustomer = ({ navigation, route }) => {

    const [lastRoute, setLastRoute] = React.useState(route.params.lastroute)
    const [modalVisible, setModalVisible] = React.useState(false)

    const [delete_, setDelete_] = React.useState(false)
    const [update, setUpdate] = React.useState(false)

    let errMessage = null;
    const [errMsg, setErrMsg] = React.useState(null);
    const [successMsg, setSuccessMsg] = React.useState(null);

    const [shopName, setShopName] = useState(null);
    const [currencySymbol, setCurrencySymbol] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState(null)
    const [phone, setPhone] = useState(null)
    const [email, setEmail] = useState(null)
    const [address, setAddress] = useState(null)

    const title = "Customer Details"

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


    const [customerData, setCustomerData] = useState([])

    const [customersList, setCustomersList] = useState([])

    const getCustomerDetails = async () => {

        setIsLoading(true)

        try {

            var pitems = await AsyncStorage.getItem('customersList');
            if (pitems) {

                var x = JSON.parse(pitems)
                setCustomerData(x)

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

                    for (let x of customerData) {
                        if (x.id == pageNumber) {

                            setCustomersList(x)

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
            setLastRoute('Customers')
        }

        if (customersList.length === 0) {

            getSettings()

            getCustomerDetails()

        }

    })


    function toEditPage() {
        setName(customersList.name)
        setAddress(customersList.address)
        setPhone(customersList.phone)
        setEmail(customersList.email)
        setUpdate(true)
    }

    function renderHeader() {
        return (
            <TouchableOpacity
                style={STYLES.headerTitleView}
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
            let data = customerData
            var updated = data.filter(item => item.id !== parseInt(pageNumber))
            let newupdate = updated

            await AsyncStorage.setItem('customersList', JSON.stringify(newupdate));

            setSuccessMsg("Details Deleted!")

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
            <View
                style={{ marginBottom: SIZES.padding * 3, alignItems: 'center', marginTop: 3 }}
            >
                <View
                    style={{
                        height: 200,
                        width: '100%',
                        marginBottom: 5,
                        borderRadius: 20,
                        justifyContent: 'center',
                        backgroundColor: COLORS.lightGray
                    }}
                >

                    <Text style={{ textAlign: 'center', flexWrap: 'wrap', fontSize: 20, color: COLORS.black, marginBottom: 10 }}>
                        {customersList.name}</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>

                        <Image
                            source={icons.phone}
                            style={{ width: 30, height: 30, tintColor: COLORS.emerald }}
                        />
                        <TouchableOpacity
style={{flex: 1}}
onPress={() => Linking.openURL("tel:"+customersList.phone)}>
<Text style={{textAlign: 'right', fontSize: 18, color: COLORS.secondary }}> {customersList.phone}  </Text>
</TouchableOpacity>
                            

                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>

                        <Image
                            source={icons.envelope}
                            style={{ width: 30, height: 30, tintColor: COLORS.secondary }}
                        />
                          <TouchableOpacity
style={{flex: 1}}
onPress={customersList.email !== null ? () => Linking.openURL("mailto:"+customersList.email): null}>
<Text style={{textAlign: 'right', fontSize: 18, color: COLORS.secondary }}> {customersList.email}  </Text>
</TouchableOpacity>

                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>

                        <Image
                            source={icons.location}
                            style={{ width: 30, height: 30, tintColor: COLORS.secondary }}
                        />
                            <Text style={{ flex: 1, textAlign: 'right', fontSize: 18, color: COLORS.secondary }}> {customersList.address}</Text>

                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Image
                            source={icons.date}
                            style={{ width: 25, height: 25, tintColor: COLORS.orange }}
                        />
                            <Text style={{  flex: 1, textAlign: 'right', fontSize: 18, color: COLORS.secondary }}> {dateToString(customersList.dateAdded)} </Text>
                        
                    </View>


                </View>

                {!isLoading && customersList != '' ? renderButton() : null}

            </View>
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

    function renderUpdateForm() {
    
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
                        value={name}
                        maxLength={50}
                        onChangeText={text => setName(text)}
                        label='Full Name'
                        mode='outlined'
                        theme={STYLES.textInput}
                    />
                </View>

                <View style={{ marginTop: SIZES.padding * 3 }}>
                    <TextInput
                        returnKeyType="next"
                        keyboardType="number-pad"
                        editable={false}
                        value={phone}
                        onChangeText={text => setPhone(text)}
                        label='Phone Number'
                        mode='outlined'
                        theme={STYLES.textInput}
                    />
                </View>

                <View style={{ marginTop: SIZES.padding * 3 }}>
                    <TextInput
                        returnKeyType="next"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={text => setEmail(text)}
                        label='Email (Optional)'
                        mode='outlined'
                        theme={STYLES.textInput}
                    />
                </View>

                <View style={{ marginTop: SIZES.padding * 3 }}>
                    <TextInput
                        returnKeyType="next"
                        keyboardType="default"
                        value={address}
                        onChangeText={text => setAddress(text)}
                        label='Address (Optional)'
                        mode='outlined'
                        theme={STYLES.textInput}
                    />
                </View>

                <View style={{ marginTop: SIZES.padding * 3 }}>
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
                            color: COLORS.secondary,
                            fontWeight: 'bold'
                        }}>Update Details</Text>
                    </LinearGradient>

                </TouchableOpacity>
                    )}
</View>
            </View>
        )
    }

    const updateAction = async () => {
        if (!name) setErrMsg("Enter name.");
        else if (!phone) setErrMsg("Enter phone number.");
        else if (phone.length > 25) setErrMsg("Phone number too long.");
        else if (isNaN(phone) === true) setErrMsg("Phone number should be numbers.");
        else{
            updateCustomer();
        }
    }

    const updateCustomer = async () => {
        setIsLoading(true)
        try {

            var pitems = await AsyncStorage.getItem('customersList');
            if (pitems) {

                var x = JSON.parse(pitems)
                setCustomerData(x)

            }


        } catch (e) {
            console.log(e)
            setErrMsg(null)
        }

        //Find index of specific object using findIndex method.
        if (customerData !== '[]' && customerData != '') {

            setModalVisible(false)

            var objIndex = customerData.findIndex((obj => obj.id === parseInt(customersList.id)));

            //Update object's property.
            customerData[objIndex].name = name
            customerData[objIndex].phone = phone
            customerData[objIndex].email = email
            customerData[objIndex].address = address

            await AsyncStorage.setItem('customersList', JSON.stringify(customerData));

            navigation.reset({
                index: 0,
                routes: [{ name: 'ViewCustomer', params: { lastroute: 'Customers' } }],
            })

            setIsLoading(false)

        }

        setIsLoading(false)
        setUpdate(false)
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
                                        Do you want to Delete {customersList.productName}?
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

                </View>

                <SafeAreaView style={STYLES.signupFooter}>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        style={{ marginBottom: 25, marginTop: 2 }}
                    >

                        {!update? renderProduct() : renderUpdateForm() }
                        
                        {customersList == '' ?
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
                            : null
                        }

                    </ScrollView>

                </SafeAreaView>

            </LinearGradient>
            {renderAreaCodesModal()}
        </KeyboardAvoidingView>
    )
}

export default ViewCustomer;