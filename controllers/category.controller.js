const { createCategoryService, getCategoryService, getCategoryByIdService, updateCategoryService } = require("../services/category.services");

exports.createCategory = async (req, res, next) => {
    try {
        const result = await createCategoryService(req.body);

        res.status(200).json({
            status: 'success',
            message: "Category created successfully"
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: "Couldn't created Category successfully"
        })
    }
}

exports.getCategories = async (req, res, next) => {
    try {
        const categories = await getCategoryService();

        res.status(200).json({
            status: 'success',
            data: categories
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: "Couldn't get Categories successfully"
        })
    }
}

exports.getCategoryById = async (req, res, next) => {
    try {
        const {id} = req.params;
        const category = await getCategoryByIdService(id);

        if(!category){
            return res.status(400).json({
                status: "fail",
                message: "Couldn't get the category"
            })
        }

        res.status(200).json({
            status: 'success',
            data: category
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: "Couldn't get the category successfully"
        })
    }
}

exports.updateCategory = async (req, res, next) => {
    try {
        const {id} = req.params;
        const result = await updateCategoryService(id, req.body);

        if(!result.nModified){
            return res.status(400).json({
                status: "fail",
                message: "Couldn't update the category"
            })
        }

        res.status(200).json({
            status: 'success',
            message: "Category updated successfully"
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: "Couldn't update the category successfully"
        })
    }
}