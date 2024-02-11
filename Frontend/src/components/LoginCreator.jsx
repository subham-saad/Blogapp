

import { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/creator/logincreator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      console.log(data);

      // Display success message
      setSuccessMessage('Login successful!');

      // Redirect to another page or update state accordingly
    } catch (error) {
      console.error(error.message);

      // Display error message
      setErrorMessage('Login failed. Please check your credentials.');
    }
  };

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

        {/* Display success message */}
        {successMessage && <p className="text-black">{successMessage}</p>}

        {/* Display error message */}
        {errorMessage && <p className="text-violet-900">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Login;
