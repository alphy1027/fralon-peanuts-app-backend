const ErrorResponse = require('../middleware/errorResponse');
const Product = require('../models/product');
const Category = require('../models/category');
const cloudinary = require('../utils/uploadImage');

class ProductService {
    constructor(productModel) {
        this.Product = productModel;
    }

    async createProduct(productDetails, buffer) {
        const uploadResult = await this.uploadImageToCloudinary(buffer);
        console.log(uploadResult)
        const imageDetails = {
            image: uploadResult.secure_url,
            publicId: uploadResult.public_id
        }
        return await this.Product.create({ ...productDetails, productImage: imageDetails });
    }

    async addProductToCategory(categoryId, productId) {
        const category = await Category.findByIdAndUpdate(
            categoryId,
            { $addToSet: { products: productId } }, // $addToSet Adds an element to an array only if it doesn't already exist (enforces uniqueness
            { new: true }
        ).exec();
    }

    async getAllProducts(query) {
        const { sortBy, order = -1, limit = 30 } = query;
        let pipeline = []

        if (sortBy) {
            pipeline.push({ $sort: { [sortBy]: parseInt(order) } })
        }
        pipeline.push({ $limit: parseInt(limit) })

        return await this.Product.aggregate(pipeline)
    }

    async getProductById(productId) {
        return await this.Product.findById(productId).exec();
    }

    async deleteProduct(productId) {
        const product = await this.getProductById(productId);
        if (!product)
            throw new ErrorResponse('Product not found');
        const publicId = product?.productImage?.publicId;
        const deletedImage = await this.deleteImageFromCloudinary(publicId);

        if (deletedImage.result === 'ok') {
            return await product.deleteOne();
        } else if (deletedImage.result === 'not found') {
            throw new ErrorResponse('Image not found in cloudinary')
        } else {
            throw new ErrorResponse('Error deleting image from cloudinary')
        }
    }

    async updateProduct(productId, productDetails) {
        return await this.Product.findByIdAndUpdate(productId,
            { $set: { ...productDetails } },
            { new: true, runValidators: true }
        ).exec();
    }

    uploadImageToCloudinary(buffer) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                resource_type: 'image',
                quality: 'auto',
                fetch_format: 'auto'
            }, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
            uploadStream.end(buffer);
        });
    };

    async deleteImageFromCloudinary(publicId) {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Delete result : ", result);
        return result;
    }

}

module.exports = new ProductService(Product);