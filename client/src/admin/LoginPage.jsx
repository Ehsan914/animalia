import { useState } from "react";
import Button from "../components/ui/Button";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from 'react-hot-toast';

const LoginPage = () => {
    
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const { login, loading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const success = await login(email, password);

        if (success) {
            toast.success("Login successful");
            navigate('/admin/dashboard');
        }
        else toast.error("Invalid Credentials");
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-150 w-[90%] sm:w-full px-5 sm:px-0 mx-auto my-10 bg-mc-creeper border-4 border-mc-primary shadow-mc-sharp">
                <form onSubmit={handleSubmit} className="flex flex-col px-7 md:px-13.5 pt-12.5 pb-9 gap-5 sm:gap-7.5">
                    <h1 className="text-3xl sm:text-4xl font-pixel-alt text-black/90">Welcome to Animalia Admin Panel</h1>

                    {/* Email */}
                    <div className="flex flex-col gap-2.5">
                        <label className="text-[15px] font-sans font-semibold text-black">Email</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            className="border-4 border-mc-primary shadow-mc-sharp bg-white px-3 py-3 text-sm font-sans font-medium"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2.5">
                        <label className="text-[15px] font-sans font-semibold text-black">Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => {setPassword(e.target.value)}} 
                                placeholder="••••••••••••"
                                className="w-full border-4 border-mc-primary shadow-mc-sharp bg-white px-3 py-3 text-sm font-sans font-medium"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <Button disabled={loading} className="font-pixel-alt text-xl sm:text-2xl font-medium py-2">
                        {
                            loading ? "Signing in..." : "Sign in"
                        }
                    </Button>
                </form>
            </div>
        </div>
    )
}
export default LoginPage