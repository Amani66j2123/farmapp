import pic from "./1.jpg";
import pic2 from "./2.jpg";
import pic3 from "./3.jpg";
const Banner = () => {
  return (
    <div className=" ">
      <div className="row">
      <div className="col-md-3  "><img src={pic2} className="bannerImg" alt="" ></img></div>
      <div className="col-md-6">
      <img src={pic} className="bannerImg" alt="" ></img></div>
      <div className="col-md-3"><img src={pic3} className="bannerImg" alt="" ></img></div>
    </div></div>
    
  );
};
export default Banner;
