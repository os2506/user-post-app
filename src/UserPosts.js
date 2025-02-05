import React, { useEffect, useState, useMemo, useRef } from 'react';
import axios from 'axios';
import { useUserContext } from './UserContext';

export default function UserPosts({ setSelectedPost }) {
  const { state, dispatch } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '', imagePath: '' }); // Include imagePath in state
  const [image, setImage] = useState(null); // State to hold the image file
  const prevUserRef = useRef(null);

  useEffect(() => {
    if (state.selectedUser && state.selectedUser.id !== prevUserRef.current) {
      setLoading(true);
      axios.get(`http://localhost:8080/api/posts`, { params: { userId: state.selectedUser.id } })
        .then(({ data }) => {
          dispatch({ type: 'SET_POSTS', payload: data });
          setLoading(false);
          prevUserRef.current = state.selectedUser.id;
        })
        .catch(error => {
          console.error("Error fetching posts:", error);
          setLoading(false);
        });
    }
  }, [state.selectedUser, dispatch]);

  const postCount = useMemo(() => state.posts.length, [state.posts]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file); // Update state with the selected image
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:8080/api/posts`, { params: { postId } });
      dispatch({
        type: 'SET_POSTS',
        payload: state.posts.filter(post => post.id !== postId)
      });
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  
  
  const handleCreatePost = async (e) => {
    e.preventDefault();
  
    // Ensure title and body are filled in, but allow for image to be optional
    if (!newPost.title || !newPost.body) return;
  
    const formData = new FormData();
    formData.append("title", newPost.title); // Append the title
    formData.append("body", newPost.body);   // Append the body
    formData.append("userId", state.selectedUser.id); // Append the userId
  
    // Only append the file if it's selected (optional)
    if (image) {
      formData.append("file", image);  // Append the selected image file
    }
  
    try {
      const { data: createdPost } = await axios.post('http://localhost:8080/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Ensure the content type is set to multipart/form-data
        }
      });
  
      // Dispatch the created post to the state
      dispatch({ type: 'SET_POSTS', payload: [...state.posts, createdPost] });
  
      // Reset the form fields
      setNewPost({ title: '', body: '', imagePath: '' });
      setImage(null);  // Clear the image input after the post is created
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // Handle editing an existing post
  const handleEditPost = async (post) => {
    setSelectedPost(post); // Set the selected post for editing
    setNewPost({ 
      title: post.title, 
      body: post.body, 
      imagePath: post.imagePath || ''  // Set the current image path (if available)
    });
    setImage(null); // Clear any previously selected image for editing
  };

  

  if (!state.selectedUser) {
    return <p className="text-muted"> Select a user to see Information & Posts!! </p>;
  }


  return (
    <div className="container mt-4" style={{ fontSize: '0.85rem', padding: '0.25rem 0.5rem' }}>
    <div className="row">
      {/* Left Column - User Information */}
      <div className="col-md-6">
        <h3><span style={{ color: '#007bff' }}>User Information </span></h3>
        <div className="card mb-4">
          <div className="card-body" style={{ fontSize: '0.85rem', padding: '0.25rem 0.5rem' }}>
            <h5 className="card-title">Personal Details</h5>
            <p className="card-text"><strong>Name:</strong> {state.selectedUser.name}</p>
            <p className="card-text"><strong>Email:</strong> {state.selectedUser.email}</p>
            <p className="card-text"><strong>Phone:</strong> {state.selectedUser.phone}</p>
            <p className="card-text"><strong>Website:</strong> {state.selectedUser.website}</p>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Address</h5>
            <p className="card-text"><strong>Street:</strong> {state.selectedUser.address.street}</p>
            <p className="card-text"><strong>City:</strong> {state.selectedUser.address.city}</p>
            <p className="card-text"><strong>ZipCode:</strong> {state.selectedUser.address.zipcode}</p>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Company</h5>
            <p className="card-text"><strong>Name:</strong> {state.selectedUser.company.name}</p>
            <p className="card-text"><strong>Catch-Phrase:</strong> {state.selectedUser.company.catchPhrase}</p>
          </div>
        </div>
      </div>

      {/* Right Column - Posts */}
      <div className="col-md-6">
        <div className="card mb-4">
          <div className="card-body">
            <h4 className="card-title">
                Posts by <span style={{ color: '#007bff' }}>{state.selectedUser.name}</span>
            </h4>
            <p>
                Total Posts: <span style={{ color: 'red' }}>{postCount}</span>
            </p>

            
          </div>
        </div>

          {/* Form to Create New Post */}
{/* Form to Create or Edit Post */}
<form onSubmit={handleCreatePost}>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Title"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
            <textarea
              className="form-control mb-2"
              placeholder="Body"
              value={newPost.body}
              onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            />
            {/* Image Input */}
            <input
              type="file"
              className="form-control mb-2"
              onChange={handleImageChange} // Handle image selection
            />
            {newPost.imagePath && !image && (
              <div>
                <img src={`http://localhost:8080/${newPost.imagePath}`} alt="Current" width="100" />
              </div>
            )}
            <button type="submit" className="btn btn-primary btn-sm">
              {newPost.imagePath ? "Update Post" : "Add Post"}
            </button>
          </form>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="list-group mt-3">
                {state.posts.map(post => (
                    <li key={post.id} className="list-group-item d-flex justify-content-between align-items-center p-2">
                        <div>
                            <strong>{post.title}</strong>
                            <br />
                            {post.imagePath && <img src={`http://localhost:8080/${post.imagePath}`} alt="Post" width="50" />}
                        </div>
                        <button
                            className="btn btn-warning btn-sm"
                            onClick={() => setSelectedPost(post)} // Set the selected post for editing
                        >
                            Edit
                        </button>
                        <button
                            className="btn btn-danger btn-sm ml-2"
                            onClick={() => handleDeletePost(post.id)}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

          )}
        </div>
      </div>
    </div>
  );
}
