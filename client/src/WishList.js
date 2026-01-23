import { useState, useMemo } from "react";
import { useWishList } from "./WishListProvider";
import { useCategoryList } from "./CategoryListProvider";
import WishModal from "./WishModal";
import Wish from "./Wish";

function WishList() {
  const { data: wishes, handlerMap } = useWishList();
  const { data: categories, categoryMap } = useCategoryList();
  
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Vše");
  const [prioFilter, setPrioFilter] = useState("Vše");
  const [sort, setSort] = useState("Od nejstarší");
  
  const [modalState, setModalState] = useState({ show: false, data: null });

  const processedWishes = useMemo(() => {
     if (!wishes) {
        return [];
    }

    let result = [...wishes];

    if (search !== "") {
        result = result.filter((w) => {
            return w.name.toLowerCase().includes(search.toLowerCase());
        });
    }

    if (catFilter !== "Vše") {
        result = result.filter((w) => {
            return w.categoryId === catFilter;
        });
    }

    if (prioFilter !== "Vše") {
        result = result.filter((w) => {
            return w.priority === prioFilter;
        });
    }

    if (sort === "Od nejmladší") {
        result.sort((a, b) => {
            return new Date(b.cts) - new Date(a.cts);
        });
    } else if (sort === "Od nejstarší") {
        result.sort((a, b) => {
            return new Date(a.cts) - new Date(b.cts);
        });
    } else if (sort === "Abecedně (A-Ž)") {
        result.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
    } else if (sort === "Abecedně (Ž-A)") {
        result.sort((a, b) => {
            return b.name.localeCompare(a.name);
        });
    }
    
    return result;
  }, [wishes, search, catFilter, prioFilter, sort]);


  const handleAddNew = () => {
    setModalState({ show: true, data: null });
  };

  const handleEdit = (wish) => {
    setModalState({ show: true, data: wish });
  };

  const handleCloseModal = () => {
    setModalState({ show: false, data: null });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Opravdu chcete smazat toto přání?")) {
      await handlerMap.deleteWish(id);
    }
  };

  return (
    <div className="content-wrapper">
      
      <div className="upper-section">
        <div className="section-title">✨ Přehled přání</div>
        <button className="static-button button-green" onClick={handleAddNew}>
          Nové přání
        </button>
      </div>
      
      <div className="filter-section">
        <input 
          className="search-bar" 
          placeholder="Vyhledat" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        
        <select 
          className="filter-choose" 
          value={catFilter} 
          onChange={(e) => setCatFilter(e.target.value)}
        >
          <option value="Vše">Všechny kategorie</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        
        <select 
          className="filter-choose" 
          value={prioFilter} 
          onChange={(e) => setPrioFilter(e.target.value)}
        >
          <option value="Vše">Všechny priority</option>
          <option>🔴 Vysoká</option>
          <option>🟠 Střední</option>
          <option>🟢 Nízká</option>
        </select>
        
        <select 
          className="filter-choose" 
          value={sort} 
          onChange={(e) => setSort(e.target.value)}
        >
          <option>Od nejstarší</option>
          <option>Od nejmladší</option>
          <option>Abecedně (A-Ž)</option>
          <option>Abecedně (Ž-A)</option>
        </select>
      </div>
      
      <div className="list-container">
        {processedWishes.map((wish) => {
          const hasCategory = !!categoryMap[wish.categoryId];
          const displayCategory = hasCategory ? categoryMap[wish.categoryId].name : "Bez kategorie";

          return (
            <Wish 
              key={wish.id} 
              wish={wish}
              categoryName={displayCategory}
              isCategoryMissing={!hasCategory}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          );
        })}
        
        {processedWishes.length === 0 && (
          <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
            Nic nenalezeno.
          </div>
        )}
      </div>

      <WishModal 
        show={modalState.show}
        wish={modalState.data}
        onHide={handleCloseModal}
      />
    </div>
  );
}

export default WishList;
