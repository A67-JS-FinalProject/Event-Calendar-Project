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
    return <div>Loading...</div>;
  }
  const isOrganizer = data?.organizer === appState.user;

  console.log("Cover Photo URL:", data.eventCover); // Log the URL to the console

  const handleUpdateParticipants = (updatedParticipants) => {
    setData((prevData) => ({
      ...prevData,
      participants: updatedParticipants,
    }));
  };

  return (
    <>
      <div className="flex flex-col items-center w-full h-screen mx-auto">
        <div className="relative w-full h-250 rounded-lg overflow-hidden">
          {/* Background Image */}
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
            <p className="font-semibold text-xl mb-10">
              {new Date(data.startDate).toLocaleDateString("en-GB", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>

            <h2 className="font-semibold text-3xl mb-10">{data.title}</h2>
            <div className="flex flex-row items-center">
              <p>By: </p>
              <p className="text-md text-white underline decoration-dotted ml-2">
                {data.createdBy.firstName} {data.createdBy.lastName}
              </p>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-white w-full h-full p-10 rounded-lg shadow-lg">
          <div className="flex flex-row mb-4 justify-between  ">
            <div className="flex flex-col items-start mb-4">
              <div className="flex flex-row items-center mb-4">
                <CiCalendar className="text-pink-500 mr-2" />
                <p className="text-black">
                  {new Date(data.startDate).toLocaleDateString("en-GB", {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex flex-row items-center mb-4  ">
                <FaClock className="text-pink-500 mr-2" />
                <p className="text-black">
                  {new Date(data.startDate).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  -{" "}
                  {new Date(data.endDate).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            {!isOrganizer && (
              <button className="btn w-90 h-17">Join the event</button>
            )}
          </div>
          <hr className=" w-full h-3 text-black" />
          <div className="flex flex-row mt-4  ">
            <div className=" flex-4 ">
              <h1 className="text-black text-4xl   font-semibold">
                Event Overview
              </h1>
              <br />
              <p className="text-black">{data.description}</p>
            </div>
            <div className="mt-4   ">
              <div>
                <img
                  src={userData.profilePictureURL}
                  alt="Profile picture no loading"
                  className=" w-30 h-30"
                />
              </div>
              <p className="text-black">Location: {data.location}</p>
              <p className="text-black">
                Participants: {data.participants.join(", ")}
              </p>
              <p className="text-black">
                Public: {data.isPublic ? "Yes" : "No"}
              </p>
              <p className="text-black">
                Recurring: {data.isRecurring ? "Yes" : "No"}
              </p>
              <p className="text-black">Tags: {data.tags.join("# ")}</p>
              <p className="text-black">
                Reminders: {data.reminders.join("# ")}
              </p>
          <InviteFromContactList 
                eventId={id}
                currentParticipants={data.participants}
                onUpdate={handleUpdateParticipants}
              />
            </div>
          </div>
          
            <div className="flex flex-col gap-4">
              <ManageParticipants
                eventId={id}
                participants={data.participants}
                onUpdate={handleUpdateParticipants}
                currentUserEmail={appState.user}
              />
            </div>
        </div>
      </div>
    </>
  );
}

export default RenderEvent;
