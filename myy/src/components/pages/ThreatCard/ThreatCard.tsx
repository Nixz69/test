import "./ThreatCard.css";

type ThreatCardProps = {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  showDetails: () => void;
  onAddToCart: () => void;
};

export function ThreatCard({
  title,
  description,
  imageUrl,
  price,
  showDetails,
  onAddToCart
}: ThreatCardProps){
  return (
    <div className="threat-card">
      <img src={imageUrl} alt={title} className="threat-image" />
      <div className="threat-content">
        <h3 className="threat-title">{title}</h3>
        <p className="threat-description">{description}</p>
        <p className="threat-price">{price}$</p>

        <div className="threat-buttons">
          <button className="btn btn-blue" onClick={showDetails}>
            Подробнее
          </button>
          <button className="btn btn-green" onClick={onAddToCart}>
            Добавить в заявку
          </button>
        </div>
      </div>
    </div>
  );
}
