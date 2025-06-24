import myList from "../models/myList.model.js";

export async function addMyList(req, res) {
  try {
    const userId = req.user.id;

    const { productId, productTitle, image, rating, price, brand } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "productId is required",
      });
    }

    const items = await myList.findOne({
      userId: userId,
      productId: productId,
    });

    if (items) {
      return res.status(400).json({
        message: "Product already exists in your myList",
      });
    }

    const mylist = new myList({
      productId,
      productTitle,
      image,
      rating,
      price,
      brand,
      userId,
    });

    const save = await mylist.save();

    return res.status(201).json({
      message: "Product added to myList successfully",
      mylist: save,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

export async function deleteMyList(req, res) {
  try {
    const userId = req.user.id;
    const _id = req.params.id;

    if (!_id) {
      return res.status(400).json({
        message: "_id is required",
      });
    }

    const deleteMyList = await myList.deleteOne({
      _id : _id,
      userId: userId,
    });

    if (!deleteMyList.deletedCount) {
      return res.status(404).json({
        message: "Item not found in myList",
      });
    }

    return res.status(200).json({
      message: "Item deleted successfully from myList",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

export async function getMyList(req, res) {
  try {
    const userId = req.user.id;

    const myListItems = await myList.find({
      userId: userId,
    });

    return res.status(200).json({
      message: "MyList items fetched successfully",
      data: myListItems,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}
