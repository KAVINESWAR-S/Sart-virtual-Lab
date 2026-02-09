import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

const Header = () => {
  return (
    <div className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">

      {/* Student Info */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">
          Kavineswar
        </h1>
        <p className="text-sm text-gray-500">
          Computer Science Engineering
        </p>
      </div>

      {/* Profile & Logout */}
      <div className="flex items-center gap-4">

        <FaUserCircle 
          size={30} 
          className="text-blue-600 cursor-pointer"
        />

        <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition">
          <FaSignOutAlt />
          Logout
        </button>

      </div>

    </div>
  );
};

export default Header;
