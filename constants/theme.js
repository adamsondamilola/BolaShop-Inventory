import { Dimensions, Platform } from "react-native";
const { width, height } = Dimensions.get("window");

export const COLORS = {
    // base colors
    primary: "#ff4000", // dark orange
    secondary: "#ff8000",   // orange

    green: "#66D59A",
    lightGreen: "#E6FEF0",

    lime: "#ff8000",
    emerald: "#2BC978",

    red: "#FF4134",
    lightRed: "#FFF1F0",

    purple: "#6B3CE9",
    lightpurple: "#F3EFFF",

    yellow: "#FFC664",
    lightyellow: "#FFF9EC",

    black: "#1E1F20",
    white: "#FFFFFF",

    orange: "#FFA500",
    lightOrange: "#FFD68A",

    tealGreen: "#006D5B",
    lightTealGreen: "#81FFEA",

    blueGrotto: "#024376",
    lightBlueGrotto: "#62B8FC",

    lightGray: "#FCFBFC",
    gray: "#C1C3C5",
    darkgray: "#C3C6C7",

    transparent: "transparent",
};

export const SIZES = {
    // global sizes
    base: 8,
    font: 14,
    radius: 30,
    padding: 10,
    padding2: 12,

    // font sizes
    largeTitle: 50,
    h1: 30,
    h2: 22,
    h3: 20,
    h4: 18,
    body1: 30,
    body2: 20,
    body3: 16,
    body4: 14,
    body5: 12,

    // app dimensions
    width,
    height
};

export const FONTS = {
    largeTitle: { fontFamily: "Carlibri", fontSize: SIZES.largeTitle, lineHeight: 55 },
    h1: { fontFamily: "Roboto-Black", fontSize: SIZES.h1, lineHeight: 36 },
    h2: { fontFamily: "Roboto-Black", fontSize: SIZES.h2, lineHeight: 30 },
//    h3: { fontFamily: "Roboto-Bold", fontSize: SIZES.h3, lineHeight: 22 },
    h4: { fontFamily: "Roboto-Black", fontSize: SIZES.h4, lineHeight: 22 },
    body1: { fontFamily: "Roboto-Black", fontSize: SIZES.body1, lineHeight: 36 },
    body2: { fontFamily: "Roboto-Black", fontSize: SIZES.body2, lineHeight: 30 },
    body3: { fontFamily: "Roboto-Black", fontSize: SIZES.body3, lineHeight: 22 },
    body4: { fontFamily: "Roboto-Black", fontSize: SIZES.body4, lineHeight: 22 },
    body5: { fontFamily: "Roboto-Black", fontSize: SIZES.body5, lineHeight: 22 },
};

//const { height } = Dimensions.get("screen")
const height_logo = height * 0.28;
export const STYLES = {
    container: {
        flex: 1,
        backgroundColor: "#ff8000"
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    topBalance: {
        flex: 1,
        color: "#fff",
        backgroundColor: "#ff4000",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderRadius: 20,
        paddingVertical: 50,
        paddingHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
        height: 120
    },
    footer: {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 80,
        paddingHorizontal: 20,

    },
    signupFooter: {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,

    },
    homeBgImage: {
        height: 250,
        width: 202,
        marginTop: 50
    },
    logo: {
        width: 75,
        height: 75,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        tintColor: COLORS.white
    },
    logoTopRight: {
        alignSelf: 'flex-end',
        marginTop: -5,
        position: 'absolute',
        right: 0,
        zIndex: 1,
        top: 50,
        width: 161,
        height: 51
    },
    title: {
        color: "#05375a",
        fontSize: 25,
        fontWeight: "bold"
    },
    text: {
        color: "grey",
        marginTop: 5,
        marginBottom: 1
    },
    button: {
        alignItems: 'flex-end',
        marginTop: 50
    },
    signUp: {
        width: 160,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        flexDirection: 'row'
    },
    signIn: {
        width: 170,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        flexDirection: 'row',
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },
    signInPage: {
        width: "100%",
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row',
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold'
    },
    signUpPage: {
        width: "100%",
        marginTop: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row',
        color: COLORS.secondary,
        fontSize: 20,
        fontWeight: 'bold',
        borderColor: COLORS.secondary,
        borderWidth: 2,
    },
    defaultButton: {
        width: "100%",
        marginTop: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row',
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeBtn: {
        width: 100,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        flexDirection: 'row',
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10
    },
    activateBtn: {
        width: 150,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row',
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10
    },
    aboutBtn: {
        width: 70,
        height: 20,
        marginTop: 20,
        left: -120,
        color: '#fff',
        fontSize: 18
    },
    textSignUp: {
        color: 'white',
        fontWeight: 'bold',
        alignItems: 'center'
    },
    textSign: {
        color: 'white'
    },
    text25: {
        color: 'white',
        fontSize: 25
    },

    text20: {
        color: 'white',
        fontSize: 20,
        padding: 20
    },

    text15: {
        color: 'white',
        fontSize: 15,
        padding: 2
    },

    text16b: {
        color: 'black',
        fontSize: 18,
        padding: 2,
        marginTop: 12,
        marginLeft: 12,
        marginRight: 12
    },

    text25w: {
        color: 'white',
        fontSize: 25,
    },

    textInput: {
        colors: {
            placeholder: COLORS.secondary, text: COLORS.secondary, primary: COLORS.primary,
            underlineColor: COLORS.secondary
        }

    },
    loader: {
        height: 25,
        width: 25,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center'
    },
    alignRight: {
        flexDirection: 'row', 
        alignItems: 'flex-end', 
        justifyContent: 'flex-end'
    },
    alignLeft: {
        flexDirection: 'row', 
        alignItems: 'flex-start', 
        justifyContent: 'flex-start'
    },
    qrcode_style: {
        centerText: {
            flex: 1,
            fontSize: 18,
            padding: 32,
            color: '#777'
        },
        textBold: {
            fontWeight: '500',
            color: '#000'
        },
        buttonText: {
            fontSize: 21,
            color: 'rgb(0,122,255)'
        },
        buttonTouchable: {
            padding: 16
        }
    },
    headerTitleView: {
        flexDirection: 'row',
        alignItems: "center",
        marginTop: SIZES.padding * 6,
        marginBottom: 10,
        paddingHorizontal: SIZES.padding * 2
    }

};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;