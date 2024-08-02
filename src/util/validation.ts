export const isPhoneNumber = (phoneNumber: String) => {
    const allowed = "+0123456789".split("");
    for (let digit of phoneNumber) {
        if (!allowed.includes(digit)) return false;
    }
    return true;
};