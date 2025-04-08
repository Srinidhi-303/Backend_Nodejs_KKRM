
const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');

dotEnv.config()

const secretKey = process.env.WhatIsYourName

const verifyToken = async(req, res, next) => {

    console.log("Incoming Headers:", req.headers);

    const authHeader = req.headers.authorization || req.headers.token;

    if (!authHeader) {
        return res.status(401).json({ error: "Token is required" });
    }
    
    const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

    if(!token){
        return res.status(401).json({error: "Token is required"});

    }
    try{
        const decoded = jwt.verify(token, secretKey)
        console.log("✅ Decoded token:", decoded);

        const vendor = await Vendor.findById(decoded.vendorId);
        console.log("Vendor fetched from DB:", vendor);
        
        if(!vendor){
            return res.status(404).json({error: "vendor not found"})
        }
        req.vendorId = vendor._id

        next()

    }catch(error){
        console.error(error)
        return res.status(500).json({error: "Invalid token"})
    }
};

module.exports = verifyToken