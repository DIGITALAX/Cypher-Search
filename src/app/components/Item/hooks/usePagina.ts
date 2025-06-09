import { useEffect, useRef, useState } from "react";
import { PageFlip } from "page-flip";
import { Catalogo } from "../../Common/types/common.types";

const usePagina = (catalogo: Catalogo) => {
  const bookRef = useRef<HTMLDivElement>(null);
  const pageFlipRef = useRef<PageFlip | null>(null);

  useEffect(() => {
    const initializePageFlip = () => {
      if (
        bookRef.current &&
        !pageFlipRef.current &&
        catalogo?.paginas?.length > 0
      ) {
        const padre = document.getElementById("padre");
        if (padre) {
          try {
            pageFlipRef.current = new PageFlip(bookRef.current, {
              width: window.innerWidth > 1200 ? 1000 :  window.innerWidth,
              height:  window.innerWidth > 1200 ? 750 :  window.innerWidth/ 3,
              maxShadowOpacity: 0.5,
              // showCover: true,
              mobileScrollSupport: true,
              showPageCorners: true,
              autoSize: true,
              
            });

            const paginaElements = document.querySelectorAll(".pagina");
            if (paginaElements.length > 0) {
              pageFlipRef.current.loadFromHTML(paginaElements as any);
            } else {
              console.warn("No se encontraron elementos .pagina para cargar.");
            }
          } catch (error) {
            console.error("Error al inicializar PageFlip:", error);
          }
        } else {
          console.warn("Elemento 'padre' no encontrado.");
        }
      }
    };

    const timer = setTimeout(initializePageFlip, 100);

    return () => {
      clearTimeout(timer);
      if (pageFlipRef.current) {
        pageFlipRef.current.destroy();
        pageFlipRef.current = null;
      }
    };
  }, [catalogo]);

  return {
    bookRef,
  };
};

export default usePagina;
