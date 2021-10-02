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
import { List, Divider } from 'react-native-paper';

import { COLORS, SIZES, FONTS, icons, images } from "../constants"
import { STYLES } from "../constants/theme";

import AsyncStorage from '@react-native-async-storage/async-storage'

const Help = ({ navigation }) => {

    const [showPassword, setShowPassword] = React.useState(false)

    const [areas, setAreas] = React.useState([])
    const [selectedArea, setSelectedArea] = React.useState(null)
    const [modalVisible, setModalVisible] = React.useState(false)

    let errMessage = null;
    const [errMsg, setErrMsg] = React.useState(null);

    const [shopName, setShopName] = useState(null);
    const [currencySymbol, setCurrencySymbol] = useState(null);
    const [shopSettings, setShopSettings] = useState([])

    const [expanded, setExpanded] = React.useState(true);

    const handlePress = () => setExpanded(!expanded);

    let faqList = [{
        "id": 1,
        "title": "What is BS?",
        "content": "BS stands for BolaStore. Its a mobile application for managing small and medium businesses. It keeps record of sales and products price."
    },
        {
            "id": 2,
            "title": "Currency Symbol",
            "content": "This will be used as default currency symbol. An example is EUR which is the symbol of Euro, NGN for Naira, USD for United States Dollar"
        },
        {
            "id": 3,
            "title": "Shop Name",
            "content": "Name of company or business. Special characters are allowed"
        },
        {
            "id": 4,
            "title": "Add New Product",
            "content": "To add new product, click the Add or plus button. Scan product, if product already exists, it will redirect to view."
        },
        {
            "id": 5,
            "title": "Add New Sales",
            "content": "Click the green middle button at the bottom and scan product. If scanned, the product name and a input box for entering the number of units to be purchased will appear. Click Check Out when you are done adding products, then click Proceed to complete order. "
        },
        {
            "id": 6,
            "title": "Code Not Scanning",
            "content": "Some bar or QR codes are fake or just an empty image. Only a bar or QR code with a code can be scanned"
        },
        
        {
            "id": 7,
            "title": "Decision Making",
            "content": "BS keeps records for decision making"
        },
        {
            "id": 8,
            "title": "Contact Developer",
            "content": "adamsondamilola@gmail.com"
        },
    ];




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

                <Text style={{ marginLeft: SIZES.padding * 1.5, color: COLORS.white, ...FONTS.h4 }}>Back</Text>
            </TouchableOpacity>
        )
    }

    function renderLogo() {
        return (
            <View
                style={{
                    marginTop: SIZES.padding * 5,
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

                <FlatList
                    data={faqList}
                    renderItem={({ item }) =>
                        <TouchableOpacity>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1, height: 1, backgroundColor: COLORS.emerald }} />
                                <View>
                                    <Text style={{ width: 180, textAlign: 'center', fontSize: 18, color: COLORS.primary }}> {item.title} </Text>
                                </View>
                                <View style={{ flex: 1, height: 1, backgroundColor: COLORS.emerald }} />
                            </View>
                            <Text style={{
                                marginBottom: 20,
                                color: COLORS.black,
                                fontSize: 15
                            }}>{item.content}</Text>
                        </TouchableOpacity>

                    }
      />

                
                

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
                    onPress={errMsg == null ? () => navigation.navigate("Dashboard") : () => setModalVisible(false)}
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
                                    Settings for {shopName} has been saved!
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
                        style={{ marginBottom: 50 }}
                    >
                        {renderBody()}
                    </ScrollView>
                </SafeAreaView>

            </LinearGradient>
            {renderAreaCodesModal()}
        </KeyboardAvoidingView>
    )
}

export default Help;