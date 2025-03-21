const Category = require('../models/category');

class CategoryService {
    constructor(categoryModel) {
        this.Category = categoryModel;
    }

    async getAllCategories() {
        return await this.Category.find()
    }

    async createCategory(categoryDetails) {
        return await this.Category.create(categoryDetails)
    }

    async deleteCategory(categoryId) {
        return await this.Category.findByIdAndDelete(categoryId)
    }
}

module.exports = new CategoryService(Category);