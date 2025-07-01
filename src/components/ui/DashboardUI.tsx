import { type UserData } from "../../types/UserData";

const DashboardUI = ({ userData }: { userData: UserData }) => {
  return (
    <div className="flex m-4">
      <div className="bg-white">{userData.username}</div>
    </div>
  );
};

export default DashboardUI;
