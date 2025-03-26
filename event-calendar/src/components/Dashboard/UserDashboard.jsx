import { useContext, useState } from "react";
import { AppContext } from "../../store/app.context";
import PersonalCalendar from "./PersonalCalendar";
import EventManager from "./EventManager";
import EventInvitationsList from "../Events/EventInvitationsList";
const UserDashboard = () => {
  const { appState } = useContext(AppContext);
  const [activeSection] = useState("calendar");

  return (
    <>
      <div className="flex min-h-screen bg-white">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {activeSection === "calendar" ? "My Calendar" : "Settings"}
            </h1>
          </header>

          <div className="grid grid-rows-1 lg:grid-rows-1 ">
            {activeSection === "calendar" ? (
              <>
                <div className=" h-fit">
                  <PersonalCalendar className="w-full w-fit border border-gray-200 rounded-lg shadow-sm" />
                </div>
                <div className="flex row space-x-6 p-10">
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
