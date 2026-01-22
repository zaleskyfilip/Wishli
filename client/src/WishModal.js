import { useState, useEffect } from "react";
import { useWishList } from "./WishListProvider";
import { useCategoryList } from "./CategoryListProvider";

function WishModal({ show, onHide, wish }) {
  const { handlerMap } = useWishList();
  const { data: categories } = useCategoryList();

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    priority: "🔴 Vysoká",
    link: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = wish ? true : false;

  useEffect(() => {
    if (show) {
      if (wish) {
        let categoryValid = false;
        if (categories != null) {
          categories.forEach(function(c) {
            if (c.id === wish.categoryId) {
              categoryValid = true;
            }
          });
        }
        setFormData({
          name: wish.name || "",
          categoryId: categoryValid ? wish.categoryId : "",
          priority: wish.priority || "🔴 Vysoká",
          link: wish.link || "",
        });
      } else {
        setFormData({
          name: "",
          categoryId: "",
          priority: "🔴 Vysoká",
          link: "",
        });
      }
      setErrors({});
      setIsSubmitting(false);
    }
  }, [show, wish, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.name.trim()) {
        newErrors.name = "Povinné pole";
    } else if (formData.name.length > 100) {
        newErrors.name = "Pole může být vyplněno maximálně 100 znaky.";
    }

    if (!formData.categoryId) newErrors.categoryId = "Vyberte kategorii";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEdit) {
        await handlerMap.updateWish({ id: wish.id, ...formData });
      } else {
        await handlerMap.createWish(formData);
      }
      onHide();
    } catch (error) {
      alert(error.message || "Chyba při ukládání");
    } finally {
      setIsSubmitting(false);
    }
  };

  let nameInputClass = "input-space";
  if (errors.name) {
      nameInputClass = nameInputClass + " error-border";
  }

  let categoryInputClass = "input-space";
  if (errors.categoryId) {
      categoryInputClass = categoryInputClass + " error-border";
  }

  return (
    <div className="modal-space" style={{ display: show ? 'flex' : 'none' }}>
      <div className="modal-box">
        <div className="modal-title">
          {isEdit ? "Upravit přání" : "Nové přání"}
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

            <div className="form-group">
                <label className="label">Kategorie *</label>
                <select
                    name="categoryId"
                    className={categoryInputClass}
                    value={formData.categoryId}
                    onChange={handleChange}
                >
                    <option value="">Vyberte kategorii</option>
                    {categories?.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
                {errors.categoryId ? (
                    <div className="error-button">{errors.categoryId}</div>
                ) : null}
            </div>

            <div className="form-group">
                <label className="label">Priorita</label>
                <select
                    name="priority"
                    className="input-space"
                    value={formData.priority}
                    onChange={handleChange}
                >
                    <option>🔴 Vysoká</option>
                    <option>🟠 Střední</option>
                    <option>🟢 Nízká</option>
                </select>
            </div>

            <div className="form-group">
                <label className="label">Odkaz</label>
                <input
                    name="link"
                    type="text"
                    className="input-space"
                    value={formData.link}
                    onChange={handleChange}
                    autoComplete="off"
                />
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

export default WishModal;