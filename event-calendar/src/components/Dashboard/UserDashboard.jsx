import { useContext, useState } from "react";
import { AppContext } from "../../store/app.context";
import PersonalCalendar from "./PersonalCalendar";
import EventManager from "./EventManager";
import EventInvitationsList from "../Events/EventInvitationsList";
import { NavBarPrivate } from "../../components/NavBarPrivate/NavBarPrivate";
const UserDashboard = () => {
  const { appState } = useContext(AppContext);
  const [activeSection] = useState("calendar");

  return (
    <>
      <NavBarPrivate />
      <div className="flex min-h-screen bg-white">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {activeSection === "calendar" ? "My Calendar" : "Settings"}
            </h1>
          </header>

          <div className="grid grid-rows-2 lg:grid-rows-2 ">
            {activeSection === "calendar" ? (
              <>
                <div className="lg:col-span-2">
                  <PersonalCalendar className="w-full h-full border border-gray-200 rounded-lg shadow-sm" />
                </div>
                <div className="flex row space-x-6">
                  <EventManager className="w-full h-full border border-gray-200 rounded-lg shadow-sm" />
                  <EventInvitationsList className="border border-gray-200 rounded-lg shadow-sm p-4 bg-white" />
                </div>
              </>
            ) : (
              <div className="col-span-3">{/* Settings content here */}</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
