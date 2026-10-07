import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Icon from "../components/ui/Icon"
import useAuth from "../hooks/useAuth"

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const { login, loading } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!EMAIL.test(email) || !password) {
            setError("Add your email and password.")
            return
        }
        setError("")
        const failure = await login(email, password)
        if (!failure) navigate("/admin/dashboard")
        else if (failure.status === 401) setError("That email and password don't match. Check them and try again.")
        else setError(failure.message)
    }

    return (
        <main className="login">
            <form className="login-card" onSubmit={handleSubmit} noValidate>
                <img src="/logo.svg" alt="Animalia Vet Care" width="170" height="48" className="login-logo" />
                <h1>Sign in to the admin panel</h1>
                <div className="field">
                    <label htmlFor="login-email">Email</label>
                    <input
                        id="login-email"
                        type="email"
                        autoComplete="username"
                        required
                        value={email}
                        aria-invalid={error ? true : undefined}
                        aria-describedby="login-error"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="field">
                    <label htmlFor="login-password">Password</label>
                    <div className="field-row">
                        <input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            required
                            value={password}
                            aria-invalid={error ? true : undefined}
                            aria-describedby="login-error"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            className="icon-btn"
                            type="button"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowPassword((shown) => !shown)}
                        >
                            <Icon name={showPassword ? "eye-slash" : "eye"} />
                        </button>
                    </div>
                </div>
                <p className="field-error" id="login-error" role="alert">{error}</p>
                <button className="btn" type="submit" disabled={loading}>
                    {loading ? "Signing in…" : "Sign in"}
                </button>
            </form>
        </main>
    )
}

export default LoginPage
