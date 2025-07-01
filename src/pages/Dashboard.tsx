import { useState } from "react";
import { type UserData } from "../types/UserData.ts";
import UserDataForm from "../components/form/UserDataForm.tsx";
import DashboardUI from "../components/ui/DashboardUI.tsx";

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleSubmit = (username: string) => {
    console.log("Fetching data for: ", username);
    fetch(`http://localhost:3000/user/getuser/${username}`)
      .then((response) => response)
      .then((e) => e.json())
      .then((e: UserData) => {
        console.log(e);
        setUserData(e);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="justify-center flex items-center">
      {!userData ? (
        <UserDataForm onSubmit={handleSubmit} />
      ) : (
        <DashboardUI userData={userData} />
      )}
    </div>
  );
};

export default Dashboard;
