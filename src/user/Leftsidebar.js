import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import avatar from "../assest/avatar7.png";
import "../assest/css/main.css"; // Custom CSS
import Swal from "sweetalert2";
import { IsAuthenticated } from "../auth";


const Leftsidebar = ({ user = {}, onSignout }) => {
   const isAuthenticated = IsAuthenticated();
   const [postCount, setPostCount] = useState(0); // State for post count
   const [connectionsCount, setConnectionsCount] = useState(0); // State for total connections

   useEffect(() => {
    // Fetch post count
    const fetchPostCount = async () => {
      try {
        console.log("Fetching posts");
        const response = await fetch(`${process.env.REACT_APP_API_URL}/posts/by/${user._id}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${isAuthenticated.token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          console.log("Post count fetched");
          const postsArray = Array.isArray(data) ? data : Object.values(data);
          setPostCount(postsArray.length || 0); // Update post count
        } else {
          console.error(data.error || "Failed to fetch posts count");
        }
      } catch (err) {
        console.error("Error fetching posts count:", err.message);
      }
    };

    // Fetch connections count
    const fetchConnectionsCount = async () => {
      try {
        console.log("Fetching connections");
        const response = await fetch(`${process.env.REACT_APP_API_URL}/connections/${user._id}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${isAuthenticated.token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          console.log("Connections fetched:", data);
          console.log(data.length)
          setConnectionsCount(data.length || 0); // Update connections count
        } else {
          console.error(data.error || "Failed to fetch connections count");
        }
      } catch (err) {
        console.error("Error fetching connections count:", err.message);
      }
    };

    if (user._id) {
      fetchPostCount();
      fetchConnectionsCount();
    }
  }, [user._id, isAuthenticated.token]);

  if (!user || Object.keys(user).length === 0) {
    return <div>Loading Sidebar...</div>;
  }

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action will delete your profile!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${user._id}`, {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${isAuthenticated.token}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            Swal.fire("Deleted!", data.message || "Your account has been deleted.", "success");
            localStorage.removeItem("token");
            onSignout(); // Sign out the user
          } else {
            Swal.fire("Error!", data.error || "Failed to delete account.", "error");
          }
        } catch (err) {
          Swal.fire("Error!", "Network error: " + err.message, "error");
        }
      }
    });
  };    

  return (
    <div className="col-md-3">
      <div className="profile-card">
        <div className="cover-photo"></div>
        <img src={avatar} alt="Profile Photo" className="profile-photo" />
        <h2>{user.name}</h2>
        <p>Joined:</p>
        <p>{new Date(user.createddate).toDateString()}</p>
        <div className="stats">
          <div>
            <span>{postCount}</span> Post
          </div>
          <div>
            <span>{connectionsCount}</span> Followers
          </div>
          <div>
            <span>{connectionsCount}</span> Following
          </div>
        </div>
        <ul>
          <li>
            <i className="fas fa-home"></i> 
            <Link
              className="text-dark text-decoration-none"
              to="/"
            >
              Feed
            </Link>
          </li>
          <li>
            <Link
              className="text-dark text-decoration-none"
              to={`/connections/${user._id}`}
            >
            <i className="fas fa-user-friends"></i> Connections                         
            </Link>
          </li>
          <li className="disabled">
            <i className="fas fa-globe"></i> Latest News
          </li>
          <li className="disabled">
            <i className="fas fa-calendar-alt"></i> Events
          </li>
          <li className="disabled">
            <i className="fas fa-users"></i> Groups
          </li>
          <li className="disabled">
            <i className="fas fa-bell text-red"></i> Notifications
          </li>
          <li>        
            <Link
              className="text-dark text-decoration-none"
              to={`/user/edit/${user._id}`}
            >
              <i className="fas fa-cog"></i> Edit Profile
            </Link>
          </li>    
          <li>
            <i className="fas fa-trash"></i>{" "}
            <a onClick={handleDelete} style={{ cursor: "pointer" }}>
              Delete my profile
            </a>
          </li>  
          <li>
       
            <i className="fas fa-sign-out-alt"></i>{" "}
            <a
              onClick={onSignout}
              style={{ cursor: "pointer" }}
            >
              Signout
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Leftsidebar;
