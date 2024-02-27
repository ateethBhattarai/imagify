"use client";

import axios from "axios";
import Image from "next/image";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

interface Image {
  id: string;
  urls: { small: string };
  alt_description: string;
}

const API =
  "https://api.unsplash.com/search/photos?page=1&query=office&client_id=IKYbVez4_bnLaHQiIah09coKieD5SQTS49K5qy1PoGk";

export default function Home() {
  const searchData = useRef<null | HTMLInputElement>(null);
  const [data, setData] = useState<Image[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const getImageData = useCallback(async () => {
    if (searchData.current?.value) {
      try {
        const { data } = await axios.get(
          `https://api.unsplash.com/search/photos?page=${pageNumber}&query=${searchData.current.value}&client_id=IKYbVez4_bnLaHQiIah09coKieD5SQTS49K5qy1PoGk`
        );
        setData(data.results);
        setTotalPages(data.total_pages);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage("Error fetching the images. Try again later.");
        console.log(error);
      }
    }
  }, [pageNumber]);

  useEffect(() => {
    getImageData();
  }, [getImageData, pageNumber]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPageNumber(1);
    getImageData();
  };
  return (
    <main className="text-center">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="border-1 border-gray-700 px-2 max-sm:mb-4 text-gray-900 border-2 h-10 w-2/4 rounded-xl"
          id="imageSearch"
          placeholder="Image Name Here"
          ref={searchData}
        />

        <button
          type="submit"
          className="mx-4 bg-gray-400 py-3 px-4 rounded-lg text-white"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-4 my-8 items-center justify-evenly">
        {errorMessage && (
          <h1 className="text-red-500 font-semibold text-2xl">
            {errorMessage}
          </h1>
        )}

        {data?.map((data) => (
          <Image
            className="rounded-md h-auto w-auto"
            key={data.id}
            src={data.urls.small}
            alt={data.alt_description || "image"}
            height={50}
            width={250}
          />
        ))}
      </div>
      <div className="flex gap-4 items-center justify-center">
        {pageNumber > 1 && (
          <button onClick={() => setPageNumber((prev) => prev - 1)}>
            Previous
          </button>
        )}
        {pageNumber < totalPages && (
          <button onClick={() => setPageNumber((prev) => prev + 1)}>
            Next
          </button>
        )}
      </div>
    </main>
  );
}
