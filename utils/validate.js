
const isValidUsername = (username) =>{
    const usernameRegex = /^[\w.@+-]{1,150}$/gm
    if (typeof(username) != 'string') {
        return false;
    }
    return usernameRegex.test(username);
}

const isValidPassword = (password) => {
    // Check conditions if required
    return typeof(password) == 'string';
}

const isValidEmail = (email) => {
    if (typeof(email) != 'string') {
        return false;
    }
    const emailRegex = /^\S+@\S+/gm;
    return emailRegex.test(email);
}

const isValidName = (name) => {

    return typeof(name) == 'string' && name.length >=1
}

module.exports = {
    isValidUsername,
    isValidPassword,
    isValidEmail,
    isValidName
}