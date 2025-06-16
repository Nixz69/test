import "./Basket.css";

export function Basket({ goToThreeSlide, cartItems }: { goToThreeSlide: () => void; cartItems: any[] }) {
  const itemCount = cartItems.length;

  return (
    <div className="basket">
      <button onClick={goToThreeSlide}>
        {itemCount > 0 && <span className="basket-count">{itemCount}</span>}
      </button>
    </div>
  );
}
