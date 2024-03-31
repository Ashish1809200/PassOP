const Navbar = () => {
  return (
    <nav className="bg-slate-800">
      <div className="container flex justify-between items-center px-4 h-14 text-white mx-auto">
        <div className="logo font-bold text-2xl">
          <span className="text-green-600">&lt; </span>
          Pass
          <span className="text-green-600">OP / &gt;</span>
        </div>

        <button
          className="flex justify-center items-center bg-green-600 rounded-full px-2 text-black ring-2 ring-white"
          href="https://github.com/Ashish1809200"
        >
          <img className="w-10 p-1" src="icons/github.png" alt="github logo" />
          <span className="font-semibold text-xl">Github</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
