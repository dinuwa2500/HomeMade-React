import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { IoCloseSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

const CategoryPanel = (props) => {
  const toggleDrawer = (newOpen) => () => {
    props.setIsOpenCategoryPanel(newOpen);
  };

  const categories = [
    { img: "https://ekade.lk/wp-content/uploads/2023/06/1-2.png", name: "Agricultural Products", link: "/category/agricultural-products" },
    { img: "https://ekade.lk/wp-content/uploads/2023/06/2.png", name: "Bags", link: "/category/bags" },
    { img: "https://ekade.lk/wp-content/uploads/2023/06/3.png", name: "Bamboo Products", link: "/category/bamboo-products" },
    { img: "https://ekade.lk/wp-content/uploads/2023/06/4.png", name: "Batik Wear", link: "/category/batik-wear" },
    { img: "https://ekade.lk/wp-content/uploads/2023/06/5.png", name: "Beauty And Cosmetics", link: "/category/beauty-and-cosmetics" },
    { img: "https://ekade.lk/wp-content/uploads/2023/06/7.png", name: "Bedsheets", link: "/category/bedsheets" },
  ];

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <h3 className="text-[18px] font-[500] flex items-center justify-between p-3">
        Shop By Category
        <IoCloseSharp className="cursor-pointer text-[25px]" onClick={toggleDrawer(false)} />
      </h3>

      <div className="scroll">
        <ul className="w-full">
          {categories.map((category, index) => (
            <li className="p-3" key={index}>
              <Link to={category.link} onClick={toggleDrawer(false)} className="w-full block">
                <Button className="w-full !text-left !justify-start !px-3 !gap-2 !text-[13px] !text-black">
                  <img src={category.img} className="mb-0 mt-0" alt={category.name} />
                  {category.name}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Box>
  );

  return <Drawer open={props.isOpenCategoryPanel} onClose={toggleDrawer(false)}>{DrawerList}</Drawer>;
};

export default CategoryPanel;
