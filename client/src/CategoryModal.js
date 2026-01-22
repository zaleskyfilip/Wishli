import { useState, useEffect } from "react";
import { useCategoryList } from "./CategoryListProvider";

function CategoryModal({ show, onHide, category }) {
  const { handlerMap } = useCategoryList();
  
  const [formData, setFormData] = useState({ name: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = category ? true : false;

  useEffect(() => {
    if (show) {
      setFormData({ name: category ? category.name : "" });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [show, category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
    
    if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) {
        newErrors.name = "Povinné pole";
    } else if (formData.name.length > 50) {
        newErrors.name = "Pole může být vyplněno maximálně 50 znaky.";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEdit) {
        await handlerMap.updateCategory({ id: category.id, ...formData });
      } else {
        await handlerMap.createCategory(formData);
      }
      onHide();
    } catch (e) {
      alert(e.message || "Chyba při ukládání");
    } finally {
      setIsSubmitting(false);
    }
  };

  let nameInputClass = "input-space";
  if (errors.name) {
      nameInputClass = nameInputClass + " error-border";
  }

  return (
    <div className="modal-space" style={{ display: show ? 'flex' : 'none' }}>
      <div className="modal-box">
        <div className="modal-title">
            {isEdit ? "Upravit Kategorii" : "Nová Kategorie"}
        </div>
        
        <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Název *</label>
              <input 
                name="name"
                type="text"
                className={nameInputClass} 
                value={formData.name} 
                onChange={handleChange}
                autoComplete="off"
              />
              {errors.name ? (
                  <div className="error-button">{errors.name}</div>
              ) : null}
            </div>
            
            <div className="modal-buttons">
              <button 
                type="submit" 
                className="static-button button-green" 
                disabled={isSubmitting}
              >
                {isEdit ? "Uložit" : "Vytvořit"}
              </button>
              
              <button 
                type="button" 
                className="static-button button-red" 
                onClick={onHide}
                disabled={isSubmitting}
              >
                Zrušit
              </button>
            </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryModal;