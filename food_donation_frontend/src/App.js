import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import AddDonation from "./pages/AddDonation";
import Navbar from "./components/Navbar";

function App() {
  const [user, setUser] = useState(null); // Add user state
  
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<SignIn setUser={setUser} />} />{" "}
          {/* Pass setUser */}
          <Route path="/Signup" element={<SignUp />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Profile" element={<Profile user={user} setUser={setUser} />} />
          <Route
            path="/AddDonation"
            element={<AddDonation  />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
