// src/App.js
import { useState } from "react";
import AppProviders from "./AppProviders"; 
import CategoryList from "./CategoryList";
import WishList from "./WishList";
import Header from "./Header"; 
import "./App.css";

function AppContent() {
  const [activeTab, setActiveTab] = useState("wishlist");

  return (
    <div className="App">
      <Header onTabChange={setActiveTab} activeTab={activeTab} />

      {activeTab === "wishlist" ? (
        <WishList />
      ) : (
        <CategoryList />
      )}
    </div>
  );
}

function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

export default App;