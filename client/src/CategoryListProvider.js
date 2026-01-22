import React, { createContext, useContext, useState, useEffect } from "react";

const CategoryListContext = createContext();

export function useCategoryList() {
  const context = useContext(CategoryListContext);
  if (context === undefined) {
    console.log("Chyba: zapomněli jste na Provider!");
  }
  return context;
}

export default function CategoryListProvider(props) {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  function fetchCategories() {
    setStatus("loading");
    
    fetch("/category/list")
      .then(function(response) {
        if (response.ok === false) {
          throw new Error("Nepovedlo se načíst kategorie");
        }
        return response.json();
      })
      .then(function(resData) {
        setData(resData);
        setStatus("success");
      })
      .catch(function(err) {
        setError(err.message);
        setStatus("error");
      });
  }

  function createCategory(newCategoryData) {
    fetch("/category/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCategoryData),
    })
    .then(function(res) {
      if (res.ok === true) {
        fetchCategories(); 
      } else {
        alert("Něco se nepovedlo při vytváření");
      }
    });
  }

  function updateCategory(updatedData) {
    fetch("/category/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
    .then(function(res) {
      if (res.ok === true) {
        fetchCategories();
      } else {
        console.log("Chyba aktualizace");
      }
    });
  }

  function deleteCategory(categoryId) {
    const deleteObject = { id: categoryId };
    
    fetch("/category/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(deleteObject),
    })
    .then(function(res) {
      if (res.ok === true) {
        fetchCategories();
      } else {
        alert("Chyba při mazání");
      }
    });
  }

  useEffect(function() {
    fetchCategories();
  }, []);

  const categoryMap = {};
  if (data !== null && data !== undefined) {
    for (let i = 0; i < data.length; i++) {
      let cat = data[i];
      categoryMap[cat.id] = cat;
    }
  }

  const value = {
    data: data,
    categoryMap: categoryMap,
    status: status,
    error: error,
    handlerMap: {
      fetchCategories: fetchCategories,
      createCategory: createCategory,
      updateCategory: updateCategory,
      deleteCategory: deleteCategory,
    },
  };

  return (
    <CategoryListContext.Provider value={value}>
      {props.children}
    </CategoryListContext.Provider>
  );
}