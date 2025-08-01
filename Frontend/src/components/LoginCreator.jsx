

import { useState } from 'react';
import LogoutCreator from './LogoutCreator';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [accessToken, setAccessToken] = useState('');

  const handleLogin = async () => {
    try {
      console.log('Before login request');
      const response = await fetch(`${import.meta.env.VITE_MY_URL}/api/v1/creator/logincreator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email,
          password: password,
        }),
         // include cookies in the request
      });
      console.log('After login request');
      
      if (!response.ok) {
        console.log('Login failed');
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      
      const data = await response.json();
      console.log('Login success', data);
      
      const { accessToken } = data.data;
      console.log('Access Token:', accessToken);
     
      // Set the accessToken in localStorage
      localStorage.setItem('user-info', accessToken);
  
      // You can set the accessToken in your state or context for later use
      // For example, using React context
      setAccessToken(accessToken);
  
      // Display success message
      setSuccessMessage('Login successful!');
  
      // Redirect to another page or update state accordingly
    } catch (error) {
      console.error(error.message);
  
      // Display error message
      setErrorMessage('Login failed. Please check your credentials.');
    }
  };
  

  const handleLogout = async () => {
    try {
      // Make a request to your logout endpoint
      const response = await fetch('http://localhost:8000/api/v1/creator/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('user-info')}`, // Include the accessToken from localStorage
        },
        credentials: 'include', // include cookies in the request
      });
  
      if (!response.ok) {
        // Handle logout failure
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
  
      // Handle logout success
      // Clear the user-info from localStorage
      localStorage.removeItem('user-info');
  
      // Redirect to another page (you can use useHistory hook for this)
    
       window.location.href = "/login"
      // Optionally, you can return something or perform additional actions after logout success
      // return response.json();
    } catch (error) {
      console.error(error.message);
    }
  };
  
  // Example usage:
  // await handleLogout();
  // You can uncomment the history.push("/") line if you are using a router like React Router and want to redirect after logout.
  
  return (
    <div className='bg-emerald-500 w-[25%] rounded-lg p-6'>
      <h2 className='p-6 mx-12 font-bold text-[18px]'>Login</h2>
      <form className='p-2'>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
          className='p-2 mt-2 rounded-md'
        />
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
          className='p-2 mt-2 rounded-md'
        />
        <br />
      <button className='bg-gray-500 p-3 mx-10 w-28 rounded-md mt-6' type="button" onClick={handleLogin}>
          Login
        </button> 
        <button className='bg-red-500 p-3 mx-10 w-28 rounded-md mt-6' type="button" onClick={handleLogout}>
          Logout
        </button> 
    {/* <LogoutCreator token={setAccessToken} /> */}

        {/* Display success message */}
        {successMessage && <p className="text-black">{successMessage}</p>}

        {/* Display error message */}
        {errorMessage && <p className="text-violet-900">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Login;
