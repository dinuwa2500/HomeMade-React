import { Button } from "@mui/material";
import React, { useState } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { LiaAngleDownSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import { GoRocket } from "react-icons/go";
import CategoryPanel from "./CategoryPanel";

const Navigation = () => {
  const [isOpenCategoryPanel, setIsOpenCategoryPanel] = useState(false);
  const [isFashionOpen, setIsFashionOpen] = useState(false);

  const openCategoryPanel = () => {
    setIsOpenCategoryPanel(true);
  };

  const fashionSubcategories = [
    { name: "Men's Fashion", link: "/fashion/mens" },
    { name: "Women's Fashion", link: "/fashion/womens" },
    { name: "Kids Fashion", link: "/fashion/kids" },
    { name: "Accessories", link: "/fashion/accessories" },
    { name: "Footwear", link: "/fashion/footwear" },
    { name: "Jewelry", link: "/fashion/jewelry" },
  ];

  return (
    <>
      <nav className="py-2">
        <div className="container flex items-center justify-end">
          <div className="col_1 w-[20%] font-bold">
            <Button className="!text-black gap-2 " onClick={openCategoryPanel}>
              {" "}
              <RiMenu2Fill className="text-[20px]" />
              Shop By Category
              <LiaAngleDownSolid className="text-[15px] ml-auto font-bold" />
            </Button>
          </div>

          <div className="col_2 w-[60%]">
            <ul className="flex items-center gap-5">
              <li className="list-none">
                <Link to="/" className="link transition font-[500] text-[14px]">
                  <Button className="!text-black transition text-capitalize font-bold">
                    Home
                  </Button>
                </Link>
              </li>
              <li className="list-none relative">
                <div
                  className="cursor-pointer"
                  onMouseEnter={() => setIsFashionOpen(true)}
                  onMouseLeave={() => setIsFashionOpen(false)}
                >
                  <Link
                    to="/fashion"
                    className="link transition font-[500] text-[14px]"
                  >
                    <Button className="!text-black transition text-capitalize font-bold">
                      Fashions
                    </Button>
                  </Link>

                  {isFashionOpen && (
                    <div className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 min-w-[200px] z-50">
                      {fashionSubcategories.map((subcat, index) => (
                        <Link
                          key={index}
                          to={subcat.link}
                          className="block px-4 py-2 hover:bg-gray-100 text-[14px] font-[500]"
                        >
                          {subcat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </li>
              <li className="list-none">
                <Link to="/" className="link transition font-[500] text-[14px]">
                  <Button className="!text-black transition text-capitalize font-bold">
                    New Arrivals
                  </Button>
                </Link>
              </li>
              <li className="list-none">
                <Link to="/" className="link transition font-[500] text-[14px]">
                  <Button className="!text-black transition text-capitalize font-bold">
                    All Brands
                  </Button>
                </Link>
              </li>
              <li className="list-none">
                <Link to="/" className="link transition font-[500] text-[14px]">
                  <Button className="!text-black transition text-capitalize font-bold">
                    More
                  </Button>
                </Link>
              </li>
            </ul>
          </div>

          <div className="col_3 w-[20%]">
            <p className="text-[14px] font-[400] flex items-center gap-3 mx-auto mb-0 mt-0 ">
              <GoRocket className="text-[18px] " />
              Free Island Wide Delivery
            </p>
          </div>
        </div>
      </nav>

      <CategoryPanel
        isOpenCategoryPanel={isOpenCategoryPanel}
        setIsOpenCategoryPanel={setIsOpenCategoryPanel}
      />
    </>
  );
};

export default Navigation;
