import React from "react";
import CategoryListProvider from "./CategoryListProvider";
import WishListProvider from "./WishListProvider";

export const AppProviders = ({ children }) => {
  return (
    <CategoryListProvider>
      <WishListProvider>
        {children}
      </WishListProvider>
    </CategoryListProvider>
  );
};

export default AppProviders;