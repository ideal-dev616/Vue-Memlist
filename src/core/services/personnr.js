export class Personnummer {
    constructor() {
        this.success = false;
        this.valid = false;
        this.sex = 'U';
        this.year = '0000';
        this.month = '00';
        this.day = '00';
        this.last = '0000'; 
        this.formatted = '00000000-0000';
    }
};

export const validatePersonnr = personnr => {
    return validate_pers_number(personnr);
};

export default validatePersonnr;

function validate_pers_number(pers_number) {
    if (pers_number === undefined || pers_number === null || pers_number.length < 5) {
        const ret = new Personnummer();
        ret.valid = false;
        ret.success = false;
        return ret;
    }

    const test = parse_pers_number(pers_number);

    const current_year = new Date().getFullYear().toString(10);

    const result = new Personnummer();

    if (!test.success) {
        return result;
    }

    if (test.year > current_year || test.year < '1900') {
        return result;
    }

    const ts = Date.parse(test.year + '-' + test.month + '-' + test.day);

    if (isNaN(ts)) {
        return result;
    }

    let ssn_test = false;

    if (test.last.substr(0,1) === 'T') {
        ssn_test = true;
    }
    else {
        ssn_test = luhn_check(test.year+test.month+test.day+test.last);
    }

    if (test.last === '0000') {
        ssn_test = false;
    }
    
    let sex = 'U';

    if (ssn_test) {
        if ('0,2,4,6,8'.indexOf(test.last.substr(2,1)) !== -1) {
            sex = 'F';
        }
        else {
            sex = 'M';
        }
    }

    result.day = test.day;
    result.formatted = test.year + test.month + test.day + '-' + test.last;
    result.month = test.month;
    result.success = true;
    result.valid = ssn_test;
    result.last = test.last;
    result.sex = sex;
    result.year = test.year;

    return result;
}

function luhn_check(sPNum) {
    const numbers = sPNum.match(/^(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)$/);
    let checkSum = 0;

    if (numbers === null) { return false; }

    let n;
    
    for (let i = 3; i <= 12; i++)
    {
        n = parseInt(numbers[i]);
        if (i % 2 === 0) {
            checkSum += n;
        } else {
            checkSum += (n*2) % 9 + Math.floor(n/9) * 9;
        }
    }

    if (checkSum % 10 === 0 ) { return true;}
    
    return false;
}


