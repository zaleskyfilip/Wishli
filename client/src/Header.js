function Header({ activeTab, onTabChange }) {
  return (
    <div className="header-container">
      <div 
        className="logo" 
        onClick={() => onTabChange("wishlist")}
      >
        WishLi
      </div>

      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === "wishlist" ? "active" : ""}`}
          onClick={() => onTabChange("wishlist")}
        >
          Přehled přání
        </button>
        <button 
          className={`tab-button ${activeTab === "categorylist" ? "active" : ""}`}
          onClick={() => onTabChange("categorylist")}
        >
          Seznam kategorií
        </button>
      </div>
    </div>
  );
}
export default Header;