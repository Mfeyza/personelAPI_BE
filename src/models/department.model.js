"use strict"
/* -------------------------------------------------------
    EXPRESS - Personnel API
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
/* ------------------------------------------------------- */
const DepartmentSchema= new Schema(
    {
        name: String,
        trim:true,
        required:true,
        unique:true

    }
    
    
    
    ,{
        collection:"departments", 
        timestamps:true
    })

module.exports=mongoose.model("Department", DepartmentSchema)