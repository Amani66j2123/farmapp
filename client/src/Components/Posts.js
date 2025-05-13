import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPosts, likePost, dislikePost } from "../Features/PostSlice";
import { Table } from "reactstrap";
import moment from "moment";
import { FaHeart, FaRegHeart, FaThumbsDown, FaRegThumbsDown } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Posts = () => {
  const posts = useSelector((state) => state.posts.posts);
  const loading = useSelector((state) => state.posts.loading);
  const email = useSelector((state) => state.users.user.email);
  const userId = useSelector((state) => state.users.user._id);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  const handleLikePost = (postId, e) => {
    e.preventDefault();
    const postData = { postId, userId };
    dispatch(likePost(postData));
  };

  const handleDislikePost = (postId, e) => {
    e.preventDefault();
    const postData = { postId, userId };
    dispatch(dislikePost(postData));
  };

  if (loading) {
    return <div className="text-center py-4">Loading posts...</div>;
  }

  return (
    <div className="posts-container p-3">
      <Table bordered hover responsive className="post-table">
        <thead className="table-header">
          <tr>
            <th width="20%">User</th>
            <th width="40%">Suggestions</th>
            <th width="20%">Likes</th>
            <th width="20%">Dislikes</th>
          </tr>
        </thead>
        <tbody>
          {posts?.map((post) => {
            const isLiked = post.likes?.users?.includes(userId);
            const isDisliked = post.dislikes?.users?.includes(userId);
            return (
              <tr key={post._id} className="post-row">
                <td>
                  <div className="user-email">{post.email}</div>
                  <div className="post-time text-muted small">
                    {moment(post.createdAt).fromNow()}
                  </div>
                </td>
                <td className="post-message">{post.postMsg}</td>
                <td className="text-center">
                  <button
                    onClick={(e) => handleLikePost(post._id, e)}
                    className="like-button btn btn-link p-0"
                  >
                    {isLiked ? (
                      <FaHeart className="text-danger" />
                    ) : (
                      <FaRegHeart className="text-secondary" />
                    )}
                    <span className="ms-2">{post.likes?.count || 0}</span>
                  </button>
                </td>
                <td className="text-center">
                  <button
                    onClick={(e) => handleDislikePost(post._id, e)}
                    className="dislike-button btn btn-link p-0"
                  >
                    {isDisliked ? (
                      <FaThumbsDown className="text-primary" />
                    ) : (
                      <FaRegThumbsDown className="text-secondary" />
                    )}
                    <span className="ms-2">{post.dislikes?.count || 0}</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default Posts;