function parse_pers_number(pers_number_string) {
    if (pers_number_string === null || pers_number_string.length < 5) {
        return { success: false, year: '', month: '', day: '', last: '' };
    }

    let pers_number = '';

    for (let i = 0; i < pers_number_string.length; ++i) {
        const c = pers_number_string.substr(i, 1);

        if ('0123456789'.indexOf(c) !== -1) {
            pers_number += c;
        }
    }

    const current_year = new Date().getFullYear()+'';
    const current_year_two_digits = current_year.substr(2,2);

    if (pers_number.length === '198507091414'.length) { //12
        return { success: true, year: pers_number.substr(0,4), month: pers_number.substr(4,2), day: pers_number.substr(6,2), last: pers_number.substr(8,4) };
    }
    else if (pers_number.length === '19850709'.length) { //8
        return { success: true, year: pers_number.substr(0,4), month: pers_number.substr(4,2), day: pers_number.substr(6,2), last: '0000' };
    }
    else if (pers_number.length === '8507091414'.length) { //10
        const shortyear = pers_number.substr(0,2);
        if (shortyear >= current_year_two_digits) {
            return { success: true, year: '19'+shortyear, month: pers_number.substr(2,2), day: pers_number.substr(4,2), last: pers_number.substr(6,4) };
        }
        return { success: true, year: '20'+shortyear, month: pers_number.substr(2,2), day: pers_number.substr(4,2), last: pers_number.substr(6,4) };
    }
    else if (pers_number.length === '850709'.length) { //6
        const shortyear = pers_number.substr(0,2);
        if (shortyear >= current_year_two_digits) {
            return { success: true, year: '19'+shortyear, month: pers_number.substr(2,2), day: pers_number.substr(4,2), last: '0000' };
        }
        return { success: true, year: '20'+shortyear, month: pers_number.substr(2,2), day: pers_number.substr(4,2), last: '0000' };
    }
    
    // if everything else fail, try the classic parsing

    if (parseInt(pers_number.substr(2, 2), 10) > 12) {
        // its a year as first 4

        if (pers_number.length === 12) { //192003211414
            return { success: true, year: pers_number.substr(0,4), month: pers_number.substr(4,2), day: pers_number.substr(6,2), last: pers_number.substr(8,4) };
        }
        else if (pers_number.length >= 8) { // 19200321...
            return { success: true, year: pers_number.substr(0,4), month: pers_number.substr(4,2), day: pers_number.substr(6,2), last: '0000' };
        }
    }

    if (pers_number.substr(0,2) === '19') {
        if (parseInt(pers_number.substr(2, 2), 10) > 12) { // 1920
            
            if (pers_number.length === 12) { //192003211414
                return { success: true, year: pers_number.substr(0,4), month: pers_number.substr(4,2), day: pers_number.substr(6,2), last: pers_number.substr(8,4) };
            }
            else if (pers_number.length >= 8) { // 19200321...
                return { success: true, year: pers_number.substr(0,4), month: pers_number.substr(4,2), day: pers_number.substr(6,2), last: '0000' };
            }
            else if (pers_number.length < 8) { // 190101...
                return { success: true, year: '20' + pers_number.substr(0,2), month: pers_number.substr(2,2), day: pers_number.substr(4,2), last: '0000' };
            }
        }
        else { // 1901, assume 2019
            if (pers_number.length === 10) { //1902021414
                return { success: true, year: '20' + pers_number.substr(0,2), month: pers_number.substr(2,2), day: pers_number.substr(4,2), last: pers_number.substr(6,4) };
            }
            else if (pers_number.length === 8) { // 190202
                return { success: true, year: '20' + pers_number.substr(0,2), month: pers_number.substr(2,2), day: pers_number.substr(4,2), last: '0000' };
            }
            else if (pers_number.length < 8) { // 190101...
                return { success: true, year: '20' + pers_number.substr(0,2), month: pers_number.substr(2,2), day: pers_number.substr(4,2), last: '0000' };
            }
        }
    }
    else if (pers_number.substr(0,2) > '20') { // its 1900..1999
        if (pers_number.length === 10) { // 8507091414
            return { success: true, year: '19' + pers_number.substr(0,2), month: pers_number.substr(2,2), day: pers_number.substr(4,2), last: pers_number.substr(6,4) };
        }
        else if (pers_number.length >= 6) { // 850709
            return { success: true, year: '19' + pers_number.substr(0,2), month: pers_number.substr(2,2), day: pers_number.substr(4,2), last: '0000' };
        }
    }
    else if (pers_number.substr(0,2) <= current_year_two_digits) { // its 2000..current year
        if (pers_number.length === 10) { // 8507091414
            return { success: true, year: '20' + pers_number.substr(0,2), month: pers_number.substr(2,2), day: pers_number.substr(4,2), last: pers_number.substr(6,4) };
        }
        else if (pers_number.length >= 6) { // 850709
            return { success: true, year: '20' + pers_number.substr(0,2), month: pers_number.substr(2,2), day: pers_number.substr(4,2), last: '0000' };
        }
    }
    else if (pers_number.substr(0,2) === '20') {
        if (pers_number.length === 12) { //200001011414
            return { success: true, year: pers_number.substr(0,4), month: pers_number.substr(4,2), day: pers_number.substr(6,2), last: pers_number.substr(8,4) };
        }
        else if (pers_number.length >= 8) { // 20000101...
            return { success: true, year: pers_number.substr(0,4), month: pers_number.substr(4,2), day: pers_number.substr(6,2), last: '0000' };
        }
    }

    return { success: false, year: '', month: '', day: '', last: '' };
}