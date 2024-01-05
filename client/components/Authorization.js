import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const getUser = async (googleId) => {
    try {
      const response = await fetch(`http://localhost:3000/signin/${googleId}`);
      const data = await response.json();
      console.log('Response from getUser:', data);
      if (response.ok) {
        return data;
      }
    } catch (error) {
      console.error('Error during user verification:', error);
      throw error;
    }
  };

  const signInUser = (username, password) => {
    console.log(username, password);
    const body = { username, password };
    console.log('body is', body);
    return fetch(`http://localhost:3000/login/no-oauth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .catch((err) => err);
  };

  const createUser = (newUser) => {
    console.log('in authorization.js, new user is ', newUser);
    return fetch(`http://localhost:3000/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (userData) => {
    console.log('updating user: ', userData);
    setUser(userData);
  };

  const fetchDogs = (userId) =>
    fetch(`http://localhost:3000/fetchDogs/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));

  const deleteDog = (dogId) =>
    fetch(`http://localhost:3000/deleteDog/${dogId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));

  const addDog = (dogData) =>
    fetch(`http://localhost:3000/addDog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dogData),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));

  return (
    <AuthContext.Provider
      value={{
        user,
        getUser,
        createUser,
        logout,
        updateUser,
        signInUser,
        addDog,
        fetchDogs,
        deleteDog,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
