//import { useRef } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Homepage = () => {
  /*const searchVenuesRef = useRef(null);

  const scrollToSearchVenues = () => {
    searchVenuesRef.current.scrollIntoView({ behavior: "smooth" }); // Smooth scroll
  }; */
  return (
    <div>
      {/* <Header1 onScrollToSearchVenues={scrollToSearchVenues} />
      <div ref={searchVenuesRef}>
        <SearchVenue />
      </div> */}
      <ToastContainer />
    </div>
  );
};

export default Homepage;
