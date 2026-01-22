import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

const WishListContext = createContext();

export function useWishList() {
  const context = useContext(WishListContext);
  if (!context) {
    throw new Error("useWishList must be used within a WishListProvider");
  }
  return context;
}

export default function WishListProvider({ children }) {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);


  async function fetchWishes() {
    setStatus("loading");
    try {
      const response = await fetch("/wish/list", {
        method: "GET",
      });
      
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      
      const result = await response.json();
      setData(result);
      setStatus("success");
    } catch (e) {
      setError(e.message);
      setStatus("error");
    }
  }

  async function createWish(payload) {
    const response = await fetch("/wish/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.errorMessage || "Chyba při vytváření");
    }

    await fetchWishes();
  }

  async function updateWish(payload) {
    const response = await fetch("/wish/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Chyba při aktualizaci");
    }

    await fetchWishes();
  }

  async function deleteWish(id) {
    const response = await fetch("/wish/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error("Chyba při mazání");
    }

    await fetchWishes();
  }

  useEffect(() => {
    fetchWishes();
  }, []);

  const value = useMemo(() => {
    return {
      data,
      status,
      error,
      handlerMap: {
        fetchWishes,
        createWish,
        updateWish,
        deleteWish,
      },
    };
  }, [data, status, error]);

  return (
    <WishListContext.Provider value={value}>
      {children}
    </WishListContext.Provider>
  );
}