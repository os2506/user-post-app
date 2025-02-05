import React, { useState } from 'react';
import { UserProvider } from './UserContext';
import UserList from './UserList';
import UserPosts from './UserPosts';
import PostEditForm from './PostEditForm'; // Import PostEditForm
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  // Lift the selectedPost state up here
  const [selectedPost, setSelectedPost] = useState(null);

  return (
      <UserProvider>
        <div className="container mt-4">
          <h1 className="text-center">Posts API</h1>
          <div className="row">
            <div className="col-md-6">
              <UserList />
              {/* Render PostEditForm directly below UserList */}
              {selectedPost && (
                <PostEditForm 
                  post={selectedPost} 
                  onSave={() => {}} 
                  onCancel={() => setSelectedPost(null)} 
                />
              )}
            </div>
            <div className="col-md-6">
              <UserPosts setSelectedPost={setSelectedPost} />
            </div>
          </div>
        </div>
      </UserProvider>
  );
}
