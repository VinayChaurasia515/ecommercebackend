const Jwt=require('jsonwebtoken')
//create token and send in cookie
const sendToken=(user,statusCode,res)=>{
    console.log("OOOO ",user);
    // var payload = {
    //     email: user.email,
    //     role: user.password
    // } 
    // Jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1h'},function(error,token){
    //     if(error){
    //         console.log('data token :: ',error)
    //        // callback(error,null)
    //     }
    //     else{
    //        // console.log('data toke ',error)
    //        console.log('token generation completed',token)
    //        console.log("process.env.JWT_SECRET  ::",process.env.JWT_SECRET);
    //        // callback(null,token)
    //        res.set("authtoken1", token)
    //        console.log("send token")


    //        res.status(statusCode).json({
    //         success:true,
    //         user,
    //         token
    //     })
    //     }
    // })
// var payload = {
//         email: user.email,
//         role: user.password
// }

    const token = user.getJWTToken();
    
    //option for cookie
    const options={
        expires:new Date(
            Date.now()+process.env.COOKIE_EXPIRE*24*60*60*1000
        ),
      //  secure:false,
        httpOnly:true
    };
    res.set("token", token)
    console.log("send token")
  //  res.cookie("token",token)
    
    res.cookie('token',token,{
        expires:new Date(Date.now()+2589200000),
        secure: false, // set to true if your using https
        httpOnly: true
    })
    res.status(statusCode).json({
        success:true,
        user,
        token
    })
    // res.status(statusCode)
    // .cookie("token",token,options)
    // .json({
    //     success:true,
    //     user,
    //     token
    // })
    // res.send({
    //     "message":"login done"
    // })
}

module.exports=sendToken