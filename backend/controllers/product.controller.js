import fs from 'fs';
import Product from '../models/product.model.js';
import { uploadImage } from '../utilities/uploadimage.js';
import UserModel from '../models/user.model.js'; // Import UserModel

// Create product
export async function CreateProduct(request, response) {
  try {
    console.log('DEBUG: CreateProduct req.body:', request.body);
    console.log('DEBUG: CreateProduct req.files:', request.files);
    let imageUrls = [];

    // Handle image uploads if files are present in the request
    if (request.files && request.files.length > 0) {
      // Upload each image to Imgur and collect URLs
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
          // Log and propagate the error for better error handling
          console.error('Image upload failed:', err);
          throw err;
        }
      });

      try {
        // Wait for all image uploads to complete
        const uploadedImages = await Promise.all(uploadPromises);
        imageUrls = uploadedImages.filter((url) => url !== null);
      } catch (err) {
        // If any image upload fails, return a specific error
        return response.status(400).json({
          success: false,
          message: `Image upload failed: ${err?.data?.error || err.message || 'Unknown error'}`,
        });
      }
    } else if (request.body.images && Array.isArray(request.body.images)) {
      // If image URLs are directly provided in the request body
      imageUrls = request.body.images;
    }

    // Create new product with data from request body
    const product = new Product({
      name: request.body.name,
      description: request.body.description,
      images: imageUrls, // Use the uploaded image URLs
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

    // Validate required fields
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

    // Save the product to the database
    const savedProduct = await product.save();

    // Return success response with the saved product
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

// Get all products
export async function GetAllProducts(request, response) {
  try {
    // Extract query parameters for filtering and pagination
    const {
      category,
      featured,
      search,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = request.query;

    // Build filter object
    const filter = {};

    // Add category filter if provided
    if (category) {
      filter.category = category;
    }

    // Add featured filter if provided
    if (featured) {
      filter.isFeatured = featured === 'true';
    }

    // Add price range filter if provided
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Add search filter if provided
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ dateCreated: -1 });

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    // Return products with pagination info
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

// Get product by ID
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

// Update product
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

    // Parse location like in CreateProduct
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
    console.error('UpdateProduct error:', error); // Debug: log full error
    response.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message,
    });
  }
}

// Add review to a product
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
    // Check if user already reviewed
    if (product.reviews.some(r => r.user.toString() === userId.toString())) {
      return response.status(400).json({ success: false, message: 'You have already reviewed this product.' });
    }
    // Get user info
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
    // Update product average rating
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    await product.save();
    response.status(201).json({ success: true, message: 'Review added.', review, reviews: product.reviews });
  } catch (error) {
    response.status(500).json({ success: false, message: 'Error adding review', error: error.message });
  }
}

// Delete product
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
