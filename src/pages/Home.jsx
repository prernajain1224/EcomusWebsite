import logo from "../logo.svg";
import "../App.css";
import TopSlider from "../components/HomeSection/TopSlider";
import ShopCategories from "../components/HomeSection/ShopCategories";
import FeaturedCollections from "../components/HomeSection/FeaturedCollections";
import ProductTabs from "../components/HomeSection/ProductTabs";
import BannerSlider from "../components/HomeSection/BannerSlider";
import IconBoxSlider from "../components/HomeSection/IconBoxSlider";
import Marquee from "../components/HomeSection/Marquee";
import CustomerReviews from "../components/HomeSection/CustomerReviews";
import OurValues from "../components/HomeSection/OurValues";
import { Link } from "react-router-dom";
import HomeFeaturedCollection from "../components/HomeSection/HomeFeaturedCollection";

const Home = () => {
  return (
    <>
      <TopSlider />
      <ShopCategories />

      <FeaturedCollections />
      <ProductTabs />
      <IconBoxSlider />
      <Marquee />
      {/* <HomeFeaturedCollection /> */}
      <CustomerReviews />
      <OurValues />
    </>
  );
};

export default Home;
