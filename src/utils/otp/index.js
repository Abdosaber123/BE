export function generateOtp(){
    const otp = Math.floor(Math.random() * 90000 + 100000)
    const expireOtp =Date.now() + 15 * 60 * 1000
    return {otp , expireOtp}
}