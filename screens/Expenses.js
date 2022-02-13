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
import dateToString from "../constants/dateToString";
import DatePicker from "react-native-datepicker";
import dateTime from "../constants/dateTime";

const Expenses = ({ navigation }) => {

    const [productData, setProductData] = useState([])
    const [expensesList, setExpensesList] = useState([])

    const [showPassword, setShowPassword] = React.useState(false)

    const [areas, setAreas] = React.useState([])
    const [selectedArea, setSelectedArea] = React.useState(null)
    const [modalVisible, setModalVisible] = React.useState(false)

    let errMessage = null;
    const [errMsg, setErrMsg] = React.useState(null);

    const [shopName, setShopName] = useState(null);
    const [currencySymbol, setCurrencySymbol] = useState(null);
    const [shopSettings, setShopSettings] = useState([])

    const [fromDate, setFromDate] = useState(dateTime.todayDate)
    const [toDate, setToDate] = useState(dateTime.todayDate);
    const [totalAmount, setTotalAmount] = useState(0);

    const [productsCount, setProductsCount] = useState(0)

    var today = new Date();
    var thisYear = today.getFullYear()
    var nextYear = today.getFullYear() + 1
    var thisMonth = today.getMonth() + 1

    const [isLoading, setIsLoading] = useState(false);

    const title = "Expenses"

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

    const fromDatePicker = () =>{
        return (
           
            <DatePicker
              style={{width: 100, flex: 1}}
              date={fromDate}
              mode="date"
              placeholder="select date"
              format="YYYY-MM-DD"
              maxDate={dateTime.todayDate}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36,
                  color: COLORS.secondary,
                },
                dateText:{
                    color: COLORS.secondary,
                },
                datePickerCon:{
                    color: COLORS.secondary
                }
              }}
              onDateChange={(date) => {setFromDate(date)}}
            />
          )
    }

    const toDatePicker = () =>{
        return (
           
            <DatePicker
              style={{width: 100, flex: 1}}
              date={toDate}
              mode="date"
              placeholder="select date"
              format="YYYY-MM-DD"
              maxDate={dateTime.todayDate}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36,
                  color: COLORS.secondary,
                },
                dateText:{
                    color: COLORS.secondary,
                },
                datePickerCon:{
                    color: COLORS.secondary
                }
              }}
              onDateChange={(date) => {setToDate(date)}}
            />
          )
    }
    
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
            <Text style={{ flex: 1,marginTop: 50, marginLeft: SIZES.padding * 1.5, color: COLORS.white, ...FONTS.h2 }}>{number_format(totalAmount)} {currencySymbol}</Text>
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
                routes: [{ name: 'ViewExpenses', params: { lastroute: 'Expenses' } }],
            })

        } catch (error) {
            setErrMsg("Failed. Please try again. " + error)
            setIsLoading(false)
            setModalVisible(true)
        }

    }

    const getExpensesList = async () => {

        setIsLoading(true)

        try {

            var pitems = await AsyncStorage.getItem('expensesList');

            if (pitems) {

                var x = JSON.parse(pitems)

                setProductData(x)

                let counter = 0

                setExpensesList(x.sort((a, b) => b.id - a.id).slice(0, 100)) //Ascending order by quantity/i stock

                for (let i = 0; i < productData.length; i++) {
                    if (productData[i].id === 0) counter++;
                }
                setProductsCount(counter)

                let total_amount = 0
                for (let y of x) {
                    if (parseFloat(y.amount) > 0) {
                        total_amount += parseFloat(y.amount)
                        setTotalAmount(total_amount)
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

    const filterExpensesList = async (from, to) => {
        
        setIsLoading(true)
       
        try {
            
            from = from.toString().replace(/-/g, "");
            from = from.replace(/0/g, "");
        from = parseFloat(from);
        
        to = to.toString().replace(/-/g, "");
        to = to.replace(/0/g, "");
        to = parseFloat(to);
     
            var pitems = await AsyncStorage.getItem('expensesList');

            if (pitems) {

                var x = JSON.parse(pitems)

                setProductData(x)

                let counter = 0

                var result = x.filter(w => parseInt(w.dateAdded.toString().replace(/-/g, "").replace(/0/g, "")) >= from && parseInt(w.dateAdded.toString().replace(/-/g, "").replace(/0/g, "")) <= to)
               

                if(from > to){
                    alert("Start Date should be less than End Date")
                }

                if(result.length > 0){
                    
                    setExpensesList(result.sort((a, b) => b.id - a.id).slice(0, 100)) 

                    for (let i = 0; i < productData.length; i++) {
                        if (productData[i].id === 0) counter++;
                    }    
                    setProductsCount(counter)

                let total_amount = 0
                for (let y of result) {
                    if (parseFloat(y.amount) > 0) {
                        total_amount += parseFloat(y.amount)
                        setTotalAmount(total_amount)
                    }
                }
    
                    setIsLoading(false)
                }else{
                    alert("No record found!")
                }

                
            }


        } catch (e) {
            console.log(e)
            setErrMsg(null)
            setIsLoading(false)

        }
        setIsLoading(false);
        
    }

    useEffect(() => {
       
        getExpensesList()

    },[])

    function renderProducts() {

        const renderItem = ({ item }) => (
            <TouchableOpacity
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
                         {item.title}</Text>
                        <Text style={{flex: 1, textAlign: 'right', fontSize: 18, color: COLORS.secondary }}> {number_format(item.amount)} {currencySymbol} </Text>
                    
                        </View>
<View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    <Text style={{ flex: 1, color: COLORS.emerald }} > {dateToString(item.dateAdded)}</Text>
                        
<TouchableOpacity
style={{backgroundColor: COLORS.secondary, color: COLORS.white,borderRadius: 5, width: 50,
    alignItems: 'center'}}
onPress={() => actionsButton(item.id)}>
<Text style={{ flex: 1, color: COLORS.white }} >Details </Text>

</TouchableOpacity>
    

                    </View>
                </View>


            </TouchableOpacity>
        )

        return (
            <FlatList
                data={expensesList}
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
                         navigation.navigate('AddExpenses')
                    }
                >
                    <LinearGradient
                        colors={["transparent", "transparent"]}
                        style={STYLES.signUpPage}
                    >
                        <Text style={{
                            color: COLORS.secondary,
                            fontWeight: 'bold'
                        }}>Add Expenses</Text>
                    </LinearGradient>

                </TouchableOpacity>

                <View
                    style={{
                        height: 100,
                        width: '100%',
                        borderRadius: 10,
                        justifyContent: 'center',
                        backgroundColor: COLORS.lightGray
                    }}
                >
<View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{flex: 1, fontSize: 15, color: COLORS.secondary }}>
                         From</Text>
                        <Text style={{flex: 1, textAlign: 'right', fontSize: 15, color: COLORS.secondary }}> To </Text>                    
                        </View>
<View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    {fromDatePicker()}
                        
                    {toDatePicker()}    

                    </View>
                    <TouchableOpacity
                    style={{
                        marginTop:5,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={() => 
                        filterExpensesList(fromDate, toDate)
                    }
                >
                    <LinearGradient
                        colors={["transparent", "transparent"]}
                        style={{borderRadius: 5,
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 25, width:'100%', 
                            borderColor: COLORS.secondary, 
                            borderWidth:1}}
                    >
                        <Text style={{
                            color: COLORS.secondary,
                            fontWeight: 'bold'
                        }}>Search</Text>
                    </LinearGradient>

                </TouchableOpacity>
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

export default Expenses;