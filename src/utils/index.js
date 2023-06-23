import mongoose from "mongoose";

export const isValidName = (name) => {
    const nameRegex = /^[a-zA-Z]{1,20}$/;
    return nameRegex.test(name);
};

export const isValidEmail = (email) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

export const isValidPassword = (password) => {
    const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/;
        return passwordRegex.test(password);
};


export const isValid = (input) => {
    if (mongoose.Types.ObjectId.isValid(input)) return true;
    return false;
};

export const isValidarr = (arr) => {
    if (arr && Array.isArray(arr)) return true;

    return false;;
}


export const checkFormat = function (input) {
    if (!input) return false
    input = input.trim();
    if (input == "") return false;
    else return input

}

export const checkISBN = function (ISBN) {
    let regexForIsbn = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
    return regexForIsbn.test(ISBN)
}