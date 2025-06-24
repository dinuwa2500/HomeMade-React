import fs from 'fs';
import Product from '../models/product.model.js';
import { uploadImage } from '../utilities/uploadimage.js';
import UserModel from '../models/user.model.js'; 
import mongoose from 'mongoose';

export async function CreateProduct(request, response) {
  try {
   
    let imageUrls = [];

    if (request.files && request.files.length > 0) {
      const uploadPromises = request.files.map(async (file) => {
        try {
          let fileBuffer;
          if (file.buffer) {
            fileBuffer = file.buffer;
          } else if (file.path) {
            fileBuffer = fs.readFileSync(file.path);
          } else {
            throw new TypeError('File object has neither buffer nor path');
          }
          const imageUrl = await uploadImage(fileBuffer);
          if (imageUrl) {
            return imageUrl;
          }
          return null;
        } catch (err) {
          console.error('Image upload failed:', err);
          throw err;
        }
      });

      try {
        const uploadedImages = await Promise.all(uploadPromises);
        imageUrls = uploadedImages.filter((url) => url !== null);
      } catch (err) {
        return response.status(400).json({
          success: false,
          message: `Image upload failed: ${err?.data?.error || err.message || 'Unknown error'}`,
        });
      }
    } else if (request.body.images && Array.isArray(request.body.images)) {
      imageUrls = request.body.images;
    }

    const product = new Product({
      name: request.body.name,
      description: request.body.description,
      images: imageUrls, 
      brand: request.body.brand,
      price: request.body.price,
      catName: request.body.catName,
      catId: request.body.catId,
      subCatId: request.body.subCatId,
      subCat: request.body.subCat,
      subCatName: request.body.subCatName,
      thirdsubCat: request.body.thirdsubCat,
      thirdsubCatName: request.body.thirdsubCatName,
      thirdsubCatId: request.body.thirdsubCatId,
      category: request.body.category,
      countInStock: request.body.countInStock,
      rating: request.body.rating,
      isFeatured: request.body.isFeatured,
      discount: request.body.discount,
      productRam: request.body.productRam,
      size: request.body.size,
      productWeight: request.body.productWeight,
      location: request.body.location,
    });

    if (
      !product.name ||
      !product.description ||
      !product.category ||
      product.countInStock === undefined || product.countInStock === null ||
      (imageUrls.length === 0 && product.images.length === 0)
    ) {
      return response.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const savedProduct = await product.save();

    response.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: savedProduct,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message,
    });
  }
}

export async function GetAllProducts(request, response) {
  try {
    const {
      category,
      featured,
      search,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = request.query;

    const filter = {};

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.$or = [
          { category: category },
          { category: { $regex: category, $options: 'i' } }
        ];
      } else {
        filter.category = { $regex: category, $options: 'i' };
      }
    }

    if (featured) {
      filter.isFeatured = featured === 'true';
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ dateCreated: -1 });

    const total = await Product.countDocuments(filter);

    response.status(200).json({
      success: true,
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message,
    });
  }
}

export async function GetProductById(request, response) {
  try {
    const product = await Product.findById(request.params.id);

    if (!product) {
      return response.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    response.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message,
    });
  }
}

export async function UpdateProduct(request, response) {
  try {
    const product = await Product.findById(request.params.id);

    if (!product) {
      return response.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    let imageUrls = [];

    if (request.files && request.files.length > 0) {
      const uploadPromises = request.files.map(async (file) => {
        let fileBuffer;
        if (file.buffer) {
          fileBuffer = file.buffer;
        } else if (file.path) {
          fileBuffer = fs.readFileSync(file.path);
        } else {
          throw new TypeError('File object has neither buffer nor path');
        }
        const imageUrl = await uploadImage(fileBuffer);
        return imageUrl || null;
      });
      const uploadedImages = await Promise.all(uploadPromises);
      imageUrls = uploadedImages.filter((url) => url !== null);
    }

    let parsedLocation = [];
    if (Array.isArray(request.body.location)) {
      parsedLocation = request.body.location;
    } else if (typeof request.body.location === 'string') {
      try {
        const parsed = JSON.parse(request.body.location);
        if (Array.isArray(parsed)) parsedLocation = parsed;
      } catch (e) {
        parsedLocation = [
          {
            value: request.body.location.toLowerCase().replace(/\s+/g, '-'),
            label: request.body.location,
          },
        ];
      }
    }

    const updateData = {
      name: request.body.name,
      description: request.body.description,
      brand: request.body.brand,
      price: request.body.price,
      catName: request.body.catName,
      catId: request.body.catId,
      subCatId: request.body.subCatId,
      subCat: request.body.subCat,
      subCatName: request.body.subCatName,
      thirdsubCat: request.body.thirdsubCat,
      thirdsubCatName: request.body.thirdsubCatName,
      thirdsubCatId: request.body.thirdsubCatId,
      category: request.body.category,
      countInStock: request.body.countInStock,
      rating: request.body.rating,
      isFeatured: request.body.isFeatured,
      discount: (request.body.discount === undefined || request.body.discount === null || request.body.discount === "null" || request.body.discount === "") ? 0 : Number(request.body.discount),
      productRam: request.body.productRam,
      size: request.body.size,
      productWeight: request.body.productWeight,
      location: parsedLocation,
    };

    if (imageUrls.length > 0) {
      if (request.body.keepExistingImages === 'true') {
        updateData.images = [...product.images, ...imageUrls];
      } else {
        updateData.images = imageUrls;
      }
    } else if (request.body.images && Array.isArray(request.body.images)) {
      updateData.images = request.body.images;
    }

    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const updatedProduct = await Product.findByIdAndUpdate(
      request.params.id,
      updateData,
      { new: true }
    );

    response.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('UpdateProduct error:', error); 
    response.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message,
    });
  }
}

export async function AddProductReview(request, response) {
  try {
    const { rating, comment } = request.body;
    const { id } = request.params;
    const userId = request.user._id || request.user.id;
    if (!rating || !comment) {
      return response.status(400).json({ success: false, message: 'Rating and comment are required.' });
    }
    const product = await Product.findById(id);
    if (!product) {
      return response.status(404).json({ success: false, message: 'Product not found.' });
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return response.status(404).json({ success: false, message: 'User not found.' });
    }
    const review = {
      user: user._id,
      name: user.name,
      email: user.email,
      rating,
      comment,
      createdAt: new Date(),
    };
    product.reviews.push(review);
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    await product.save();
    response.status(201).json({ success: true, message: 'Review added.', review, reviews: product.reviews });
  } catch (error) {
    response.status(500).json({ success: false, message: 'Error adding review', error: error.message });
  }
}

export async function DeleteProduct(request, response) {
  try {
    const product = await Product.findByIdAndDelete(request.params.id);

    if (!product) {
      return response.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    response.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message,
    });
  }
}
