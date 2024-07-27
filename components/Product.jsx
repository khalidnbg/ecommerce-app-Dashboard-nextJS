import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function Product() {
  const [redirect, setRedirect] = useState(false);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);

  const [isUploading, setIsUploading] = useState(false);

  const uploadImagesQueue = [];

  async function createProduct(ev) {
    ev.preventDefault();

    if (isUploading) {
      await Promise.all(uploadImagesQueue);
    }

    const data = { title, description, price, images };
    await axios.post("/api/product", data);

    setRedirect(true);
  }

  async function uploadImages(ev) {
    const files = ev.target.files;
    if (files.length > 0) {
      setIsUploading(true);
      for (const file of files) {
        const data = new FormData();
        data.append("file", file);

        uploadImagesQueue.push(
          axios
            .post("/api/upload", data)
            .then((res) => {
              setImages((oldImages) => [...oldImages, ...res.data.links]);
            })
            .catch((err) => console.error(err))
        );
      }

      await Promise.all(uploadImagesQueue);
      setIsUploading(false);
    } else {
      return alert("No images selected.");
    }
  }

  if (redirect) {
    router.push("/products");
    return null;
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  function handleDeleteImage(index) {
    const updateImages = [...images];
    updateImages.splice(index, 1);
    setImages(updateImages);
  }

  return (
    <form onSubmit={createProduct} className="space-y-5">
      {/* Title input */}
      <div className="grid grid-cols-2 items-center my-4">
        <label className="col-span-1 block text-lg font-medium text-gray-700 mb-3">
          Title
        </label>
        <div className="col-span-2">
          <input
            type="text"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 border p-3"
            placeholder="Product Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      </div>

      {/* Category select */}
      <div>
        <label
          htmlFor="category"
          className="block text-lg font-medium text-gray-900"
        >
          Select Category
        </label>
        <select
          id="category"
          className="mt-1.5 p-3 w-full rounded-md border border-gray-300 text-gray-700"
        >
          <option value="0">No category selected</option>
          <option>option 1</option>
          <option>option 2</option>
          <option>option 3</option>
        </select>
      </div>

      {/* Images upload */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center">
          <label className="text-lg font-medium text-gray-700 mr-2">
            Images
          </label>
          <div className="flex items-center justify-center rounded-lg">
            <label
              htmlFor="fileInput"
              className="flex items-center gap-1.5 px-3 py-2 text-center text-sm font-medium text-gray-500 border cursor-pointer hover:border-primary-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
              </svg>
              Upload
            </label>
            <input
              id="fileInput"
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={uploadImages}
            />
          </div>
        </div>

        {/* Spinner during upload */}
        <div className="grid grid-cols-2 items-center rounded">
          {isUploading && (
            <Spinner className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          )}
        </div>

        {/* Display uploaded images */}
        {!isUploading && (
          <div className=" grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-2">
            <ReactSortable
              list={images}
              setList={updateImagesOrder}
              className="w-[350px] h-auto  gap-2 flex  justify-between align-items-center"
            >
              {images?.map((link, index) => (
                <div key={link} className="relative group">
                  <img
                    src={link}
                    alt="image"
                    className="object-cover h-32 w-44 rounded-md border p-2 cursor-pointer transition-transform transform-gpu group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 cursor-pointer opacity-0 group-hover:opacity-100">
                    <button onClick={() => handleDeleteImage(index)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 text-orange-600 bg-white rounded-full"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </ReactSortable>
          </div>
        )}
      </div>

      {/* Description input */}
      <div className="grid grid-cols-2 items-center my-4">
        <label className="col-span-1 block text-lg font-medium text-gray-700 mb-3">
          Description
        </label>
        <div className="col-span-2">
          <textarea
            type="text"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 border p-3"
            placeholder="Description about the product"
            rows={6}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      {/* Price input */}
      <div className="grid grid-cols-2 items-center my-4">
        <label className="col-span-1 block text-lg font-medium text-gray-700 mb-3">
          Price
        </label>
        <div className="col-span-2">
          <input
            type="number"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 border p-3"
            placeholder="Price"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Save button */}
      <div className="items-center my-4">
        <div className="col-span-2 col-start-2">
          <button
            type="submit"
            className="rounded-lg border border-slate-500 bg-primary-500 px-5 py-2.5 text-center text-sm font-medium text-black shadow-sm transition-all hover:border-primary-700 hover:bg-primary-700 focus:ring focus:ring-primary-200 disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300"
          >
            Save Product
          </button>
        </div>
      </div>
    </form>
  );
}
