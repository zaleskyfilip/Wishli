function Category(props) {
  const category = props.category;

  return (
    <div className="list-section category-space">
      <div className="slot-text">
        {category.name}
      </div>

      <div className="actions">
        <button className="icon-button edit" onClick={() => props.onEdit(category)}>
           ✎
        </button>
        <button className="icon-button delete" onClick={() => props.onDelete(category.id)}>
           ⛔
        </button>
      </div>
    </div>
  );
}

export default Category;