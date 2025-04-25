import CartProduct from "../models/cartProduct.model.js";
import UserModel from "../models/user.model.js";

export async function addToCart(req, res) {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    const checkItemCart = await CartProduct.findOne({
      user: userId,
      productId: productId,
    });

    if (checkItemCart) {
      return res
        .status(400)
        .json({ success: false, message: "Item already in cart" });
    }

    const cartItem = new CartProduct({
      quantity: 1,
      userId: userId,
      productId: productId,
    });

    const save = await cartItem.save();

    const upadateCartUser = await UserModel.updateOne(
      {
        _id: userId,
      },
      {
        $push: {
          shopping_cart: productId,
        },
      }
    );

    return res
      .status(200)
      .json({ success: true, message: "Item added to cart", data: save });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
      error: error.message,
    });
  }
}

export async function getCartItems(req, res) {
  try {
    const usersId = req.user.id;

    const cartItems = await CartProduct.find({ userId: usersId }).populate(
      "productId"
    );

    return res.status(200).json({
      success: true,
      data: cartItems,
    });
  } catch (error) {
    console.error("Error getting cart items:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get cart items",
      error: error.message,
    });
  }
}

export async function updateCartItem(req, res) {
  try {
    const userId = req.user.id;
    const { _id, qty } = req.body;

    const cartItem = await CartProduct.findById(_id);

    if (!_id || !qty) {
      return res.status(404).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    const updateCartItem = await CartProduct.updateOne(
      {
        _id: _id,
        userId: userId,
      },
      {
        quantity: qty,
      }
    );

    return res.status(200).json({
      success: true,
      data: updateCartItem,
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update cart item",
      error: error.message,
    });
  }
}

export async function deleteCartItem(req, res) {
  try {
    const userId = req.user.id;
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "_id is required",
      });
    }

    const deletecartItem = await CartProduct.deleteOne({
      _id: _id,
      userId: userId,
    });

    if (!deletecartItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    return res.status(200).json({
      message: "Item deleted successfully",
      success: true,
      data: deletecartItem,
    });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete cart item",
      error: error.message,
    });
  }
}
