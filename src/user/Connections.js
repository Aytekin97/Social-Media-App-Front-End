import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assest/css/main.css"; // Custom CSS
import { IsAuthenticated } from "../auth";

const Connections = () => {
  const [users, setUsers] = useState([]);
  const isAuthenticated = IsAuthenticated();
  const [connections, setConnections] = React.useState([]); // Current user's connections

  // Fetch connections
  const fetchConnections = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/connections/${isAuthenticated.user._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${isAuthenticated.token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Fetched connections:", data);
        return data.map((connection) => {
          // Return IDs of connected users
          return connection.user1._id === isAuthenticated.user._id
            ? connection.user2._id
            : connection.user1._id;
        });
      } else {
        console.error("Failed to fetch connections:", data.error);
        return [];
      }
    } catch (err) {
      console.error("Error fetching connections:", err.message);
      return [];
    }
  };

  // Fetch all users and filter by connections
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch connections first
        const connectionsIds = await fetchConnections();
        setConnections(connectionsIds); // Store connections in state

        // Fetch all users
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (data.error) {
          console.error("Error fetching users:", data.error);
        } else {
          // Exclude current user and already connected users
          const filteredUsers = data.users.filter(
            (user) =>
              user._id !== isAuthenticated.user._id && // Exclude the current user
              !connectionsIds.includes(user._id) // Exclude connected users
          );

          setUsers(filteredUsers.slice(0, 5)); // Limit to the first 5 users
        }
      } catch (err) {
        console.error("Network error:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mt-4">
      <h2>All Users</h2>
      <div className="row">
        {users.length > 0 ? (
          users.map((user) => (
            <div className="col-md-4 mb-4" key={user._id}>
              <div className="card shadow-sm">
                <img
                  src="https://via.placeholder.com/150"
                  alt={user.name}
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title">{user.name}</h5>
                  <p className="card-text">{user.email}</p>
                  <p className="text-muted">
                    Joined: {new Date(user.createddate).toDateString()}
                  </p>
                  <Link className={({ isActive }) =>
                      isActive ? "btn btn-primary btn-sm mt-2 active" : "btn btn-primary btn-sm mt-2"
                    }  to={`/user/profile/${user._id}`}>
                        view profile
                      </Link>   
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default Connections;