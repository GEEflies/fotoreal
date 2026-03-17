import { useNavigate } from "react-router-dom";
import { AvatarSelector, storeAvatar, type AvatarType } from "@/components/AvatarSelector";

const Index = () => {
  const navigate = useNavigate();

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
