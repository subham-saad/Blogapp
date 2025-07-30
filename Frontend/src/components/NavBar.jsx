
import { Link } from 'react-router-dom';


function NavBar({isLogedIn}) {
  return (
    <nav className="flex-between bg-emerald-500 rounded-md mb-8 p-5">
      <Link to="/">
      <h3 className="font-bold font-sans text-xl">Blogmania</h3>
      </Link>
      {isLogedIn ? <Link to="/login">
      <button className="font-bold bg-gray-600 p-2 text-white rounded-lg text-md">Login</button>
      </Link> : <Link to="/logout">
      <button className="font-bold bg-red-600 p-2 text-white rounded-lg text-md">LogOut</button>
      </Link> }
      <Link to="/createblog" >
      <button className="font-bold bg-gray-600 p-2 text-white rounded-lg text-md">Create</button>
      </Link>
      <Link to="/register" >
      <button className="font-bold bg-gray-600 p-2 text-white rounded-lg text-md">Register</button>
      </Link>
    </nav>
  )
}

export default NavBar