function Wish(props) {
  const wish = props.wish;
  
  let categoryStyle = {};
  if (props.isCategoryMissing === true) {
    categoryStyle = { color: 'red' };
  } else {
    categoryStyle = { color: 'inherit' };
  }

  return (
    <div className="list-section wish-zone">
      <div className="slot-text">
        {wish.name}
      </div>
      
      <div className="slot-text" style={categoryStyle}>
        {props.categoryName}
      </div>

      <div className="slot-text">
        {wish.priority}
      </div>
      
      <div className="actions">
        {wish.link ? (
          <a href={wish.link} target="_blank" className="link-icon active">
            🔗
          </a>
        ) : null}

        <button className="icon-button edit" onClick={() => props.onEdit(wish)}>
           ✎
        </button>
        <button className="icon-button delete" onClick={() => props.onDelete(wish.id)}>
           ⛔
        </button>
      </div>
    </div>
  );
}

export default Wish;