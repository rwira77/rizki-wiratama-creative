import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login");
      } else {
        setSession(session);
      }
    };
    checkAuth();
  }, [navigate]);

  if (!session) return <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>Checking Authentication...</div>;

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Admin Dashboard Online</h1>
      <p style={{ color: '#666' }}>If you can see this, the basic routing and auth are working.</p>
      <button 
        onClick={() => window.location.reload()}
        style={{ padding: '12px 24px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '20px' }}
      >
        Refresh Dashboard
      </button>
    </div>
  );
};

export default AdminDashboard;
