"use client";

import React, { useState } from "react";
import "./login.css"; // Asegúrate de tener los estilos en un archivo CSS



const Login = () => {
    // Estados para almacenar el usuario y la contraseña ingresados
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

  // Función para manejar el inicio de sesión
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita que se recargue la página
    if (username === "admin" && password === "patitofeo") {
      alert("¡Inicio de sesión exitoso!");
    } else {
      alert("Nombre de usuario o contraseña incorrectos");
    }
  };
    

    return (
        <div className="container">
            <div className="screen">
                <div className="screen__content">
                    <form className="login" onSubmit={handleLogin}>
                        <div className="login__field">
                            <i className="login__icon fas fa-user"></i>
                            <input
                                type="text"
                                className="login__input"
                                placeholder="User name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="login__field">
                            <i className="login__icon fas fa-lock"></i>
                            <input
                                type="password"
                                className="login__input"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {errorMessage && <p className="error">{errorMessage}</p>}
                        <button type="submit" className="button login__submit">
                            <span className="button__text">Log In Now</span>
                            <i className="button__icon fas fa-chevron-right"></i>
                        </button>
                    </form>
                    <div className="social-login">
                        <h3>Log in via</h3>
                        <div className="social-icons">
                            <a href="#" className="social-login__icon fab fa-instagram"></a>
                            <a href="#" className="social-login__icon fab fa-facebook"></a>
                            <a href="#" className="social-login__icon fab fa-twitter"></a>
                        </div>
                    </div>
                </div>
                <div className="screen__background">
                    <span className="screen__background__shape screen__background__shape4"></span>
                    <span className="screen__background__shape screen__background__shape3"></span>
                    <span className="screen__background__shape screen__background__shape2"></span>
                    <span className="screen__background__shape screen__background__shape1"></span>
                </div>
            </div>
        </div>
    );
}

export default Login;
