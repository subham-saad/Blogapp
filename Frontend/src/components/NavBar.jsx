
import { Link } from 'react-router-dom';


function NavBar() {
  return (
    <nav className="flex-between bg-emerald-500 rounded-md mb-8 p-5">
      <Link to="/">
      <h3 className="font-bold font-sans text-xl">Blogmania</h3>
      </Link>
      <Link to="/login">
      <button className="font-bold bg-gray-600 p-2 text-white rounded-lg text-md">Login</button>
      </Link>
      <Link to="/createblog" >
      <button className="font-bold bg-gray-600 p-2 text-white rounded-lg text-md">Create</button>
      </Link>
    </nav>
  )
}

export default NavBar