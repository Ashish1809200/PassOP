import { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";

const Manager = () => {
  const ref = useRef();
  const passwordRef = useRef();
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);

  const getPasswords = async () => {
    const req = await fetch("http://localhost:3000");
    let passwords = await req.json();
    setPasswordArray(passwords);
  };
  useEffect(() => {
    getPasswords();
  }, []);

  const showPassword = () => {
    if (ref.current.src.includes("icons/closed-eye.webp")) {
      ref.current.src = "icons/eye.webp";
      passwordRef.current.type = "text";
    } else {
      ref.current.src = "icons/closed-eye.webp";
      passwordRef.current.type = "password";
    }
  };

  const savePassword = async () => {
    if (
      form.site.length > 3 &&
      form.username.length > 3 &&
      form.password.length > 3
    ) {
      try {
        await fetch("http://localhost:3000", {
          method: "delete",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: form.id }),
        });
        let res = await fetch("http://localhost:3000", {
          method: "POST",

          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, id: uuidv4() }),
        });
        if (res.ok) {
          setPasswordArray([...passwordArray, { ...form, id: uuidv4() }]);
          setForm({ site: "", username: "", password: "" });
          toast("Password Saved!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          toast("Error : Password not saved", {
            theme: "dark",
          });
        }
      } catch (error) {
        console.error("Error saving password:", error);
        toast("Error: Failed to save password", {
          theme: "dark",
        });
      }
    } else {
      toast("Error : Password not saved", {
        theme: "dark",
      });
    }
  };

  const deletePassword = async (id) => {
    let c = confirm("Do you want to delete this password ?");
    if (c) {
      setPasswordArray(passwordArray.filter((item) => item.id !== id));
      let res = await fetch("http://localhost:3000", {
        method: "delete",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        toast("Password Deleted!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    }
  };
  const editPassword = (id) => {
    setForm(passwordArray.filter((item) => item.id === id)[0]);
    setPasswordArray(passwordArray.filter((item) => item.id !== id));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {/* Same as */}
      <ToastContainer />
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold">
          <span className="text-green-700">&lt; </span>
          Pass
          <span className="text-green-700">OP / &gt;</span>
        </h1>
        <p className="text-green-900 text-lg font-semibold">
          Your own password manager
        </p>
        <div className="flex flex-col text-black p-4 gap-4 items-center">
          <input
            type="text"
            className="rounded-full border border-green-700 w-full px-4 py-1"
            value={form.site}
            onChange={handleChange}
            name="site"
            placeholder="Enter website URL"
          />
          <div className="flex flex-col md:flex-row w-full justify-between gap-4">
            <input
              type="text"
              className="rounded-full border flex-1 border-green-700 px-4 py-1"
              value={form.username}
              onChange={handleChange}
              name="username"
              placeholder="Enter UserName"
            />
            <div className="relative">
              <input
                ref={passwordRef}
                type="password"
                className="rounded-full border w-full border-green-700 px-4 py-1"
                value={form.password}
                onChange={handleChange}
                name="password"
                placeholder="Enter Password"
              />
              <span
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={showPassword}
              >
                <img ref={ref} className="w-6" src="icons/closed-eye.webp" />
              </span>
            </div>
          </div>

          <button
            onClick={savePassword}
            className="flex justify-center items-center rounded-full bg-green-400 px-4 py-1 w-fit hover:bg-green-300 font-semibold border border-green-900"
          >
            <lord-icon
              src="https://cdn.lordicon.com/jgnvfzqg.json"
              trigger="hover"
            ></lord-icon>
            Save
          </button>
        </div>

        <div className="passwords px-2 md:px-0">
          <h2 className="text-left text-2xl font-bold py-4">Your Passwords</h2>
          {passwordArray.length === 0 && <div> No passwords to show</div>}
          {passwordArray.length != 0 && (
            <table className="table-auto w-full rounded-md overflow-hidden">
              <thead className="bg-green-600 text-white">
                <tr className="">
                  <th className="py-2">Site</th>
                  <th className="py-2">Username</th>
                  <th className="py-2">Password</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-green-100">
                {passwordArray.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="py-2 text-center border-white">
                        <div className="flex items-center justify-center gap-4 ">
                          <a href={item.site} target="_blank">
                            {item.site}
                          </a>
                          <div
                            className="lordicon-copy size-7 cursor-pointer"
                            onClick={() => copyText(item.site)}
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/iykgtsbt.json"
                              trigger="hover"
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 text-center border-white">
                        <div className="flex items-center justify-center gap-4 ">
                          {item.username}
                          <div
                            className="lordicon-copy size-7 cursor-pointer"
                            onClick={() => copyText(item.username)}
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/iykgtsbt.json"
                              trigger="hover"
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 text-center border-white">
                        <div className="flex items-center justify-center gap-4 ">
                          {item.password}
                          <div
                            className="lordicon-copy size-7 cursor-pointer"
                            onClick={() => copyText(item.password)}
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/iykgtsbt.json"
                              trigger="hover"
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="flex justify-center gap-2">
                        <span
                          className="py-2"
                          onClick={() => {
                            editPassword(item.id);
                          }}
                        >
                          <lord-icon
                            src="https://cdn.lordicon.com/gwlusjdu.json"
                            trigger="hover"
                          ></lord-icon>
                        </span>
                        <span
                          className="py-2"
                          onClick={() => {
                            deletePassword(item.id);
                          }}
                        >
                          <lord-icon
                            src="https://cdn.lordicon.com/skkahier.json"
                            trigger="hover"
                          ></lord-icon>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
