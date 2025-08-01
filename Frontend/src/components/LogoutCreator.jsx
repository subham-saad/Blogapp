import { useState } from 'react'

function LogoutCreator({ token }) {

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
  
      
    const handleLogout = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_MY_URL}/api/v1/creator/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
   
          },
          credentials: 'include', // include cookies in the request
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
    
        // Clear cookies on the client side
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
        // Display success message
        setSuccessMessage('Logout successful!');
        token(null);
        // Redirect to another page or update state accordingly
      } catch (error) {
        console.error(error.message);
    
        // Display error message
        setErrorMessage('Logout failed. Please try again.');
      }
    };
    
  return (
    <div>
         <button className='bg-red-500 p-3 mx-10 w-28 rounded-md mt-6' type="button" onClick={handleLogout}>
          Logout
        </button>
    </div>
  )
}

export default LogoutCreator