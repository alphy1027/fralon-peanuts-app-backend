const mongoose = require('mongoose');
const Product = require('../models/product');
const productService = require('../services/productService');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../middleware/errorResponse');
const successResponse = require('../middleware/successResponse');
const validateId = require('../utils/validateId');

const addNewProduct_post = asyncHandler(async (req, res, next) => {
    const { buffer } = req.file;
    const {
        name: productName,
        description,
        size: packageSize,
        price: unitPrice,
        category,
        wholesalePrice: wholesaleUnitPrice
    } = req.body;
    if (!req.file)
        return next(new ErrorResponse('No product image provided', 400))

    const newProduct = await productService.createProduct({
        productName,
        description,
        packageSize,
        unitPrice,
        category,
        wholesaleUnitPrice
    }, buffer);
    if (!newProduct)
        return next(new ErrorResponse('New product not found', 404))
    return successResponse(res, 'New product successfully created', { newProduct }, 201);
})

const getAllProducts_get = asyncHandler(async (req, res, next) => {
    const products = await productService.getAllProducts(req.query);
    if (products.length === 0)
        return next(new ErrorResponse('No products found', 404))
    return successResponse(res, 'Products retrieved successfully', { products });
})

const getSingleProduct_get = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    validateId(productId, next);
    if (!productId)
        return next(new ErrorResponse('Product ID is required', 400));
    validateId(productId, next)
    const product = await Product.findById(productId);
    if (!product)
        return next(new ErrorResponse('Product not found', 404))
    return successResponse(res, 'Product retrieved successfully', { product })
})

const deleteProduct_delete = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    validateId(productId, next);
    const product = await productService.deleteProduct(productId);
    if (!product)
        return next(new ErrorResponse('Product not found', 404))
    return successResponse(res, 'Product deleted successfully')
})

const updateProduct_put = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    const productDetails = req.body;
    validateId(productId, next)
    const updatedProduct = await productService.updateProduct(productId, productDetails)
    if (!updatedProduct)
        return next(new ErrorResponse('Product not found', 404))
    return successResponse(res, 'Product updated successfully', { updatedProduct })
})

const deleteImage = asyncHandler(async (req, res, next) => {
    const result = await productService.deleteImageFromCloudinary(publicId);
    console.log(result)
})



module.exports = {
    addNewProduct_post,
    getAllProducts_get,
    deleteProduct_delete,
    getSingleProduct_get,
    updateProduct_put,
    deleteImage
}