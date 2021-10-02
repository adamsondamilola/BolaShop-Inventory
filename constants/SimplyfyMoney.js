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

    return x + keyType;

}

export default {

    simplyfyNumber(x)

}