import React, { useEffect, useRef, useState } from "react";
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
import number_format from "../constants/number_format";

const ViewDebtor = ({ navigation, route }) => {

    const [lastRoute, setLastRoute] = React.useState(route.params.lastroute)
    const [modalVisible, setModalVisible] = React.useState(false)

    const [delete_, setDelete_] = React.useState(false)
    const [update, setUpdate] = React.useState(false)

    const [errMsg, setErrMsg] = React.useState(null);
    const [successMsg, setSuccessMsg] = React.useState(null);

    const [shopName, setShopName] = useState(null);
    const [currencySymbol, setCurrencySymbol] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const [description, setDescription] = useState(null)
    const [amount, setAmount] = useState(null)
    const [phone, setPhone] = useState(null)
    const [email, setEmail] = useState(null)
    const [signUpDate, setSignUpDate] = useState(null)
    const [location, setLocation] = useState(null)

    const title = "Debtor Details"

    const [pageNumber, setPageNumber] = useState(null);

    const [showDetails, setShowDetails] = useState(false);

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




    const [customerData, setCustomerData] = useState([])
    let customersList = []
    const [debtorsData, setDebtorsData] = useState([])
    const [debtorsList, setDebtorsList] = useState([])

    const getDebtorDetails = async () => {
        setIsLoading(true)
        try {
            var pitems = await AsyncStorage.getItem('debtorsList');
            if (pitems) {
                var x = JSON.parse(pitems)
                setDebtorsData(x)

            }

        } catch (e) {
            console.log(e)
            setErrMsg(null)
        }

        setIsLoading(false)

        try {
if(debtorsData.length > 0)
{
            await AsyncStorage.getItem('pageNumber', (err, result) => {
                //  console.log(result);
                let jsonresult = result
                if (jsonresult != null) {
                    setPageNumber(jsonresult)
                    for (let x of debtorsData) {
                        if (x.id == pageNumber) {
                            setDebtorsList(x)
                        }
                    }

                }
            });
}

        } catch (e) {
            console.log(e)
            setErrMsg(null)
        }
    }

    const getCustomerDetails = async () => {
        setIsLoading(true)
        let list = null;
        try {
            var pitems = await AsyncStorage.getItem('customersList');
            if (pitems) {

                var x = JSON.parse(pitems)
                list = x
//                setCustomerData(x)
//                alert(JSON.stringify(customerData))
            }

        } catch (e) {
            console.log(e)
            setErrMsg(null)
        }
        
        try {

            if (list != null) {
                
                    // alert(customerData)
                    var x = list.filter(y => parseFloat(y.phone) == parseFloat(debtorsList.phone))
                    customersList = x[0]
                    setPhone(customersList.phone)
                    setEmail(customersList.email)
                    setLocation(customersList.location)
                    setSignUpDate(customersList.dateAdded)
                    //alert(customersList.phone)
                   // alert(JSON.stringify(phone))
                    /*
                    for (let x of customerData) {
                        if (x.phone === pageNumber) {
                            setCustomersList(x)
                        }
                    } */


            }
        } catch (e) {
            console.log(e)
            
            setErrMsg(null)
        }
        if (customersList.phone != null) {
            setIsLoading(false)
            setShowDetails(true)
        }
    }
    let isRendered = useRef(false);
    useEffect(() => {
        isRendered = true;
        if(isRendered){
        if (lastRoute == null || lastRoute == '') {
            setLastRoute('Debtors')
        }

        if (debtorsList.length < 1) {

            getSettings()
            getDebtorDetails();
          //  getCustomerDetails()

        }

    }else{
        isRendered = false;
    }

    })

    function toEditPage() {
        setPhone(debtorsList.phone)
        setDescription(debtorsList.description)
        setAmount(debtorsList.amount)
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
            let data = debtorsData
            var updated = data.filter(item => item.id !== debtorsList.id)
            let newupdate = updated

            await AsyncStorage.setItem('debtorsList', JSON.stringify(newupdate));

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


    //function renderDebtorDetails() {
        const renderDebtorDetails = () => (
           <View style={{ marginBottom: SIZES.padding * 3, alignItems: 'center', marginTop: 3 }}
            >
                <View
                    style={{
                        height: 200,
                        width: '100%',
                        borderRadius: 20,
                        justifyContent: 'center',
                        backgroundColor: COLORS.lightGray
                    }}
                >

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Image
                            source={icons.product}
                            style={{ width: 30, height: 30, tintColor: COLORS.emerald }}
                        />
                        <Text style={{ fontSize: 15 }}> Amount:</Text>
                        <Text style={{ flex: 1, textAlign: 'right', fontSize: 18, color: COLORS.secondary }}> {number_format(parseFloat(debtorsList.amount))}  </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>

                        <Image
                            source={icons.info}
                            style={{ width: 30, height: 30, tintColor: COLORS.secondary }}
                        />
                        <Text style={{ fontSize: 15 }}> Description:</Text>
<Text style={{flex: 1, textAlign: 'right', fontSize: 18, color: COLORS.secondary }}> {debtorsList.description}  </Text>

                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>

                     
                           {debtorsList.status === 1 ? 
    <TouchableOpacity
    style={{flex: 1, backgroundColor: COLORS.emerald, color: COLORS.white,borderRadius: 5,
        alignItems: 'center', marginRight: 5}}>
    <Text style={{ color: COLORS.white }}> Paid </Text>
    </TouchableOpacity>

    : debtorsList.status === 0 ?
    
    <TouchableOpacity
style={{flex: 1, backgroundColor: COLORS.red, color: COLORS.white,borderRadius: 5, width: 50,
    alignItems: 'center', marginRight: 5}}>
<Text style={{color: COLORS.white, textAlign: 'center' }}> Pending </Text>
</TouchableOpacity>

    : null
}

{debtorsList.status === 1 ? 
    <TouchableOpacity
    onPress={() => markAsPaidOrUnpaid() }
    style={{flex: 1, backgroundColor: COLORS.red, color: COLORS.white,borderRadius: 5,
        alignItems: 'center'}}>
    <Text style={{ color: COLORS.white }}> Mark as Unpaid </Text>
    </TouchableOpacity>

    : debtorsList.status === 0 ?
    
    <TouchableOpacity
    onPress={() => markAsPaidOrUnpaid() }
style={{flex: 1, backgroundColor: COLORS.emerald, color: COLORS.white,borderRadius: 5, width: 50,
    alignItems: 'center'}}>
<Text style={{color: COLORS.white, textAlign: 'center' }}> Mark as Paid </Text>
</TouchableOpacity>

    : null

}
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Image
                            source={icons.date}
                            style={{ width: 25, height: 25, tintColor: COLORS.orange }}
                        />
                        <Text style={{ fontSize: 15 }}> Date Added:</Text>
                            <Text style={{  flex: 1, textAlign: 'right', fontSize: 18, color: COLORS.secondary }}> {dateToString(debtorsList.dateAdded)} </Text>
                        
                    </View>


                </View>

                {!isLoading && debtorsList != '' ? renderButton() : null}

            </View>
        )

    

    function renderCustomerDetails() {
        return (
            
            <View style={{ marginBottom: SIZES.padding * 3, alignItems: 'center' }}>
                <View
                    style={{
                        height: 120,
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
onPress={() => Linking.openURL("tel:"+phone)}>
<Text style={{textAlign: 'right', fontSize: 18, color: COLORS.secondary }}> {phone}  </Text>
</TouchableOpacity>
                            

                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>

                        <Image
                            source={icons.envelope}
                            style={{ width: 30, height: 30, tintColor: COLORS.secondary }}
                        />
                          <TouchableOpacity
style={{flex: 1}}
onPress={customersList.email !== null ? () => Linking.openURL("mailto:"+email): null}>
<Text style={{textAlign: 'right', fontSize: 18, color: COLORS.secondary }}> {email}  </Text>
</TouchableOpacity>

                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>

                        <Image
                            source={icons.location}
                            style={{ width: 30, height: 30, tintColor: COLORS.secondary }}
                        />
                        <Text style={{ flex: 1, textAlign: 'right', fontSize: 18, color: COLORS.secondary }}> {location}</Text>

                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Image
                            source={icons.date}
                            style={{ width: 25, height: 25, tintColor: COLORS.orange }}
                        />
                            <Text style={{  flex: 1, textAlign: 'right', fontSize: 18, color: COLORS.secondary }}> {dateToString(signUpDate)} </Text>
                        
                    </View>


                </View>

                

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

                {!showDetails ? 
                    <View>
                        <TouchableOpacity
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 300,
                            }}
                            onPress={() => { getCustomerDetails() }}
                        >
                            <LinearGradient
                                colors={[COLORS.emerald, COLORS.green]}
                                style={STYLES.defaultButton}
                            >
                                <Text style={{
                                    color: '#fff',
                                    fontWeight: 'bold'
                                }}>Get Customer Details</Text>
                            </LinearGradient>

                        </TouchableOpacity>
                    </View>
                    : null}



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
                        keyboardType="number-pad"
                        value={phone}
                        editable={false}
                        maxLength={50}
                        onChangeText={text => setPhone(text)}
                        label='Phone Number'
                        mode='outlined'
                        theme={STYLES.textInput}
                    />
                </View>

                <View style={{ marginTop: SIZES.padding * 3 }}>
                    <TextInput
                        returnKeyType="next"
                        keyboardType="default"
                        value={description}
                        onChangeText={text => setDescription(text)}
                        label='Description'
                        mode='outlined'
                        theme={STYLES.textInput}
                    />
                </View>

                <View style={{ marginTop: SIZES.padding * 3 }}>
                    <TextInput
                        returnKeyType="done"
                        keyboardType="number-pad"
                        value={amount}
                        onChangeText={text => setAmount(text)}
                        label='Amount'
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
        if (!description) setErrMsg("Enter Description.");
        else if (description.length > 100) setErrMsg("Description too long");
        else if (!phone) setErrMsg("Enter phone number.");
        else if (phone.length > 25) setErrMsg("Phone number too long.");
        else if (isNaN(phone) === true) setErrMsg("Phone number should be numbers.");
        else if (!amount) setErrMsg("Enter amount.");
        else if (parseInt(amount) < 1) setErrMsg("Enter a valid amount");
        else{
            updateDebtor();
        }
    }

    const updateDebtor = async () => {
        setIsLoading(true)
        try {

            var pitems = await AsyncStorage.getItem('debtorsList');
            if (pitems) {

                var x = JSON.parse(pitems)
                setDebtorsData(x)

            }


        } catch (e) {
            console.log(e)
            setErrMsg(null)
        }

        //Find index of specific object using findIndex method.
        if (debtorsData !== '[]' && debtorsData != '') {

            setModalVisible(false)

            var objIndex = debtorsData.findIndex((obj => obj.id === debtorsList.id));

            //Update object's property.
            debtorsData[objIndex].description = description
            debtorsData[objIndex].phone = phone
            debtorsData[objIndex].amount = amount

            await AsyncStorage.setItem('debtorsList', JSON.stringify(debtorsData));

            navigation.reset({
                index: 0,
                routes: [{ name: 'ViewDebtor', params: { lastroute: 'Debtors' } }],
            })

            setIsLoading(false)

        }

        setIsLoading(false)
        setUpdate(false)
    }

    const markAsPaidOrUnpaid = async () => {
        setIsLoading(true)
        try {

            var pitems = await AsyncStorage.getItem('debtorsList');
            if (pitems) {

                var x = JSON.parse(pitems)
                setDebtorsData(x)

            }


        } catch (e) {
            console.log(e)
            setErrMsg(null)
        }

        //Find index of specific object using findIndex method.
        if (debtorsData !== '[]' && debtorsData != '') {

            setModalVisible(false)

            var objIndex = debtorsData.findIndex((obj => obj.id === debtorsList.id));

            //Update object's property.
            if(debtorsList !== 1){
                debtorsData[objIndex].status = 1
            }
            else{
                debtorsData[objIndex].status = 0
            }
            

            await AsyncStorage.setItem('debtorsList', JSON.stringify(debtorsData));

            navigation.reset({
                index: 0,
                routes: [{ name: 'ViewDebtor', params: { lastroute: 'Debtors' } }],
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
                        {!update? renderDebtorDetails(): renderUpdateForm()}

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
                            : null
                        }

                        {showDetails? renderCustomerDetails() : null }

                    </ScrollView>

                </SafeAreaView>

            </LinearGradient>
            {renderAreaCodesModal()}
        </KeyboardAvoidingView>
    )
}

export default ViewDebtor;