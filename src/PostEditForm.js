import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserContext } from './UserContext';


export default function PostEditForm({ post, onSave, onCancel }) {
 const [refreshKey, setRefreshKey] = useState(0);
  const { state, dispatch } = useUserContext();
  const [editedPost, setEditedPost] = useState({
    id: null,
    title: '',
    body: '',
    imagePath: '', // Initialize with an empty string for imagePath
  });

  const [image, setImage] = useState(null); // State to store the selected image

  useEffect(() => {
    if (post) {
      setEditedPost({
        id: post.id,
        title: post.title,
        body: post.body,
        imagePath: post.imagePath || '', // Set imagePath if it exists in the post
      });
    }
  }, [post]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    setImage(file); // Store the file itself in state
    setEditedPost((prevPost) => ({
      ...prevPost,
      imagePath: file, // Update the imagePath with the file object
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', editedPost.title);
    formData.append('body', editedPost.body);

    if (image) {
      formData.append('file', image); // Append the image file
    } else if (editedPost.imagePath && typeof editedPost.imagePath === 'string') {
      formData.append('imagePath', editedPost.imagePath); // Append the image path (string)
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/posts/${editedPost.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

          // After successfully updating the post, update the state
          const updatedPost = response.data;

          // Dispatch the action to update the post in the state
          dispatch({
              type: 'SET_POSTS',
              payload: state.posts.map((post) =>
                  post.id === updatedPost.id ? updatedPost : post // Update the specific post
              ),
          });
  

          onSave(updatedPost); // Pass updated post back to parent

        // After successful update, force re-render
        setRefreshKey(prevKey => prevKey + 1);
          
      onCancel(); // Close form after saving
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <div className="col-md-7">
      <div
        className="card mt-4 w-100"
        style={{ fontSize: '0.85rem', padding: '0.25rem 0.5rem' }}
      >
        <div className="card-body">
          <h5 className="card-title">Edit Post</h5>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                name="title"
                value={editedPost.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group w-100">
              <textarea
                className="form-control"
                name="body"
                value={editedPost.body}
                onChange={handleInputChange}
                rows="6"
              />
            </div>

            <div className="form-group">
              {editedPost.imagePath && typeof editedPost.imagePath === 'string' && (
                <div>
                  <h6>Current Image:</h6>
                  <img
                    src={`http://localhost:8080/${editedPost.imagePath}`}
                    alt="Current Post"
                    style={{ maxWidth: '100%', maxHeight: '200px' }}
                  />
                </div>
              )}
              <input
                type="file"
                className="form-control mb-2"
                name="imagePath"
                onChange={handleImageChange}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-sm">
              Save
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm ml-2"
              onClick={onCancel}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
