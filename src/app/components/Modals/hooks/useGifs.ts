import { useState } from "react";

const useGifs = () => {
  const [gifCargando, setGifCargando] = useState<boolean>(false);
  const [buscarGifs, setBuscarGifs] = useState<{
    search: string;
    gifs: any[];
  }>({
    search: "",
    gifs: [],
  });

  const manejarGif = async (search: string) => {
    setGifCargando(true);
    try {
      const response = await fetch("/api/giphy", {
        method: "POST",
        body: JSON.stringify({ query: search }),
      });
      const allGifs = await response.json();
      setBuscarGifs((prev) => ({
        ...prev,
        gifs: allGifs?.data?.results,
      }));
    } catch (err: any) {
      console.error(err.message);
    }
    setGifCargando(false);
  };

  return {
    manejarGif,
    buscarGifs,
    setBuscarGifs,
    gifCargando,
  };
};

export default useGifs;
