import React, { useEffect, useState } from "react";
import { IsAuthenticated } from "../auth";

const UserPosts = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Track the current page
  const [hasMore, setHasMore] = useState(true); // Track if there are more posts to load
  const isAuthenticated = IsAuthenticated();

  const fetchUserPosts = async (currentPage) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/posts/by/${userId.replace(":","")}?page=${currentPage}&limit=5`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${isAuthenticated.token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setPosts((prevPosts) => [...prevPosts, ...data.posts]); // Append new posts
        setHasMore(data.currentPage < data.totalPages); // Check if more pages are available
      } else {
        setError(data.error || "Failed to fetch posts.");
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts(page); // Fetch posts for the initial page
  }, [page]);

  const loadMorePosts = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1); // Load the next page
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading posts...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div>
      <h5 className="text-center">My Posts</h5>
      {posts.map((post) => (
        <div className="feed" key={post._id}>
          <div className="post-card">
            <h5 className="mt-3">{post.title}</h5>
            <img
              src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
              alt={post.title}
              onError={(i) => (i.target.src = `https://via.placeholder.com/150`)}
              className="card-img-top"
            />
            <p className="mt-3 mb-5">{post.body}</p>
          </div>
          <button className="btn btn-outline-primary btn-sm mx-3">Like</button>
          <button className="btn btn-outline-secondary btn-sm">Comment</button>
        </div>
      ))}
      {hasMore && (
        <div className="text-center mt-3">
          <button onClick={loadMorePosts} className="btn btn-primary">
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default UserPosts;
