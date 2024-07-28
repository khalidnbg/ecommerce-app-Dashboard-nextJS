import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/order")
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error("Error fetching orders", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4">
      {loading ? (
        <div className="flex justify-center items-center my-10">
          <Spinner />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-4xl py-10">No Order Found!</p>
      ) : (
        orders.map((order) => (
          <>
            <h1 className="text-3xl font-bold mb-4">Orders</h1>
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md p-4 mb-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Order details can be rendered here */}
              </div>
            </div>
          </>
        ))
      )}
    </div>
  );
}
