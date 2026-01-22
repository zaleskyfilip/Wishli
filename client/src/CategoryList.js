import { useState, useMemo } from "react";
import { useCategoryList } from "./CategoryListProvider";
import CategoryModal from "./CategoryModal";
import Category from "./Category";

function CategoryList() {
  const { data: categories, handlerMap } = useCategoryList();
  
  const [search, setSearch] = useState("");
  const [modalState, setModalState] = useState({ show: false, data: null });

  const processedCategories = useMemo(() => {
    if (!categories) {
        return [];
    }

    let result = [...categories];

    if (search !== "") {
        result = result.filter((c) => {
            return c.name.toLowerCase().includes(search.toLowerCase());
        });
    }

    result.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    return result;
  }, [categories, search]);


  const handleAddNew = () => {
    setModalState({ show: true, data: null });
  };

  const handleEdit = (category) => {
    setModalState({ show: true, data: category });
  };

  const handleCloseModal = () => {
    setModalState({ show: false, data: null });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Opravdu chcete smazat tuto kategorii?")) {
      await handlerMap.deleteCategory(id);
    }
  };

  return (
    <div className="content-wrapper">
      
      <div className="upper-section">
        <div className="section-title">📜 Seznam kategorií</div>
        <button className="static-button button-green" onClick={handleAddNew}>
          Přidat kategorii
        </button>
      </div>

      <div className="filter-section">
        <input 
          className="search-bar" 
          placeholder="Vyhledat" 
          value={search}
          onChange={(e) => setSearch(e.target.value)} 
          style={{ width: "100%" }} 
        />
      </div>

      <div className="list-container">
        {processedCategories.map((cat) => (
          <Category 
            key={cat.id} 
            category={cat} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
        
        {processedCategories.length === 0 && (
          <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
            {search ? "Nic nenalezeno." : "Žádné kategorie."}
          </div>
        )}
      </div>

      <CategoryModal 
        show={modalState.show}
        category={modalState.data}
        onHide={handleCloseModal}
      />
    </div>
  );
}

export default CategoryList;