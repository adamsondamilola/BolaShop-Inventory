const number_format = (x) => {
    try {
        if (x == '' || x == null) x = 0;
        if (isNaN(x) === true) x = 0;
            return x.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
         
    } catch {
        return 0;
    }
}
export default  number_format