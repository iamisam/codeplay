import logo from "../../assets/programming.png";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <div className="flex flex-row justify-between font-outfit font-semibold items-center p-1 bg-[#001834]">
      <div className="flex flex-row mr-2 ml-2">
        <Link to={"/"} className="flex flex-row mr-2">
          <img className="h-10 w-10 rounded-full mr-2" src={logo} alt="Logo" />
          <span className="text-xl font-bold text-white mt-1">CodeWars</span>
        </Link>
      </div>
      <ul className="flex text-white justify-between items-center">
        <Link to={"/"}>
          <li className="m-5 cursor-pointer text-xl">Home</li>
        </Link>
      </ul>
      <div className="mr-20 flex">
        <Link to={"/connect"}>
          <div className="flex flex-row cursor-pointer not-hover:bg-[#ddd] text-black p-1 rounded-full hover:shadow-sm hover:shadow-white hover:bg-[#fff] justify-between items-center">
            <button className="mr-1 flex justify-between items-center m-1 cursor-pointer">
              Connect&nbsp;
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
