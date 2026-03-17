import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AvatarSelector, storeAvatar, type AvatarType } from "@/components/AvatarSelector";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

  // Handle post-OAuth redirect (e.g., after Google login from PaymentSuccess)
  useEffect(() => {
    const redirect = sessionStorage.getItem("auth_redirect");
    if (!redirect) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        sessionStorage.removeItem("auth_redirect");
        navigate(redirect);
      }
    });
  }, [navigate]);

  const handleSelect = (selected: AvatarType) => {
    storeAvatar(selected);
    if (selected === "photographer") {
      navigate("/pre-fotografov");
    } else {
      navigate("/bez-fotografa");
    }
  };

  return (
    <div className="min-h-screen">
      <AvatarSelector onSelect={handleSelect} />
    </div>
  );
};

export default Index;
