import React, { createContext, useContext, useReducer } from 'react';
import axios from 'axios';

const PostContext = createContext();

const postReducer = (state, action) => {
  switch (action.type) {
    case 'SET_POSTS':
      return { ...state, posts: action.payload };
    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts] };
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === action.payload._id ? action.payload : post
        )
      };
    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload)
      };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const initialState = {
  posts: [],
  categories: [],
  loading: false,
  error: null
};

export const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, initialState);

  const fetchPosts = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await axios.get('/api/posts');
      dispatch({ type: 'SET_POSTS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      dispatch({ type: 'SET_CATEGORIES', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const createPost = async (postData) => {
    try {
      const response = await axios.post('/api/posts', postData);
      dispatch({ type: 'ADD_POST', payload: response.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updatePost = async (id, postData) => {
    try {
      const response = await axios.put(`/api/posts/${id}`, postData);
      dispatch({ type: 'UPDATE_POST', payload: response.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`/api/posts/${id}`);
      dispatch({ type: 'DELETE_POST', payload: id });
    } catch (error) {
      throw error;
    }
  };

  return (
    <PostContext.Provider value={{
      ...state,
      fetchPosts,
      fetchCategories,
      createPost,
      updatePost,
      deletePost
    }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};