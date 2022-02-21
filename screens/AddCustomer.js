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
import dateTime from "../constants/dateTime";

const AddCustomer = ({ navigation, route }) => {

    const [modalVisible, setModalVisible] = React.useState(false);
    const [errMsg, setErrMsg] = React.useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [shopName, setShopName] = useState(null);

    const [visible, setVisible] = React.useState(false);

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);

    const [name, setName] = useState(null)
    const [phone, setPhone] = useState(null)
    const [email, setEmail] = useState(null)
    const [address, setAddress] = useState(null)
    const [id, setId] = useState(1)

    var dateNow = dateTime.todayDate;

    let customersList = [{
        "id": id,
        "name": name,
        "phone": phone,
        "email": email,
        "address": address,
        "dateAdded": dateNow
    }];

    
    const resetFields = () => {
        setName(null)
        setPhone(null)
        setEmail(null)
        setAddress(null)
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
        getSettings();

    }, [])

    const saved = () => {
        resetFields();
        setIsLoading(false);
        navigation.reset({
            index: 0,
            routes: [{ name: 'Customers' }],
        });
    }

    const addAction = async () => {

        if (!name) setErrMsg("Enter name.");
        else if (!phone) setErrMsg("Enter phone number.");
        else if (phone.length > 25) setErrMsg("Phone number too long.");
        else if (isNaN(phone) === true) setErrMsg("Phone number should be numbers.");

        else {
            setErrMsg(null)

            try {

                setIsLoading(true)
                var pitems = await AsyncStorage.getItem('customersList');
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

                        let customersList_ = {
                            "id": newId,
                            "name": name,
                            "phone": phone,
                            "email": email,
                            "address": address,
                            "dateAdded": dateNow
                        };

                        var result = x.filter(w => (w.phone) === phone);

                        if(result.length > 0){
                            setErrMsg("Phone number already exists.")
                        }else{
                            x.push(customersList_) //Add new list to old list in local storage
                            await AsyncStorage.setItem("customersList", JSON.stringify(x)) //JSON.stringify converts JS object to JSON    
                            saved()
                        }

                        

                    }

                    setIsLoading(false)
                    
                } else {
                    await AsyncStorage.setItem('customersList', JSON.stringify(customersList));
                    saved()
                }
             
               
                
            } catch (e) {
                await AsyncStorage.setItem('customersList', JSON.stringify(customersList));
                    saved()
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
                style={STYLES.headerTitleView}
                onPress={() =>  navigation.navigate('Customers')}
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

                <Text style={{ marginLeft: SIZES.padding * 1.5, color: COLORS.white, ...FONTS.h4 }}>Add Customer</Text>
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
                            color: COLORS.secondary,
                            fontWeight: 'bold'
                        }}>Add Customer</Text>
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

export default AddCustomer;