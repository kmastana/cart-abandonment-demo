import { useState, useEffect } from "react";

export default function CartAbandonDemo() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [lastActionTime, setLastActionTime] = useState(Date.now());
  const [abandoned, setAbandoned] = useState(false);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const checkAbandonment = setInterval(() => {
      if (cart.length > 0 && Date.now() - lastActionTime > 60000) { // 15 min timeout
        setAbandoned(true);
        sendAbandonEvent();
      }
    }, 30000); // Check every minute
    return () => clearInterval(checkAbandonment);
  }, [cart, lastActionTime]);

  const addToCart = (item) => {
    setCart([...cart, item]);
    setLastActionTime(Date.now());
    setAbandoned(false);
  };

  const sendAbandonEvent = async () => {
    await fetch("https://your-azure-function-url/api/abandon-cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart, timestamp: new Date() })
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Cart Abandonment Demo</h1>
      <button 
        className="p-2 bg-blue-500 text-white rounded mt-4" 
        onClick={() => addToCart("Product 1")}
      >
        Add Product 1 to Cart
      </button>
      <div className="mt-4">
        {cart.length > 0 ? (
          <p>Items in cart: {cart.length}</p>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
      {abandoned && <p className="text-red-500 mt-2">Cart abandoned! Sending alert...</p>}
    </div>
  );
}
