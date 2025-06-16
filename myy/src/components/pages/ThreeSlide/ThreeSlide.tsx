import { useState } from "react";
import "./ThreeSlide.css";
import {
  fetchOrCreateDraftApplication,
  addServiceToApplication
} from "../../../api/services/applicationApi";

type ThreeSlideProps = {
  goBack: () => void;
  cartItems: any[];
  showDetails: (item: any) => void;
  setCartItems: (items: any[]) => void;
};

export function ThreeSlide({ goBack, cartItems, setCartItems, showDetails }: ThreeSlideProps){
  const [isSubmitting, setIsSubmitting] = useState(false);

  const removeFromCart = (indexToRemove: number) => {
    setCartItems(cartItems.filter((_, index) => index !== indexToRemove));
  };

  const submitApplication = async () => {
    setIsSubmitting(true);
    try {
      const draftApp = await fetchOrCreateDraftApplication("POST");
      const draft = Array.isArray(draftApp) ? draftApp[0] : draftApp;

      await Promise.all(
        cartItems.map(item =>
          addServiceToApplication(item.id, draft.id)
        )
      );

      alert("Заявка успешно отправлена!");
      setCartItems([]);
      goBack();
    } catch (error) {
      console.error("Ошибка при отправке заявки:", error);
      alert("Произошла ошибка при отправке заявки.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <h1 className="application-title">Составление заявки</h1>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Корзина пуста!</p>
      ) : (
        <div className="cart-list">
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <img src={item.image} alt={item.title} className="cart-image" />
              <div className="cart-content">
                <h3 className="cart-title">{item.title}</h3>
                <p className="cart-description">{item.description}</p>
                <div className="cart-buttons">
                  <button className="btn btn-blue" onClick={() => showDetails(item)}>
                    Подробнее
                  </button>
                  <button className="btn btn-red" onClick={() => removeFromCart(index)}>
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="cart-submit">
            <button className="btn btn-green" onClick={submitApplication} disabled={isSubmitting}>
              {isSubmitting ? "Отправка..." : "Отправить заявку"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
