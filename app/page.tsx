import React from "react";
import Navbar from "./Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen">
      <Navbar />
      <div>
        <div className="  bg-sky-400 text-gray-800">
          <div className="flex flex-col items-center h-screen justify-center max-w-3xl mx-auto overflow-hidden rounded">
            <Image
              src={
                "https://img.freepik.com/vector-gratis/mapa-global-mundial-aislado-sobre-fondo-blanco_1017-45835.jpg"
              }
              width={1500}
              height={1500}
              alt="logo-main"
              className="rounded-xl"
            />
            <div className="p-6 pb-12 m-4 mx-auto -mt-16 text-center space-y-6 lg:max-w-2xl sm:px-10 sm:mx-12 lg:rounded-md bg-sky-500/50 hover:bg-sky-500 duration-200">
              <div className="space-y-2">
                <a
                  rel="noopener noreferrer"
                  href="#"
                  className="inline-block text-2xl font-semibold sm:text-3xl"
                >
                  Explora el Mundo a tu Manera
                </a>
                <p className="text-xs dark:text-gray-600 flex  justify-center gap-1">
                  By
                  <a
                    rel="noopener noreferrer"
                    href="#"
                    className="text-xs hover:underline"
                  >
                    Jose Caceres
                  </a>
                </p>
              </div>
              <div className="text-gray-800 text-justify">
                <p>
                  App-Maps te ofrece una vista clara y personalizada de
                  cualquier lugar del mundo. Con herramientas avanzadas para
                  ajustar capas, guardar ubicaciones y recibir alertas en tiempo
                  real, tu navegación será más eficiente y adaptada a tus
                  necesidades.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
