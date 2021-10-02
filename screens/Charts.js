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
    Platform,
    Dimensions
} from "react-native"
import { LinearGradient } from 'expo-linear-gradient'
import { TextInput, Menu, Button, Divider, List, Text } from 'react-native-paper';

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";

import { COLORS, SIZES, FONTS, icons, images } from "../constants"
import { STYLES } from "../constants/theme";

import AsyncStorage from '@react-native-async-storage/async-storage'
import dateTime from "../constants/dateTime";

const Charts = ({ route, navigation }) => {

    const [showPassword, setShowPassword] = React.useState(false)

    const [areas, setAreas] = useState([])
    const [selectedArea, setSelectedArea] = React.useState(null)
    const [modalVisible, setModalVisible] = React.useState(false)

    let errMessage = null;
    const [errMsg, setErrMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [shopName, setShopName] = useState(null);
    const [currencySymbol, setCurrencySymbol] = useState(null);
    const [shopSettings, setShopSettings] = useState([])

    const [visible, setVisible] = useState(false);

    const [quarterTotal, setQuarterTotal] = useState(0)

    const [yearInput, setYearInput] = useState((dateTime.thisYear).toString())
    const [quarterInput, setQuarterInput] = useState(1)

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);

    const [productList, setProductList] = useState([])
    //const { itemId, otherParam } = route.params;

    const [labels, setLabels] = useState(['Jan', 'Feb', 'Mar'])
    const [dataSets, setDataSets] = useState([0,0,0])

    const [pieChartData, setPieChartData] = useState([{
        name: "Jan",
        population: 0,
        color: "rgba(131, 167, 234, 1)",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
    },
        {
            name: "Mar",
            population: 0,
            color: "rgba(131, 167, 234, 1)",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Feb",
            population: 0,
            color: "rgba(131, 167, 234, 1)",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        }    ])
 
    const title = "Charts"

    const number_format = (x) => {
        if (x == '' || x == null) x = 0;
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const dateNumberFormat = (x) => {
        x = x.toString()
        x = x.trim()
        if (x && x.length < 2) {
            x = "0" + x
            return x;
        } else {
            return x;
        } 
    }

    const getParcentage = (value, total) => {
        if (value && parseInt(value) > 0 && parseInt(total) > 0) {
            let x = ((parseInt(value) * 100))
            x = x / parseInt(total)
            return x
        }
        else {
            return 0
        }
        
    }

    let sampleData = [
        {
            "id": 1,
            "total_amount": "1000",
            "total_selling_amount": "900",
            "profit": "100",
            "items": 2,
            "products": 2,
            "dateAdded": "21 Sep 2021"
        },
        {
            "id": 2,
            "total_amount": "1000",
            "total_selling_amount": "0",
            "profit": "100",
            "items": 2,
            "products": 2,
            "dateAdded": "22 Sep 2021"
        },
        {
            "id": 3,
            "total_amount": "1000",
            "total_selling_amount": "0",
            "profit": "100",
            "items": 2,
            "products": 2,
            "dateAdded": "23 Sep 2021"
        },
        {
            "id": 4,
            "total_amount": "1000",
            "total_selling_amount": "100000",
            "profit": "100",
            "items": 2,
            "products": 2,
            "dateAdded": "21 Sep 2021"
        },
        {
            "id": 5,
            "total_amount": "1000",
            "total_selling_amount": "2000000",
            "profit": "100",
            "items": 2,
            "products": 2,
            "dateAdded": "21 Aug 2021"
        },
        {
            "id": 6,
            "total_amount": "1000",
            "total_selling_amount": "1000200",
            "profit": "100",
            "items": 2,
            "products": 2,
            "dateAdded": "21 Aug 2021"
        },
        {
            "id": 7,
            "total_amount": "1000",
            "total_selling_amount": "102300",
            "profit": "100",
            "items": 2,
            "products": 2,
            "dateAdded": "21 Aug 2021"
        },
        {
            "id": 8,
            "total_amount": "1000",
            "total_selling_amount": "1000",
            "profit": "100",
            "items": 2,
            "products": 2,
            "dateAdded": "24 Aug 2021"
        },
        {
            "id": 9,
            "total_amount": "1000",
            "total_selling_amount": "134000",
            "profit": "100",
            "items": 2,
            "products": 2,
            "dateAdded": "21 Jul 2021"
        },
        {
            "id": 10,
            "total_amount": "1000",
            "total_selling_amount": "1000",
            "profit": "100",
            "items": 2,
            "products": 2,
            "dateAdded": "30 Jun 2021"
        },
        {
            "id": 11,
            "total_amount": "1000",
            "total_selling_amount": "1032300",
            "profit": "100",
            "items": 2,
            "products": 2,
            "dateAdded": "28 Jun 2021"
        },
        {
            "id": 12,
            "total_amount": "1000",
            "total_selling_amount": "231000",
            "profit": "100",
            "items": 2,
            "products": 2,
            "dateAdded": "1 May 2021"
        },
        {
            "id": 13,
            "total_amount": "1000",
            "total_selling_amount": "1000",
            "profit": "100",
            "items": 2,
            "products": 2,
            "dateAdded": "11 May 2021"
        },
        {
            "id": 14,
            "total_amount": "1000",
            "total_selling_amount": "3431000",
            "profit": "100",
            "items": 2,
            "products": 2,
            "dateAdded": "21 May 2021"
        },
        {
            "id": 15,
            "total_amount": "1000",
            "total_selling_amount": "561000",
            "profit": "100",
            "items": 2,
            "products": 2,
            "dateAdded": "2 Apr 2021"
        },
        {
            "id": 16,
            "total_amount": "1000",
            "total_selling_amount": "1000",
            "profit": "100",
            "items": 2,
            "products": 2,
            "dateAdded": "2 Apr 2021"
        },
        {
            "id": 18,
            "total_amount": "1000",
            "total_selling_amount": "0",
            "profit": "100",
            "items": 2,
            "products": 2,
            "dateAdded": "1 Jan 2021"
        },
        {
            "id": 19,
            "total_amount": "1000",
            "total_selling_amount": "900",
            "profit": "100",
            "items": 2,
            "products": 2,
            "dateAdded": "1 Feb 2021"
        },
        {
            "id": 20,
            "total_amount": "1000",
            "total_selling_amount": "0",
            "profit": "100",
            "items": 2,
            "products": 2,
            "dateAdded": "1 Feb 2021"
        }
    ]

    const simplyfyNumber = (x) => {

        let keyType = '';

        if (!x) x = 0

        else if (parseInt(x) < 1) x = 0

        else if (isNaN(x) === true) x = 0

        else {
            if (x.length < 4) {
                x = x
            }
            else if (x.length > 3 && x.length <= 6) {
                x = x / 1000
                keyType = 'K'
            }
            else if (x.length > 6 && x.length <= 9) {
                x = x / 1000000
                keyType = 'M'
            }
            else if (x.length > 9 && x.length <= 12) {
                x = x / 1000000000
                keyType = 'B'
            }
            else if (x.length > 12 && x.length <= 15) {
                x = x / 1000000000000
                keyType = 'T'
            }
        }

        return x;

    }


    const yearChart = async (year, quarter) => {

        year = year.toString()

        setQuarterInput(quarter)

        if (year === '' || year === null) {
            year = (dateTime.thisYear).toString()
        }

        setIsLoading(true)

        try {

            var pitems = await AsyncStorage.getItem('productCarts');
            //var pitems = sampleData
            
            //pitems = JSON.stringify(pitems) //use parse for asyncstorage
            if (pitems) {
                //alert("ss")

                pitems = JSON.parse(pitems)

                let amt1 = 0
                let amt2 = 0
                let amt3 = 0

                //First quarter
                if (quarter === 1) {

                    let janResult = pitems.filter(w => (w.dateAdded).substring(7, 11) === year && (w.dateAdded).substring(3, 6) === 'Jan')
                    if (janResult.length < 1) janResult = pitems.filter(w => (w.dateAdded).substring(6, 10) === year && (w.dateAdded).substring(2, 5) === 'Jan')
                    var ja = janResult

                    for (let xja of ja) {

                        if (parseInt(xja.total_selling_amount) > 0) {
                            amt1 += parseInt(xja.total_selling_amount)
                        }
                        
                    }
                    

                    let febResult = pitems.filter(x => (x.dateAdded).substring(7, 11) === year && (x.dateAdded).substring(3, 6) === 'Feb')
                    if (febResult.length < 1) febResult = pitems.filter(x => (x.dateAdded).substring(6, 10) === year && (x.dateAdded).substring(2, 5) === 'Feb')
                    var fe = febResult

                    for (let xfe of fe) {

                        if (parseInt(xfe.total_selling_amount) > 0) {
                            amt2 += parseInt(xfe.total_selling_amount)
                        }
                    }
                    

                    let marResult = pitems.filter(y => (y.dateAdded).substring(7, 11) === year && (y.dateAdded).substring(3, 6) === 'Mar')
                    if (marResult.length < 1) marResult = pitems.filter(y => (y.dateAdded).substring(6, 10) === year && (y.dateAdded).substring(2, 5) === 'Mar')
                    var ma = marResult

                    for (let xma of ma) {

                        if (parseInt(xma.total_selling_amount) > 0) {
                            amt3 += parseInt(xma.total_selling_amount)
                        }
                        
                    }
                    

                    var total = amt1 + amt2 + amt3
                    setQuarterTotal(total)

                    setLabels(["Jan", "Feb", "Mar"])

                    amt1 = getParcentage(amt1, total)
                    amt2 = getParcentage(amt2, total)
                    amt3 = getParcentage(amt3, total)

                    if (isNaN(amt1) === false && isNaN(amt2) === false && isNaN(amt3) === false) setDataSets([amt1, amt2, amt3])

                    setPieChartData([{
                        name: "Jan",
                        population: quarterTotal,
                        color: "rgba(131, 167, 234, 1)",
                        legendFontColor: "#7F7F7F",
                        legendFontSize: 15
                    },
                    {
                        name: "Mar",
                        population: quarterTotal,
                        color: "rgba(131, 167, 234, 1)",
                        legendFontColor: "#7F7F7F",
                        legendFontSize: 15
                    },
                    {
                        name: "Feb",
                        population: quarterTotal,
                        color: "rgba(131, 167, 234, 1)",
                        legendFontColor: "#7F7F7F",
                        legendFontSize: 15
                    }])

                }

                //Second Quarter
                else if (quarter === 2) {

                    let aprResult = pitems.filter(w => (w.dateAdded).substring(7, 11) === year && (w.dateAdded).substring(3, 6) === 'Apr')
                    if (aprResult.length < 1) aprResult = pitems.filter(w => (w.dateAdded).substring(6, 10) === year && (w.dateAdded).substring(2, 5) === 'Apr')
                    var ap = aprResult

                    for (let xap of ap) {

                        if (parseInt(xap.total_selling_amount) > 0) {
                            amt1 += parseInt(xap.total_selling_amount)
                        }
                        
                    }
                    

                    let mayResult = pitems.filter(x => (x.dateAdded).substring(7, 11) === year && (x.dateAdded).substring(3, 6) === 'May')
                    if (mayResult.length < 1) mayResult = pitems.filter(x => (x.dateAdded).substring(6, 10) === year && (x.dateAdded).substring(2, 5) === 'May')
                    var my = mayResult

                    for (let xmy of my) {

                        if (parseInt(xmy.total_selling_amount) > 0) {
                            amt2 += parseInt(xmy.total_selling_amount)
                        }
                    }
                    

                    let junResult = pitems.filter(y => (y.dateAdded).substring(7, 11) === year && (y.dateAdded).substring(3, 6) === 'Jun')
                    if (junResult.length < 1) junResult = pitems.filter(y => (y.dateAdded).substring(6, 10) === year && (y.dateAdded).substring(2, 5) === 'Jun')
                    var ju = junResult

                    for (let xju of ju) {

                        if (parseInt(xju.total_selling_amount) > 0) {
                            amt3 += parseInt(xju.total_selling_amount)
                        }
                        
                    }
                    

                    setLabels(["Apr", "May", "Jun"])

                    var total = amt1 + amt2 + amt3
                    setQuarterTotal(total)

                    amt1 = getParcentage(amt1, total)
                    amt2 = getParcentage(amt2, total)
                    amt3 = getParcentage(amt3, total)

                    if (isNaN(amt1) === false && isNaN(amt2) === false && isNaN(amt3) === false) setDataSets([amt1, amt2, amt3])
                }


                //3rd Quarter
                else if(quarter === 3) {

                    let julResult = pitems.filter(w => (w.dateAdded).substring(7, 11) === year && (w.dateAdded).substring(3, 6) === 'Jul')
                    if (julResult.length < 1) julResult = pitems.filter(w => (w.dateAdded).substring(6, 10) === year && (w.dateAdded).substring(2, 5) === 'Jul')
                    var jl = julResult

                    for (let xjl of jl) {

                        if (parseInt(xjl.total_selling_amount) > 0) {
                            amt1 += parseInt(xjl.total_selling_amount)
                        }

                    }
                    

                    let augResult = pitems.filter(x => (x.dateAdded).substring(7, 11) === year && (x.dateAdded).substring(3, 6) === 'Aug')
                    if (augResult.length < 1) augResult = pitems.filter(x => (x.dateAdded).substring(6, 10) === year && (x.dateAdded).substring(2, 5) === 'Aug')
                    var ag = augResult

                    for (let xag of ag) {

                        if (parseInt(xag.total_selling_amount) > 0) {
                            amt2 += parseInt(xag.total_selling_amount)
                        }
                    }
                    

                    let sepResult = pitems.filter(y => (y.dateAdded).substring(7, 11) === year && (y.dateAdded).substring(3, 6) === 'Sep')
                    if (sepResult.length < 1) sepResult = pitems.filter(y => (y.dateAdded).substring(6, 10) === year && (y.dateAdded).substring(2, 5) === 'Sep')
                    var sp = sepResult

                    for (let xsp of sp) {

                        if (parseInt(xsp.total_selling_amount) > 0) {
                            amt3 += parseInt(xsp.total_selling_amount)
                        }

                    }

                    

                    setLabels(["Jul", "Aug", "Sep"])

                    var total = amt1 + amt2 + amt3
                    setQuarterTotal(total)

                    amt1 = getParcentage(amt1, total)
                    amt2 = getParcentage(amt2, total)
                    amt3 = getParcentage(amt3, total)
                    if (isNaN(amt1) === false && isNaN(amt2) === false && isNaN(amt3) === false) setDataSets([amt1, amt2, amt3])

                    
                }


                //4th Quarter
                else if (quarter === 4) {

                    let octResult = pitems.filter(w => (w.dateAdded).substring(7, 11) === year && (w.dateAdded).substring(3, 6) === 'Oct')
                    if (octResult.length < 1) octResult = pitems.filter(w => (w.dateAdded).substring(6, 10) === year && (w.dateAdded).substring(2, 5) === 'Oct')
                    var oc = octResult

                    for (let xoc of oc) {

                        if (parseInt(xoc.total_selling_amount) > 0) {
                            amt1 += parseInt(xoc.total_selling_amount)
                        }

                    }
                    

                    let novResult = pitems.filter(x => (x.dateAdded).substring(7, 11) === year && (x.dateAdded).substring(3, 6) === 'Nov')
                    if (novResult < 1) novResult = pitems.filter(x => (x.dateAdded).substring(8, 10) === year && (x.dateAdded).substring(2, 5) === 'Nov')
                    var nv = novResult

                    for (let xnv of nv) {

                        if (parseInt(xnv.total_selling_amount) > 0) {
                            amt2 += parseInt(xnv.total_selling_amount)
                        }
                    }
                    

                    let decResult = pitems.filter(y => (y.dateAdded).substring(7, 11) === year && (y.dateAdded).substring(3, 6) === 'Dec')
                    if (decResult.length < 1) decResult = pitems.filter(y => (y.dateAdded).substring(6, 10) === year && (y.dateAdded).substring(2, 5) === 'Dec')
                    var dc = decResult

                    for (let xdc of dc) {

                        if (parseInt(xdc.total_selling_amount) > 0) {
                            amt3 += parseInt(xdc.total_selling_amount)
                        }

                    }

                    

                    setLabels(["Oct", "Nov", "Dec"])

                    var total = amt1 + amt2 + amt3
                    setQuarterTotal(total)

                    amt1 = getParcentage(amt1, total)
                    amt2 = getParcentage(amt2, total)
                    amt3 = getParcentage(amt3, total)

                    if (isNaN(amt1) === false && isNaN(amt2) === false && isNaN(amt3) === false) setDataSets([amt1, amt2, amt3])
                }


            }


        } catch (e) {
            console.log(e)
            setErrMsg(null)
        }

        setIsLoading(false)

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
                        routes: [{ name: 'Settings' }],
                    })
                }
            });
        } catch (e) {
            console.log(e)
        }
    }


    useEffect(() => {

        getSettings()

        yearChart(dateTime.thisYear, 1)
    }, [])

    function chart1() {
        return (
            <View style={{ alignItems: 'center' }}>
                <Text>Sales Line Chart</Text>
                <LineChart
                    data={{
                        labels: labels,
                        datasets: [{ data: dataSets}]
                    }}
                    //width={Dimensions.get("window").width} // from react-native
                    width={320}
                    height={220}
                    yAxisLabel=""
                    yAxisSuffix="%"
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726",
                            
                        }
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />

                <View>
                    <Text style={{ textAlign: 'left', fontSize: 18, color: COLORS.secondary }}> {number_format(quarterTotal)} {currencySymbol} </Text>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 10 }}>

                    <TextInput
                        returnKeyType="search"
                        keyboardType="number-pad"
                        value={yearInput}
                        onChangeText={text => setYearInput(text)}
                        onSubmitEditing={() => yearChart(yearInput, quarterInput)}
                        label='Enter Year'
                        mode='outlined'
                        theme={STYLES.textInput}
                        style={{ width: 200, height: 45, padding: 5 }}
                        maxLength={4}
                    />

                </View>

                <View style={{ flexDirection: 'row', marginTop: 5}}>

                    <TouchableOpacity
                        style={{
                            alignSelf: 'flex-start', width: 50
                        }}
                        onPress={() => { yearChart(yearInput, 1) }}
                    >
                        <LinearGradient
                            colors={quarterInput !== 1 ? [COLORS.secondary, COLORS.secondary] : [COLORS.green, COLORS.emerald]}
                            style={STYLES.defaultButton}


                        >
                            <Text style={{
                                color: '#fff',
                                fontWeight: 'bold'
                            }}>Q1 </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            alignSelf: 'flex-start', width: 50, marginLeft: 5
                        }}
                        onPress={() => { yearChart(yearInput, 2) }}
                    >
                        <LinearGradient
                            colors={quarterInput !== 2 ? [COLORS.secondary, COLORS.secondary] : [COLORS.green, COLORS.emerald]}
                            style={STYLES.defaultButton}


                        >
                            <Text style={{
                                color: '#fff',
                                fontWeight: 'bold'
                            }}>Q2 </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            alignSelf: 'flex-start', width: 50, marginLeft: 5
                        }}
                        onPress={() => { yearChart(yearInput, 3) }}
                    >
                        <LinearGradient
                            colors={quarterInput !== 3 ? [COLORS.secondary, COLORS.secondary] : [COLORS.green, COLORS.emerald]}
                            style={STYLES.defaultButton}


                        >
                            <Text style={{
                                color: '#fff',
                                fontWeight: 'bold'
                            }}>Q3 </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            alignSelf: 'flex-start', width: 50, marginLeft: 5
                        }}
                        onPress={() => { yearChart(yearInput, 4) }}
                    >
                        <LinearGradient
                            colors={quarterInput !== 4 ? [COLORS.secondary, COLORS.secondary] : [COLORS.green, COLORS.emerald]}
                            style={STYLES.defaultButton}


                        >
                            <Text style={{
                                color: '#fff',
                                fontWeight: 'bold'
                            }}>Q4 </Text>
                        </LinearGradient>
                    </TouchableOpacity>


                </View>

            </View>
            )
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
                    //  setProductName(null)
                    //navigation.navigate('ViewProduct')
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Dashboard', params: { lastroute: 'Dashboard' } }],
                    });

                }}
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

                <Text style={{ marginLeft: SIZES.padding * 1.5, color: COLORS.white, ...FONTS.h4 }}>{ title}</Text>
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

                            {errMsg == null ?
                                <Text style={{ marginLeft: 30, textAlign: "center", marginTop: 30, marginRight: 30, fontSize: 15, color: "#FFFFFF" }}>
                                    Product saved! { }
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

                        {chart1()}




                    </ScrollView>
                </SafeAreaView>

            </LinearGradient>
            {renderAreaCodesModal()}
        </KeyboardAvoidingView>
    )
}

export default Charts;