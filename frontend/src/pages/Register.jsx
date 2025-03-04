import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const {register} = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if(!name || !email || !password || !role){
            setError("Please fill in all the fields");
            return;
        }

        const success = await register(name, email, password, role);
        if(!success){
            setError("Registration failed! Try again.");
        }
        else{
            navigate("/dashboard", {state: {message: "User registered and logged in successfully"}});
        }
    }

    return(
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-white text-2xl font-semibold mb-4 text-center">
                    Register
                </h2>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mb-3 p-3 rounded bg-gray-700 text-white outline-none"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mb-3 p-3 rounded bg-gray-700 text-white outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-3 p-3 rounded bg-gray-700 text-white outline-none"
                    />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="mb-3 p-3 rounded bg-gray-700 text-white outline-none"
                    >
                        <option value="Manager">Manager</option>
                        <option value="Project Leader">Project Leader</option>
                        <option value="Team Member">Team Member</option>
                    </select>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition duration-300"
                    >
                        Register
                    </button>
                </form>
                <p className="text-gray-400 text-sm text-center mt-4">
                    Already have an account? <Link to="/" className="text-blue-400">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;