const { createSupplierService, getSuppliersService, getSupplierByIdService, updateSupplierService } = require("../services/supplier.services")

exports.createSupplier = async (req, res, next) => {
    try {
        const result = await createSupplierService(req.body);

        res.status(200).json({
            status: "success",
            message: "Successfully created the supplier"
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            // error: "Couldn't create the supplier."
            error: error.message
        })
    }
}

exports.getSupplier = async (req, res, next) => {
    try {
        const suppliers = await getSuppliersService(req.body);

        res.status(200).json({
            status: "success",
            data: suppliers
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: "Couldn't get the suppliers."
            // error: error.message
        })
    }
}

exports.getSupplierById = async (req, res, next) => {
    try {
        const {id} = req.params;
        const supplier = await getSupplierByIdService(id);

        if(!supplier){
            return res.status(400).json({
                status: "fail",
                error: "Couldn't find supplier with this id"
            })
        }

        res.status(200).json({
            status: "success",
            data: supplier
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: "Couldn't get the brand."
        })
    }
}

exports.updateSupplier = async (req, res, next) => {
    try {
        const {id} = req.params;
        const result = await updateSupplierService(id, req.body);

        console.log(result);

        if(!result.nModified){
            return res.status(400).json({
                status: "fail",
                error: "Couldn't update the supplier with this id"
            })
        }

        res.status(200).json({
            status: "success",
            message: "Successfully update the supplier"
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: "Couldn't update the supplier."
        })
    }
}