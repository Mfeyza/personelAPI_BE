"use strict"
/* -------------------------------------------------------
    EXPRESS - Personnel API
------------------------------------------------------- */

const Department= require("../models/department.model")

module.exports={
    list: async (req,res) =>{
        const data = await res.getModelList(Department);
        res.status(200).send({
            error:false,
            detail: await res.getModelList(Department)
        })
    },
    create: async (req,res) =>{
        res.status(201).send({
            error: false,
            data
        }) 
    },
    read: async (req,res) =>{
   res.status(200).send({
    error:false,
    data
   })
    },
    update: async (req,res) =>{
        const data= await Department.updateOne(
            {_id:req.params.id}, req.body,{runValidators:true} //buna bi bak yarın
        )
        res.status(202).send({
            error:false,
            data,
            new: await Department.findOne({_id : req.params.id})
        })

    },
    
    delete: async (req,res) =>{

    },
    
    
    
}