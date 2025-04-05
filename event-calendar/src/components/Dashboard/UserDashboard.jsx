import { useContext, useState } from "react";
import { AppContext } from "../../store/app.context";
import PersonalCalendar from "./PersonalCalendar";
import EventManager from "./EventManager";
import EventInvitationsList from "../Events/EventInvitationsList";
import NavBarPrivate from "../NavBarPrivate/NavBarPrivate";

const UserDashboard = () => {
  const { appState } = useContext(AppContext);
  const [activeSection] = useState("calendar");

  return (
    <>
    <NavBarPrivate />
      <div className="flex min-h-screen bg-white">
        {/* Sidebar with Events */}
        <div className="w-100 p-4 border-r border-gray-200 space-y-4">
          <EventManager className="w-full h-full border border-gray-200 rounded-lg shadow-sm" />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {activeSection === "calendar" ? "My Calendar" : "Settings"}
            </h1>
          </header>

          <div className="grid grid-rows-1 lg:grid-rows-1">
            {activeSection === "calendar" ? (
              <div className="h-fit">
                <PersonalCalendar className="w-full border border-gray-200 rounded-lg shadow-sm" />
              </div>
            ) : (
              <div className="col-span-3"></div>
            )}
          </div>
        </div>
        <div className="w-100 p-4 m border-r border-gray-200 space-y-4">
          <EventInvitationsList className="w-full border border-gray-200 rounded-lg shadow-sm p-4 bg-white" />
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
