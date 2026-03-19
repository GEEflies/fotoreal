import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AvatarSelector, storeAvatar, type AvatarType } from "@/components/AvatarSelector";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";

const Index = () => {
  const navigate = useNavigate();

  // Handle post-OAuth redirect (e.g., after Google login)
  useEffect(() => {
    const redirect = sessionStorage.getItem("auth_redirect");
    if (!redirect) return;

    const doRedirect = () => {
      sessionStorage.removeItem("auth_redirect");
      navigate(redirect);
    };

    // Check immediately (session may already be available)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) doRedirect();
    });

    // Also listen for auth state changes (covers async OAuth callbacks)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session && sessionStorage.getItem("auth_redirect")) {
          doRedirect();
        }
      }
    );

    return () => subscription.unsubscribe();
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
      <SEO
        path="/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "RealFoto",
            url: "https://realfoto.sk",
            logo: "https://realfoto.sk/favicon.png",
            email: "info@realfoto.sk",
            telephone: "+421911911288",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Bratislava",
              addressCountry: "SK",
            },
            sameAs: ["https://twitter.com/RealFoto"],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "RealFoto",
            url: "https://realfoto.sk",
          },
        ]}
      />
      <AvatarSelector onSelect={handleSelect} />
    </div>
  );
};

export default Index;
