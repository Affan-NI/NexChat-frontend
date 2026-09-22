import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "./Mycontext";
import "./Auth.css";

function Login() {

    const navigate = useNavigate();

    const {
        setUser,
        setIsAuthenticated
    } = useContext(MyContext);

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

           const re= await axios.post(
                // "http://ec2-65-0-31-60.ap-south-1.compute.amazonaws.com:8080/api/auth/login",
                "http://ec2-13-203-232-149.ap-south-1.compute.amazonaws.com:8080/api/auth/login",
                {
                    email,
                    password
                },
                {
                    withCredentials: true
                }
            );
            // console.log(re);
            const profile =
                await axios.get(
                    // "http://ec2-65-0-31-60.ap-south-1.compute.amazonaws.com:8080/api/auth/profile",
                    "http://ec2-13-203-232-149.ap-south-1.compute.amazonaws.com:8080/api/auth/profile",
                    {
                        withCredentials: true
                    }
                );
            console.log(profile.data.name);
            setUser(
                profile.data.name
            );

            setIsAuthenticated(true);

            navigate("/");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Invalid Credentials"
            );
        }
    };

    return (

        <div className="auth-container">

            <form
                className="auth-form"
                onSubmit={handleLogin}
            >

                <h1>Login</h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    required
                />

                <button type="submit">
                    Login
                </button>

                <p>
                    Don't have an account?
                    <Link to="/signup">
                        Sign Up
                    </Link>
                </p>

            </form>

        </div>
    );
}

export default Login;