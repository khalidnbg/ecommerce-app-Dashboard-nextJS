import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import img1 from "@/public/product.png";
import Spinner from "../components/Spinner";

// Utility function to format price with a comma for thousands
const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const pageSize = 10; // Number of products per page

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios.get("/api/product").then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  }, []);

  // Calculate the total number of pages
  const totalPages = Math.ceil(products.length / pageSize);

  // Calculate the start and end index for the current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(currentPage * pageSize, products.length);

  const productsToDisplay = products.slice(startIndex, endIndex);

  const changePage = (page) => {
    setCurrentPage(page);
    setLoading(false);
  };

  return (
    <>
      <header>
        <div className="mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
              <p className="mt-1.5 text-md text-gray-500">
                Let&apos;s create a new product! 🎉
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
              <Link
                href={"/products/new"}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-green-600 px-5 py-3 text-green-600 transition hover:bg-green-50 hover:text-green-700 focus:outline-none focus:ring"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium"> Add Product </span>
              </Link>
            </div>
          </div>
          <hr className="my-8 h-px border-0 bg-gray-300" />
        </div>
      </header>

      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : products.length === 0 ? (
          <p className="w-full text-center">No products available.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsToDisplay.map((product, index) => (
                <div
                  key={product._id}
                  className="border rounded-lg shadow-sm p-4 bg-white"
                >
                  <div className="flex flex-col items-center">
                    <div className="h-32 w-32 mb-4">
                      <img
                        className="h-full w-full rounded object-cover object-center bg-gray-200"
                        src={product.images?.[0] || img1}
                        alt={product.title}
                      />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {product.title}
                    </h2>
                    <p className="mt-2 text-md text-gray-700 truncate">
                      {product.description}
                    </p>
                    <p className="mt-2 text-md text-gray-900 font-semibold">
                      MAD. {formatPrice(product.price)}
                    </p>
                    <div className="mt-4 flex space-x-4">
                      <Link
                        href={"/products/edit/" + product._id}
                        className="inline-block rounded bg-green-500 px-4 py-2 text-xs font-medium text-white hover:bg-green-700"
                      >
                        Edit
                      </Link>
                      <Link
                        href={"/products/delete/" + product._id}
                        className="inline-block rounded bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700"
                      >
                        Delete
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => changePage(i + 1)}
                    className={`mx-2 px-3 py-2 rounded ${
                      i + 1 === currentPage
                        ? "bg-blue-300 text-slate-900"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
