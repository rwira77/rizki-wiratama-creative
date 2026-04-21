import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, User, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock login
    if (username === "admin" && password === "rizki2026") {
      localStorage.setItem("isAdminAuthenticated", "true");
      toast.success("Welcome back, Rizki");
      navigate("/admin/dashboard");
    } else {
      toast.error("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white border border-slate-100 shadow-2xl rounded-[3rem] p-10 md:p-14 space-y-10"
      >
        <div className="text-center space-y-4">
          <div className="size-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <ShieldCheck className="size-10 text-primary" />
          </div>
          <h1 className="font-special-serif text-4xl text-slate-900 leading-tight">Admin Gate</h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest font-black">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Identifier</label>
            <div className="relative group">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-900"
                placeholder="Username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Access Key</label>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-primary transition-colors" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-900"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-3 hover:bg-black transition-colors group mt-8 shadow-xl"
          >
            Authenticate
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="text-center pt-6">
           <button onClick={() => navigate("/")} className="text-slate-300 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Return to Portfolio</button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
