import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URI || "http://localhost:8000";

const FashionMens = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Try fetching by category string, then by category ID if needed
        let res = await axios.get(`${API_URL}/api/products?category=men's fashion`);
        let productsArray = res.data.products || [];
        if (productsArray.length === 0) {
          // Try with the known category ID as a fallback (update this ID as needed)
          res = await axios.get(`${API_URL}/api/products?category=680c8dc1b6322dc96691094b`);
          productsArray = res.data.products || [];
        }
        setProducts(productsArray);
        console.log("Fetched products:", productsArray);
      } catch (err) {
        setProducts([]);
        console.log("Error fetching products:", err);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <section className="section py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Men's Fashion</h2>
        {loading ? (
          <div className="text-center py-20 text-gray-400 text-lg animate-pulse">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-lg">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex flex-col p-4 border border-gray-100 group relative overflow-hidden"
              >
                <div className="relative w-full h-48 mb-3 rounded-xl overflow-hidden">
                  <Link to={`/product/${product._id}`} className="block w-full h-full">
                    <img
                      src={product.images?.[0] || "/placeholder.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
                    />
                    {/* Modern badge for discount */}
                    {typeof product.discount === "number" && product.discount > 0 && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10 animate-bounce">
                        -{product.discount}%
                      </span>
                    )}
                  </Link>
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1 group-hover:text-red-600 transition-colors">{product.name}</h3>
                <div className="flex items-center mb-2">
                  <span className="text-red-600 font-bold text-xl mr-2">Rs {product.price?.toLocaleString()}</span>
                  {typeof product.discount === "number" && product.discount > 0 && (
                    <span className="text-gray-400 line-through text-sm">Rs {product.originalPrice?.toLocaleString() || product.price?.toLocaleString()}</span>
                  )}
                </div>
                <div className="flex-1 mb-2">
                  <p className="text-gray-500 text-sm line-clamp-2">{product.description}</p>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{product.brand}</span>
                  {/* You can add more badges here, e.g., for stock */}
                  {product.countInStock <= 5 && (
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded animate-pulse">Low Stock</span>
                  )}
                </div>
                <Link
                  to={`/product/${product._id}`}
                  className="inline-block bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold py-2 px-4 rounded-lg w-full text-center shadow transition-all duration-200 mt-auto"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FashionMens;
