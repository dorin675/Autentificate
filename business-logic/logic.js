require("../config/database").connect();
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");
require ("dotenv").config();
const User = require("../model/user");

module.exports.getIfExistAllFields=async(fname,lname,email,password,status)=>{
try{
    if (email && password && fname && lname && status) {
    return true;
    } else{
        return false;
    }
}
catch(err){
    console.error(err);
}
}



module.exports.getUser=async(email)=>{
    return User.findOne({email})

};

module.exports.getUserByID=async(_id)=>{
    return User.findOne({_id})

};

const getEncryptedPassword=async(password)=>{
        const encriptPassword=await bcrypt.hash(password, 10);
        return encriptPassword;
};

const setVerificationCode=async ()=>{
    const num=Math.floor(Math.random()*1000000).toString();
    console.log(`Verification Code : ${num}`);
    numHash=await bcrypt.hash(num,10);
    return numHash;
}

module.exports.createUser = async (fname,lname,email,password,status)=>{
    const encriptPassword=await getEncryptedPassword(password);
    const verificationCode=await setVerificationCode();
    return User.create({
        first_name:fname,
        last_name:lname,
        email: email.toLowerCase(), 
        password: encriptPassword,
        verificationCode: verificationCode,
        status:status.toLowerCase(),
        verified:false,
        isActive:true
    });
}

module.exports.getVerificationData=async(email,verificationCode)=>{
    if(email&&verificationCode){return true}else{return false};
}

module.exports.isVerified=async(user)=>{
    if(user.verified===null){return false}
    return user.verified?true:false;
};

module.exports.compareCode=async(code,userCode)=>bcrypt.compare(code,userCode);

module.exports.updateVerifiedStatus=async(user)=>user=await user.updateOne({verified:true});


module.exports.getLogInData=async(email,password)=>{
    if(email&&password){return true}else{return false};
}

module.exports.isActive=async(user)=>user.isActive?true:false;

module.exports.getToken=async(user)=>{
    const token = jwt.sign(
        { user_id: user._id, email: user.email ,isActive:user.isActive,status:user.status},
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
        );
        user.token = token;
        return user;
}

module.exports.getAdminLogInData=async(id,token)=>{
    if(id&&token){return true}else{return false};
}

module.exports.verifyToken=async(token)=>{
    const {isActive,status}=jwt.decode(token);
    console.log(status)
    console.log(isActive)
    if(status==="admin"&&isActive){return true}else{return false};
}

module.exports.disableUserByID=async(_id)=>{
    const user1= await User.findOne({_id});
    user1=await user1.updateOne({isActive:false})
    console.log(user1);
}

module.exports.getJustPublicData=async(user)=>{
    const {_id,first_name,last_name,status,isActive,email,verified}=user;
    return {_id,first_name,last_name,status,isActive,email,verified};
}