const dateToString = (x) => {
    try {
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var temp_date = x.split("-");
    return temp_date[2] + " " + months[Number(temp_date[1]) - 1] + ", " + temp_date[0];
     
    } catch {
        return null; 
    }
}
    

export default dateToString