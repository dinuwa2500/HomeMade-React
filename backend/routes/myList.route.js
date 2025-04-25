import { Router } from "express";
import auth from "../middleware/auth.js";
import { addMyList, deleteMyList , getMyList} from "../controllers/myList.controller.js";

const myList = Router();

myList.post("/addmylist", auth, addMyList);
myList.delete("/deletemylist/:id", auth, deleteMyList);
myList.get("/getmylist", auth, getMyList);

export default myList;
