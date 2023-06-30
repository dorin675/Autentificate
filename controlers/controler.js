const logic = require("../business-logic/logic");
const eror=require("../errors/errorhandling");
module.exports.register= async (req, res) => {
try{
    const {firstName,lastName,email,password,status}=req.body;
    const existAllFields=await logic.getIfExistAllFields(email,password,firstName,lastName,status);
    if (!existAllFields) {
        return res.status(400).send("All input is required");
    }
    const oldUser = await logic.getUser(email);
      
    if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
    }
    
    const user=await logic.createUser(firstName,lastName,email,password,status);

    console.log(user);

    return res.status(201).send("Verify your account");
    }catch (err) {
        eror.handleError(err);
      }
    }


module.exports.verify=async (req,res)=>{
    try{
        const{email, verificationCode}=req.body;
        const existAllFields=await logic.getVerificationData(email,verificationCode);
        if (!existAllFields) {
            return res.status(400).send("All input is required");
          }

        const user = await logic.getUser(email);
        console.log(user);
        if(user===null){
            return res.status(400).send("Don't exist such a user")
        }
        if(await logic.isVerified(user)){
          return res.status(409).send("You are already verified");
        }
        const codeMatch= await logic.compareCode(verificationCode,user.verificationCode);
        if(user && codeMatch){
            await logic.updateVerifiedStatus(user);
            return res.status(200).json(user);
        }
        return res.status(400).send("Invalid Code or Email");
    }catch(err){
        eror.handleError(err);
    }
    }

module.exports.login=async (req, res) => {
    try {
        const { email, password } = req.body;
        const existAllFields=await logic.getLogInData(email,password);
        if (!existAllFields) {
          return res.status(400).send("All input is required");
        }
        const user = await logic.getUser(email);

        if(!user){
          return res.status(400).send("Don't exist such a user");
        }
        const isActive=await logic.isActive(user);
        if(!isActive){
          return res.status(409).send("Sorry you were kicked out");

        }
        const compareCode=await logic.compareCode(password, user.password);
        const isVerified=await logic.isVerified(user);
        if (user && compareCode && isVerified && isActive) {
          console.log(user);
          await logic.getToken(user);
          return res.status(200).json(user);
        }
        return res.status(400).send("Invalid Credentials");
      } catch (err) {
        eror.handleError(err);
      }}

module.exports.user=async(req,res)=>{
    try{
        const {id} =req.params;
        const user=await logic.getUserByID(id);
        const publicData=await logic.getJustPublicData(user)
        return res.send(publicData);
    }catch(err){
        eror.handleError(err);
    }
}

module.exports.admin=async(req,res)=>{
        try{
          
          const {_id}=req.body;
          const token = req.body.token || req.query.token || req.headers["token"];
          console.log(token);
          const existAllFields=await logic.getAdminLogInData(_id,token);
          if (!existAllFields) {
            return res.status(400).send("All input is required");
          }
          const verifyToken=await logic.verifyToken(token);
          if(!verifyToken){
            return res.status(400).send("You are not admin or maybe you are not active");
          }

          await logic.disableUserByID(_id);
          
          return res.status(200).send("Operation successful!")

        }catch(err){
          eror.handleError(err);
        }
      }
