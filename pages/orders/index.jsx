import axios from "axios";
import { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("/api/order").then((response) => {
      setOrders(response.data);
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Orders</h1>

      {orders.length > 0 &&
        orders.map((order, index) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow-md p-4 mb-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
          </div>
        ))}
    </div>
  );
}
