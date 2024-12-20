import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Core/Home";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import Profile from "./user/profile";
import AllUsers  from "./user/AllUsers";
import Connections  from "./user/Connections";
import UserProfile from "./user/UserProfile";
import EditProfile from "./user/EditProfile";
import Explorer from "./Allposts/Explorer";
import Postdetails from "./post/postdetails";


import Menu from "./Core/Menu";

const MainRouter = () => {
  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/user/:userId" element={<Profile />} />
        <Route path="/all-users" element={<AllUsers  />} />
        <Route path="/connections/:userId" element={<Connections  />} />
        <Route path="/user/profile/:id" element={<UserProfile />} />
        <Route path="/user/edit/:userId" element={<EditProfile />} />
        <Route path="/explorer" element={<Explorer />} />
        <Route path="/postdetails/:postId" element={<Postdetails />} />
      </Routes>
    </BrowserRouter>
  );
};

export default MainRouter;
