import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Spinner from "./components/Spinner";

export default function Categories() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [editedCategory, setEditedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const closeModal = () => setShowModal(false);
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    } finally {
      setLoading(false);
    }
  }

  async function saveCategory(ev) {
    ev.preventDefault();

    const data = { name, parentCategory };

    try {
      if (editedCategory) {
        data._id = editedCategory._id;
        await axios.put("/api/categories", data);
        setEditedCategory(null);
        toast.success("Category updated successfully!");
      } else {
        await axios.post("/api/categories", data);
        toast.success("Category created successfully!");
      }
      setName("");
      setParentCategory("");
      fetchCategories();
    } catch (error) {
      console.error("Error saving category", error);
      toast.error("Failed to save category");
    }
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id || "");
  }

  async function deleteCategory(category) {
    const { _id } = category;
    try {
      await axios.delete(`/api/categories?_id=${_id}`);
      closeModal();
      fetchCategories();
      toast.success("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category", error);
      toast.error("Failed to delete category");
    }
  }

  return (
    <>
      <header>
        <div className="mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900">
                All Categories
              </h1>
              <p className="mt-1.5 text-md text-gray-500">
                <span>
                  {editedCategory ? (
                    <>
                      Editing category,
                      <span className="text-green-600 font-bold">
                        {editedCategory.name}
                      </span>
                      &nbsp;
                      <span className="text-blue-500 font-bold">
                        {editedCategory?.parent?.name}
                      </span>
                    </>
                  ) : (
                    "Create a new category!"
                  )}
                </span>
              </p>
            </div>
            <form
              onSubmit={saveCategory}
              className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2.5 text-gray-500">
                  +
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center text-gray-500">
                  <select
                    className="h-full rounded-md border-transparent bg-transparent py-0 pl-3 pr-7 text-gray-500 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    value={parentCategory}
                    onChange={(ev) => setParentCategory(ev.target.value)}
                  >
                    <option value="">No parent</option>
                    {categories.length > 0 &&
                      categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                </div>
                <input
                  type="text"
                  className="block w-full sm:w-[400px] rounded-md border border-slate-300 py-2.5 pl-8 pr-16 shadow-sm disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Category Name"
                  value={name}
                  onChange={(ev) => setName(ev.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="rounded-lg border border-blue-100 bg-blue-100 px-5 py-3 text-center text-sm font-medium text-blue-600 transition-all hover:border-blue-200 hover:bg-blue-200 focus:ring focus:ring-blue-50 disabled:border-blue-50 disabled:bg-blue-50 disabled:text-blue-400"
              >
                {editedCategory ? "Save changes" : "Save Category"}
              </button>
            </form>
          </div>
          <hr className="my-8 h-px border-0 bg-gray-300" />
        </div>
      </header>

      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : categories.length === 0 ? (
          <p className="w-full text-center">No categories available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div
                key={category._id}
                className="border rounded-lg shadow-sm p-4 bg-white"
              >
                <div className="flex flex-col items-center">
                  <h2 className="text-lg font-bold text-gray-900">
                    {category.name}
                  </h2>
                  <p className="mt-2 text-md text-gray-700">
                    {category?.parent?.name || "No parent"}
                  </p>
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => editCategory(category)}
                      className="inline-block rounded bg-green-500 px-4 py-2 text-xs font-medium text-white hover:bg-green-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={toggleModal}
                      className="inline-block rounded bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                    {showModal && (
                      <Modal
                        category={category}
                        closeModal={closeModal}
                        deleteCategory={deleteCategory}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function Modal({ category, closeModal, deleteCategory }) {
  return (
    <div className="fixed inset-0 z-10 bg-gray-300/50">
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
        <div className="mx-auto w-full overflow-hidden rounded-lg bg-white shadow-xl sm:max-w-sm">
          <div className="relative p-5">
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-800">
                Are you sure?
              </h3>
              <p className="text-gray-500">
                Do you really want to delete this category? <br />
                <span className="font-medium text-gray-800">
                  <b>{category.name}</b>
                </span>
                <br />
                This process cannot be undone.
              </p>
            </div>
          </div>
          <div className="bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={() => deleteCategory(category)}
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
