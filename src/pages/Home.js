import logo from "../logo.svg";
import "../App.css";
import TopSlider from "../components/HomeSection/TopSlider";
import ShopCategories from "../components/HomeSection/ShopCategories";
import MasonryCollection from "../components/HomeSection/MasonryCollection";
import ProductTabs from "../components/HomeSection/ProductTabs";
import BannerSlider from "../components/HomeSection/BannerSlider";
import IconBoxSlider from "../components/HomeSection/IconBoxSlider";
import HalloweenCollection from "../components/HomeSection/HalloweenCollection";
import Marquee from "../components/HomeSection/Marquee";
import CustomerReviews from "../components/HomeSection/CustomerReviews";
import Brand from "../components/HomeSection/Brand";
const Home = () => {
  return (
    <>
      <TopSlider />
      <ShopCategories />
      <MasonryCollection />
      <ProductTabs />
      <BannerSlider />
      <IconBoxSlider />
      <Marquee />

      <HalloweenCollection />
      <CustomerReviews />
      <Brand />
    </>
  );
};

export default Home;
