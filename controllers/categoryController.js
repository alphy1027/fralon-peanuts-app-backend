const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../middleware/errorResponse");
const successResponse = require("../middleware/successResponse");
const categoryService = require("../services/categoryService");
const validateId = require("../utils/validateId");

const createCategory_post = asyncHandler(async (req, res, next) => {
    const { name, description } = req.body;
    const newCategory = await categoryService.createCategory({ name, description });
    return successResponse(res, 'Category created successfully', { newCategory }, 201)
})

const getAllCategories_get = asyncHandler(async (req, res, next) => {
    const categories = await categoryService.getAllCategories();
    if (!categories.length)
        return new ErrorResponse('No categories found', 404)
    return successResponse(res, 'Categories retrieved successfully', { categories })
})

const deleteCategory_delete = asyncHandler(async (req, res, next) => {
    const { categoryId } = req.params;
    validateId(categoryId, next)
    const deletedCategory = await categoryService.deleteCategory(categoryId);
    if (!deletedCategory)
        return new ErrorResponse('Category not found', 404)
    return successResponse(res, 'Category deleted successfully', { deletedCategory })
})

module.exports = {
    createCategory_post,
    getAllCategories_get,
    deleteCategory_delete
}