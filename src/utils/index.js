export const isValid = (data) => {
    if (typeof data === "undefined" || data === null) return false;
    if (typeof data === "string" && data.trim().length === 0) return false;
    return true;
};

export const validString = (input) => {
    return /^[a-zA-Z0-9\s\-\.,']+$/u.test(input);
}

export const validateEmail = (email) => {
    return /^[\w\.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*\.[a-zA-Z]{2,}$/
        .test(email);
};


export const isValidReqBody = (value) => {
    return Object.keys(value).length > 0
}

export const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/;
    return passwordRegex.test(password);
};


export const isValidPhoneNumber = (phoneNumber) => {
    return /^\d{10}$/.test(phoneNumber);
};



export const isValidPincode = (inp) => {
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(inp);
};



export const isValidPlace = (inp) => {
    const placeRegex = /^[\w\s-]+$/;
    return placeRegex.test(inp);
};


export const isValidISBN = (inp) => {
    const isbnValid = (/^(?=(?:\D*\d){13}(?:(?:\D*\d){3})?$)[\d-]+$/g)
    return isbnValid.test(inp);
};