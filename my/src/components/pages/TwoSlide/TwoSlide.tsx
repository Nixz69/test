import { useEffect, useState, useCallback } from "react";
import { ThreatCard } from "../ThreatCard/ThreatCard";
import "./TwoSlide.css";
import { fetchServices } from "../../../api/services/serviceApi";
import { Basket } from "../Basket/Basket";
import type { Threat, CartItem } from "../../../types";


interface TwoSlideProps {
  goBack: () => void;
  showDetails: (threat: Threat) => void;
  goToThreeSlide: () => void;
  goToApplications: () => void;
  cartItems: CartItem[];
  addToCart: (item: Threat) => void;
}

export function TwoSlide({
  showDetails,
  goToThreeSlide,
  addToCart,
  cartItems
}: Omit<TwoSlideProps, 'goBack' | 'goToApplications'>) {
  const [threats, setThreats] = useState<Threat[]>([]);
  
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const fetchThreats = useCallback(async () => {
    const data = await fetchServices(search, minPrice, maxPrice); 
    setThreats(data);
  }, [search, minPrice, maxPrice]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchThreats();
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [fetchThreats]);

  return (
    <div className="container-two">
      <div className="navv">
        <h1>Услуги</h1>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Поиск по названию"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="search-container">
        <input
          type="number"
          className="price-input"
          placeholder="Мин. цена"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          className="price-input"
          placeholder="Макс. цена"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      <div className="threat-cards">
        {threats.map((threat) => (
          <ThreatCard
            key={threat.id}
            title={threat.name}
            description={threat.description}
            price={threat.price}
            imageUrl={threat.image}
            showDetails={() => showDetails(threat)}
            onAddToCart={() =>
              addToCart({
                id: threat.id,
                name: threat.name,
                description: threat.description,
                image: threat.image,
                price: threat.price,

              })
            }
          />
        ))}
      </div>

      <Basket goToThreeSlide={goToThreeSlide} cartItems={cartItems} />
    </div>
  );
}