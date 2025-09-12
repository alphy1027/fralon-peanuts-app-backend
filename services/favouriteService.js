const ErrorResponse = require("../middleware/errorResponse");
const Client = require("../models/client");

class FavouriteService {
  constructor(clientModel) {
    this.Client = clientModel;
  }

  async getFavouriteProducts(clientId) {
    const client = await this.Client.findById(clientId);
    if (!client) throw new ErrorResponse("Unknown user can not request for favourite products", 404);
    return client.favouriteProducts;
  }

  async addFavouriteProduct(clientId, productId) {
    if (!productId) throw new ErrorResponse("No product ID was provided", 404);
    const updatedClient = await this.Client.findByIdAndUpdate(
      clientId,
      { $addToSet: { favouriteProducts: productId } },
      { new: true }
    );
    if (!updatedClient) throw new ErrorResponse("Unknown user can not add products to favourites", 404);

    if (!updatedClient.favouriteProducts.includes(productId.toString())) {
      throw new ErrorResponse("Product has not been added to favourites");
    }
    return updatedClient.favouriteProducts;
  }

  async removeFavouriteProduct(clientId, productId) {
    if (!productId) throw new ErrorResponse("No product ID was provided", 404);
    const updatedClient = await this.Client.findByIdAndUpdate(
      clientId,
      { $pull: { favouriteProducts: productId } },
      { new: true }
    );
    if (!updatedClient) throw new ErrorResponse("Unknown user can not remove products from Favourites", 404);

    if (updatedClient.favouriteProducts.includes(productId.toString())) {
      throw new ErrorResponse("Product has not been removed from Favourites", 400);
    }
    return updatedClient.favouriteProducts;
  }
}

module.exports = new FavouriteService(Client);
