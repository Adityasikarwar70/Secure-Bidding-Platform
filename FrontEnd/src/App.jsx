import { RouterProvider } from "react-router-dom";
import routes from "./Routes/routes";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { gsap } from "gsap";

function App() {

   useEffect(() => {
    const counter = { value: 0 };

    const tl = gsap.timeline();

    tl.to(counter, {
      value: 100,
      duration: 1,
      ease: "power1.out",
      onUpdate: () => {
        document.querySelector(".counter").innerText =
          Math.floor(counter.value);
      },
    })
    .to({}, { duration: 0.2 })
    .to(".page-reveal", {
      x: "100%",
      duration: 1.1,
      ease: "power4.inOut",
    }).to(
      ".app-content",
      {
        x: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
      },
      "-=0.6"
    ).set(".page-reveal", { display: "none" });




  }, []);
  
  return (
    <div className="startup">
      <div className="page-reveal">
        <div className="counter">0</div>
      </div>
  <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
          }}
        />
      <RouterProvider router={routes} />
    </div>
  );
}

export default App;
