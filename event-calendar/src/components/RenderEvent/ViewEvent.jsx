import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "../../services/eventService";
import { getUserByEmail } from "../../services/usersService";
import { CiCalendar } from "react-icons/ci";
import { FaClock } from "react-icons/fa6";
import { AppContext } from "../../store/app.context";
import ManageParticipants from '../Events/ManageParticipants';
import InviteFromContactList from '../Events/InviteFromContactList';

function RenderEvent() {
  const { id } = useParams();
  const { appState } = useContext(AppContext);
  const [data, setData] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const eventInfo = await getEventById(id);
      const userInfo = await getUserByEmail(appState.user, appState.token);
      setData(eventInfo);
      setUserData(userInfo);
    };

    fetchData();
  }, [id, appState.user, appState.token]);

  if (!data) {
    return <div className="flex justify-center items-center h-screen text-[#DA4735]">Loading...</div>;
  }
  const isOrganizer = data?.organizer === appState.user;

  const handleUpdateParticipants = (updatedParticipants) => {
    setData((prevData) => ({
      ...prevData,
      participants: updatedParticipants,
    }));
  };

  return (
    <>
      <div className="flex flex-col items-center w-full min-h-screen bg-white mx-auto">
        {/* Hero Section with Cover Image */}
        <div className="relative w-full h-96 rounded-b-lg overflow-hidden shadow-md">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${data.eventCover})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-black/50"></div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full p-10 text-white">
            <p className="font-semibold text-xl mb-4">
              {new Date(data.startDate).toLocaleDateString("en-GB", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>

            <h2 className="font-bold text-4xl mb-6 text-center">{data.title}</h2>
            <div className="flex items-center bg-[#DA4735]/90 px-4 py-2 rounded-full">
              <p>Hosted by: </p>
              <p className="ml-2 font-medium">
                {data.createdBy.firstName} {data.createdBy.lastName}
              </p>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="w-full max-w-6xl px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-8">
            {/* Event Date/Time Info */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center">
                <CiCalendar className="text-[#DA4735] text-2xl mr-3" />
                <p className="text-gray-800">
                  {new Date(data.startDate).toLocaleDateString("en-GB", {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center">
                <FaClock className="text-[#DA4735] text-xl mr-3" />
                <p className="text-gray-800">
                  {new Date(data.startDate).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" - "}
                  {new Date(data.endDate).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {!isOrganizer && (
              <button className="bg-[#DA4735] hover:bg-[#c23d2d] text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md">
                Join the event
              </button>
            )}
          </div>

          <hr className="border-t border-gray-200 my-6" />

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main Content */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Event Overview</h1>
              <p className="text-gray-700 leading-relaxed">{data.description}</p>
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex flex-col items-center mb-4">
                  <img
                    src={userData.profilePictureURL}
                    alt="Host profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#DA4735]"
                  />
                  <p className="mt-3 font-medium text-gray-900">
                    {data.createdBy.firstName} {data.createdBy.lastName}
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-gray-900">{data.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Participants</p>
                    <p className="text-gray-900">
                      {data.participants.length} attending
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Event Type</p>
                    <p className="text-gray-900">
                      {data.isPublic ? "Public" : "Private"}
                    </p>
                  </div>
                  {data.tags.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tags</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {data.tags.map((tag, index) => (
                          <span key={index} className="bg-[#DA4735]/10 text-[#DA4735] px-3 py-1 rounded-full text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <InviteFromContactList 
                eventId={id}
                currentParticipants={data.participants}
                onUpdate={handleUpdateParticipants}
              />
            </div>
          </div>

          {/* Participants Management */}
          {isOrganizer && (
            <div className="mt-10">
              <ManageParticipants
                eventId={id}
                participants={data.participants}
                onUpdate={handleUpdateParticipants}
                currentUserEmail={appState.user}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default RenderEvent;