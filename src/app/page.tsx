"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Image from "next/image";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Logo from "./favicon.ico";

interface Image {
  id: string;
  urls: { small: string };
  alt_description: string;
}

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
          `https://api.unsplash.com/search/photos?page=${pageNumber}&query=${searchData.current.value}&client_id=${process.env.ACCESS_KEY}`
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
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-4 items-center justify-center my-4"
      >
        <div className="sm:mr-auto flex items-center">
          <Image src={Logo} alt="logo" width={35} />
          <p className="text-orange-400 font-semibold text-2xl">Imagify</p>
        </div>
        <Input
          type="text"
          className="max-w-sm"
          id="imageSearch"
          placeholder="Type Image to search..."
          ref={searchData}
        />

        <Button type="submit">Search</Button>
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

      {data.length == 0 && (
        <div>
          <h1 className="text-orange-400 font-semibold text-2xl">
            Searched image appear here.
          </h1>
        </div>
      )}

      <div className="flex gap-4 items-center justify-center">
        {pageNumber > 1 && (
          <Button onClick={() => setPageNumber((prev) => prev - 1)}>
            Previous
          </Button>
        )}
        {pageNumber < totalPages && (
          <Button onClick={() => setPageNumber((prev) => prev + 1)}>
            Next
          </Button>
        )}
      </div>
    </main>
  );
}
