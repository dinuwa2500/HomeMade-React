import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  addToCart,
  getCartItems,
  updateCartItem,
  deleteCartItem,
} from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.post("/addcart", auth, addToCart);
cartRouter.get("/getcartitems", auth, getCartItems);
cartRouter.put("/updatecart", auth, updateCartItem);
cartRouter.delete("/deletecart", auth, deleteCartItem);

export default cartRouter;
