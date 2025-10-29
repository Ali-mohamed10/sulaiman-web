import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase/firebase.config";

const Navbar = ({ isLogin, setIsLogin }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("isLogin");
        localStorage.removeItem("userName");
        setIsLogin(false);
        navigate("/");
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  };

  const userName = localStorage.getItem("userName") || "";

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        backgroundColor: "#f8f9fa",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <nav>
        <ul
          style={{
            display: "flex",
            flexWrap: "wrap",
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          <li style={{ margin: "0 15px" }} className="bg-blue-500 px-2 py-1 rounded text-white">
            <Link to="/" style={{ textDecoration: "none" }}>
              Home
            </Link>
          </li>
        </ul>
      </nav>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          alignItems: "center",
        }}
      >
        {isLogin && (
          <span style={{ marginRight: "15px", fontWeight: "bold" }}>
            Welcome, {userName}
          </span>
        )}
        {isLogin ? (
          <button
            onClick={handleSignOut}
            style={{
              padding: "5px 10px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Sign Out
          </button>
        ) : (
          <Link
            to="/signup"
            style={{
              padding: "5px 10px",
              backgroundColor: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              whiteSpace: "nowrap",
            }}
          >
            Sign Up
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
