var myDate = new Date();

let daysList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


let date = myDate.getDate();
let month = monthsList[myDate.getMonth()];
let year = myDate.getFullYear();
let day = daysList[myDate.getDay()];
let dayNum = myDate.getDate();

let m = myDate.getMonth() + 1;
if(m.length < 2){
    m = "0"+m;
}

let month_ = m;

let today = `${date} ${month} ${year}, ${day}`;

let amOrPm;
let twelveHours = function () {
    if (myDate.getHours() > 12) {
        amOrPm = 'PM';
        let twentyFourHourTime = myDate.getHours();
        let conversion = twentyFourHourTime - 12;
        return `${conversion}`

    } else {
        amOrPm = 'AM';
        return `${myDate.getHours()}`
    }
};
let hours = twelveHours();
let minutes = myDate.getMinutes();

let currentTime = `${hours}:${minutes} ${amOrPm}`;

console.log(today + ' ' + currentTime);

const dateNow = today
const todayDate = `${year}-${month_}-${date}`
const timeNow = currentTime
const thisYear = year
const thisMonth = month_
const todayDay = dayNum
export default {
    dateNow,
    currentTime,
    thisYear,
    todayDay,
    thisMonth,
    todayDate
}