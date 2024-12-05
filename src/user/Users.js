import React from "react";
import { Link } from "react-router-dom";
import "../assest/css/main.css"; // Custom CSS
import { IsAuthenticated } from "../auth";

const Users = () => {
  const [users, setUsers] = React.useState([]);
  const isAuthenticated = IsAuthenticated();

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
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

          const filteredUsers = data.users.filter(
            (user) => user._id !== isAuthenticated.user._id 
          );
          setUsers(filteredUsers.slice(0, 5)); // Limit to the first 5 users
        }
      } catch (err) {
        console.error("Network error:", err);
      }
    };

    fetchUsers();
  }, []);

  // Handle Add Friend
  const handleAddFriend = async (targetUserId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/connection/${targetUserId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${isAuthenticated.token}`, // Auth token
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log(`Successfully added connection with user ID: ${targetUserId}`);
        alert("Friend added successfully!");
      } else {
        console.error("Error adding friend:", data.error || "Unknown error");
        alert(data.error || "Failed to add friend.");
      }
    } catch (err) {
      console.error("Network error:", err.message);
      alert("An error occurred while adding the friend.");
    }
  };

  return (
    <div className="col-md-3">
      <div className="follow-card">
        <h3>Who to follow</h3>
        {users.length > 0 ? (
          users.map((user) => (
            <div className="user" key={user.email}>
              <img
                src="https://via.placeholder.com/50"
                alt={user.name}
              />
              <div className="info">
                <h4>{user.name}</h4>
                {/* <p>{user.email}</p> */}
                <p>{new Date(user.createddate).toDateString()}</p>
              </div>
              <div
                className="action"
                onClick={() => handleAddFriend(user._id)} // Add friend on click
                style={{ cursor: "pointer" }} // Make it look clickable
              >
                <i className="fas fa-plus"></i>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No users found.</p>
        )}
        <Link to="/all-users" className="view-more">
          View more
        </Link>
      </div>
    </div>
  );
};

export default Users;
