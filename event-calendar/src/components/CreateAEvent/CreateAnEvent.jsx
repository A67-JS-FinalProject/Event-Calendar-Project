import { useState, useContext, useEffect } from "react";
import { createEvent } from "../../services/eventService";
import { AppContext } from "../../store/app.context";
import { getUserByEmail, updateUserEvent } from "../../services/usersService";
import { getContactLists } from "../../services/contactListsService";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import axios from "axios";

import {
  MdOutlineTag,
  MdNotificationAdd,
  MdNotifications,
  MdAddPhotoAlternate,
  MdOutlineLocationOn,
  MdFormatAlignJustify,
  MdPeopleAlt,
  MdOutlineClose,
  MdOutlineAccessTimeFilled,
} from "react-icons/md";
import { CiLock } from "react-icons/ci";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CreateAnEvent({ isOpen, onRequestClose }) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [participants, setParticipants] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState("does_not_repeat");
  const [recurrenceEndDate, setRecurrenceEndDate] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [eventCover, setEventCover] = useState("");
  const [tags, setTags] = useState("");
  const [reminders, setReminders] = useState([]);
  const [userData, setUserData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    participants: "",
    location: "",
    description: "",
  });
  const [contactLists, setContactLists] = useState([]);
  const [selectedContactList, setSelectedContactList] = useState("");
  const { appState, setAppState } = useContext(AppContext);
  const { user, token } = appState;
  const navigate = useNavigate();

  const [participantPermissions, setParticipantPermissions] = useState({
    canInviteOthers: false,
    canViewGuestList: true,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const authUser = await getUserByEmail(user, token);
        setUserData(authUser);
        console.log("Fetched user data:", authUser);
      }
    };

    fetchUserData();
  }, [user, token]);

  useEffect(() => {
    const fetchContactLists = async () => {
      if (user) {
        try {
          const lists = await getContactLists(user);
          setContactLists(lists);
        } catch (error) {
          console.error("Error fetching contact lists:", error);
        }
      }
    };

    fetchContactLists();
  }, [user]);

  const handleContactListSelect = async (listName) => {
    setSelectedContactList(listName);
    const selectedList = contactLists.find((list) => list.name === listName);
    if (selectedList) {
      const participantEmails = selectedList.users.join(", ");
      setParticipants((prevParticipants) => {
        const currentEmails = prevParticipants
          ? prevParticipants.split(",").map((p) => p.trim())
          : [];
        const newEmails = participantEmails.split(",").map((p) => p.trim());
        const uniqueEmails = [...new Set([...currentEmails, ...newEmails])];
        return uniqueEmails.join(", ");
      });
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("File size must be under 2MB");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "event_pictures");
    formData.append("cloud_name", "dglknhf3r");
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dglknhf3r/image/upload",
        formData
      );

      const imageUrl = response.data.secure_url;
      setEventCover(imageUrl);
      setSuccess("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const validateFields = async () => {
    let valid = true;
    let newErrors = {
      title: "",
      participants: "",
      location: "",
      description: "",
    };

    if (title.length < 3 || title.length > 30) {
      newErrors.title = "Title must be between 3 and 30 characters.";
      valid = false;
    }

    if (!location) {
      newErrors.location = "Location is required.";
      valid = false;
    }

    if (!description || description.length > 500) {
      newErrors.description = "Description must be at most 500 characters.";
      valid = false;
    }

    if (participants) {
      const emails = participants.split(",").map((email) => email.trim());
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const invalidEmails = emails.filter((email) => !emailRegex.test(email));
      if (invalidEmails.length > 0) {
        newErrors.participants = `Invalid email(s): ${invalidEmails.join(
          ", "
        )}`;
        valid = false;
      }

      try {
        const checkOptedOut = async () => {
          for (const email of emails) {
            const userData = await getUserByEmail(email, token);
            if (userData?.optOutOfInvitations) {
              newErrors.participants = `${email} has opted out of receiving invitations`;
              valid = false;
              break;
            }
          }
        };
        await checkOptedOut();
      } catch (error) {
        console.error("Error checking opted-out status:", error);
        newErrors.participants = "Error validating participant preferences";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    if (!userData) {
      console.error("User data not available");
      setError("User data not available.");
      return;
    }

    if (!(await validateFields())) {
      return;
    }

    if (!startDate) {
      setError("Start date is required.");
      return;
    }

    if (!startHour) {
      setError("Start time is required.");
      return;
    }

    if (!endHour) {
      setError("End time is required.");
      return;
    }

    try {
      let participantEmails = participants
        ? participants.split(",").map((p) => p.trim())
        : [];
      if (!participantEmails.includes(userData.email)) {
        participantEmails.push(userData.email);
      }

      const eventDates = isRecurring ? generateRecurringDates() : [startDate];
      let createdEventIds = [];

      for (const eventDate of eventDates) {
        const event = {
          title,
          startDate: new Date(
            eventDate.getFullYear(),
            eventDate.getMonth(),
            eventDate.getDate(),
            parseInt(startHour.split(":")[0]),
            parseInt(startHour.split(":")[1])
          ),
          endDate: new Date(
            eventDate.getFullYear(),
            eventDate.getMonth(),
            eventDate.getDate(),
            parseInt(endHour.split(":")[0]),
            parseInt(endHour.split(":")[1])
          ),
          location,
          description,
          participants: participantEmails.map((email) => ({
            email,
            status: email === userData.email ? "accepted" : "pending",
            role: email === userData.email ? "organizer" : "invitee",
          })),
          isPublic,
          isRecurring: recurrenceType !== "does_not_repeat",
          recurrence: recurrenceType,
          recurrenceEndDate: isRecurring ? recurrenceEndDate : null,
          eventCover,
          tags: tags.split(",").map((t) => t.trim()),
          reminders: reminders.filter((r) => r !== "None"),
          createdBy: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
          },
          isSeries: isRecurring,
          seriesId: isRecurring
            ? `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            : null,
        };

        const createdEvent = await createEvent(event, token);
        if (!createdEvent || !createdEvent._id) {
          throw new Error("Event creation failed.");
        }
        createdEventIds.push(createdEvent._id);
      }

      const updatedEvents = Array.isArray(userData.events)
        ? [...userData.events, ...createdEventIds]
        : [...createdEventIds];

      await updateUserEvent(userData.email, updatedEvents);

      setSuccess("Event(s) created successfully!");
      onRequestClose();

      if (createdEventIds.length > 0) {
        navigate(`/events/${createdEventIds[0]}`);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      setError(error.message || "An error occurred while creating the event.");
    }
  };
  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const generateRecurringDates = () => {
    if (!startDate || !recurrenceEndDate) return [startDate];

    const dates = [];
    let currentDate = new Date(startDate);
    const endDate = new Date(recurrenceEndDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));

      switch (recurrenceType) {
        case "daily":
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case "weekly":
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case "monthly":
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case "yearly":
          currentDate.setFullYear(currentDate.getFullYear() + 1);
          break;
        default:
          return dates;
      }
    }

    return dates;
  };
  const getCurrentFormattedDate = () => {
    const dateOptions = { weekday: "long", month: "long", day: "numeric" };
    return new Date().toLocaleDateString(undefined, dateOptions);
  };

  const getCurrentFormattedTime = () => {
    const dateOptions = { hour: "2-digit", minute: "2-digit" };
    return new Date().toLocaleTimeString(undefined, dateOptions);
  };
  const createAReminder = () => {
    setReminders((prevReminders) => [...prevReminders, "None"]);
  };
  const timeOptions = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];
  const PermissionsManager = () => (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Participant Permissions</h3>
      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={participantPermissions.canInviteOthers}
            onChange={(e) =>
              setParticipantPermissions((prev) => ({
                ...prev,
                canInviteOthers: e.target.checked,
              }))
            }
            className="mr-2"
          />
          Participants can invite others
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={participantPermissions.canViewGuestList}
            onChange={(e) =>
              setParticipantPermissions((prev) => ({
                ...prev,
                canViewGuestList: e.target.checked,
              }))
            }
            className="mr-2"
          />
          Participants can view guest list
        </label>
      </div>
    </div>
  );

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center  z-50">
      <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onRequestClose}
            className="btn btn-ghost btn-sm "
          >
            <MdOutlineClose className="text-2xl" />
          </button>
        </div>
        <form onSubmit={handleCreateEvent}>
          <div className="flex justify-between flex-col mb-4">
            <div className="form-control mt-4 mb-4 w-fit mx-17">
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={title}
                    maxLength="30"
                    placeholder="Add title"
                    className={`input w-72 border-0 border-b-2 border-gray-300  p-2 focus:outline-none focus:border-blue-500 transition-colors`}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {title.length} / 30
                  </p>
                </div>
              </div>
              {errors.title && (
                <span className="text-red-500 text-sm mt-1 ml-10">
                  {errors.title}
                </span>
              )}
            </div>

            <div className="flex flex-row px-6">
              <MdOutlineAccessTimeFilled className="text-2xl" />
              <div className="form-control mb-4 px-6">
                {showDetails ? (
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <input
                          type="text"
                          value={
                            startDate
                              ? startDate.toDateString()
                              : "Select a date"
                          }
                          readOnly
                          className="input input-bordered cursor-pointer"
                          onClick={() => setShowCalendar(!showCalendar)}
                        />
                        {showCalendar && (
                          <div className="absolute top-12 left-0 z-10 bg-white shadow-md rounded-lg p-2">
                            <DatePicker
                              selected={startDate}
                              onChange={(date) => {
                                setStartDate(date);
                                setShowCalendar(false);
                              }}
                              inline
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <select
                          value={startHour}
                          onChange={(e) => setStartHour(e.target.value)}
                          className="select w-1/3 h-10 border rounded p-1 overflow-y-auto"
                        >
                          <option value="">Select Start Time</option>
                          {timeOptions.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>

                        <span className="mx-2">-</span>
                        <select
                          value={endHour}
                          onChange={(e) => setEndHour(e.target.value)}
                          className=" select w-1/3 border rounded p-2"
                        >
                          <option value="">Select End Time</option>
                          {timeOptions.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-control mt-4 w-fit">
                      <label className="label">
                        <span className="label-text">Repeats</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        value={recurrenceType}
                        onChange={(e) => {
                          setRecurrenceType(e.target.value);
                          setIsRecurring(e.target.value !== "does_not_repeat");
                        }}
                      >
                        <option value="does_not_repeat">Does not repeat</option>
                        <option value="weekly">Weekly </option>
                        <option value="monthly">Monthly </option>
                        <option value="yearly">Yearly </option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    {isRecurring && recurrenceType !== "does_not_repeat" && (
                      <div className="form-control mt-4">
                        <label className="label">
                          <span className="label-text">
                            Recurrence End Date
                          </span>
                        </label>
                        <DatePicker
                          selected={recurrenceEndDate}
                          onChange={(date) => setRecurrenceEndDate(date)}
                          minDate={startDate}
                          className="input input-bordered w-full"
                          placeholderText="Select end date for recurrence"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <label
                    className="label cursor-pointer flex items-center"
                    onClick={handleToggleDetails}
                  >
                    <div className="flex flex-col">
                      <p className="label-text">{getCurrentFormattedDate()}</p>
                      <p className="label-text">{getCurrentFormattedTime()}</p>
                      <p className="label-text">Time zone • Does not repeat</p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="form-control mb-4 flex flex-row items-center space-x-6 px-6">
            <div>
              <MdPeopleAlt className="text-2xl" />
            </div>
            <div className="flex flex-col w-full gap-2">
              <input
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                placeholder="Add participants"
                className="input w-full border-0 border-b-2 border-gray-300 focus:outline-none 
      focus:border-b-4 focus:border-blue-500 focus:bg-pink-300 
      focus:text-blue-100 focus:opacity-100 transition-all"
              />
              <select
                value={selectedContactList}
                onChange={(e) => handleContactListSelect(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="">Select from contact lists</option>
                {contactLists.map((list) => (
                  <option key={list.name} value={list.name}>
                    {list.name} ({list.users?.length || 0} contacts)
                  </option>
                ))}
              </select>
            </div>
          </div>
          {errors.participants && (
            <span
              style={{
                color: "red",
                fontSize: "0.875rem",
                paddingLeft: "2.5rem",
              }}
            >
              {errors.participants}
            </span>
          )}
          <div className="form-control mb-4 flex flex-row items-center space-x-6 px-6">
            <div>
              <MdOutlineLocationOn className="text-2xl" />
            </div>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add location"
              className={`input w-full border-0 border-b-2 border-gray-300 focus:outline-none 
    focus:border-b-4 focus:border-blue-500 focus:bg-pink-300 
    focus:text-blue-100 focus:opacity-100 transition-all`}
            />
          </div>
          <div className="flex items-center px-6">
            {errors.location && (
              <span
                style={{
                  color: "red",
                  fontSize: "0.875rem",
                  paddingLeft: "2.5rem",
                }}
              >
                {errors.location}
              </span>
            )}
          </div>

          <hr className="my-3 w-full mx-0" />
          <div className="px-6">
            <div className="flex items-center space-x-3">
              <MdFormatAlignJustify className="text-2xl text-gray-500" />
              <div className="flex-1">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add description"
                  maxLength="500"
                  className={`textarea w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 transition-colors`}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {description.length} / 500
                </p>
              </div>
            </div>
            {errors.description && (
              <span className="text-red-500 text-sm mt-1 ml-10">
                {errors.description}
              </span>
            )}

            <div className="form-control mb-4 flex flex-row items-center space-x-6">
              <MdAddPhotoAlternate className="text-2xl" />
              <div
                className="flex w-fit flex-col space-x-2 py-2 px-4 cursor-pointer hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => document.getElementById("file-upload").click()}
              >
                <span className="text-blue-500 m-0">Add Event Cover Here</span>
                <input
                  type="file"
                  id="file-upload"
                  className="file-input hidden p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full transition-all"
                  onChange={handleFileChange}
                />
                {uploading && (
                  <p className="text-blue-500 text-sm">Uploading...</p>
                )}
              </div>
            </div>
          </div>
          <hr className="my-3 w-full mx-0" />
          <div className="px-6">
            <div className="form-control mb-4 flex flex-row items-center space-x-6">
              <MdOutlineTag className="text-2xl" />
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags (comma separated)"
                className="border-2 border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="form-control mb-4 flex flex-row items-center gap-4">
              <CiLock className="text-2xl flex-shrink-0" />
              <select
                className="select select-bordered w-full"
                value={isPublic ? "Public" : "Private"}
                onChange={(e) => setIsPublic(e.target.value === "Public")}
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            </div>

            <div className="dasda">
              <div className="form-control mb-4 flex flex-row items-center space-x-6">
                <MdNotifications className="text-2xl" />
                <select
                  className="select w-auto text-lg"
                  value={reminders.length > 0 ? reminders[0] : "None"}
                  onChange={(e) => {
                    const newReminders = [...reminders];
                    newReminders[0] = e.target.value;
                    setReminders(newReminders);
                  }}
                >
                  <option value="None">None</option>
                  <option value="5 minutes before">5 minutes before</option>
                  <option value="10 minutes before">10 minutes before</option>
                  <option value="15 minutes before">15 minutes before</option>
                  <option value="30 minutes before">30 minutes before</option>
                  <option value="1 hour before">1 hour before</option>
                  <option value="1 day before">1 day before</option>
                  <option value="Custom">Custom...</option>
                </select>
              </div>
              {reminders.slice(1).map((reminder, index) => (
                <div
                  key={index + 1}
                  className="form-control mb-4 flex flex-row items-center space-x-6"
                >
                  <div className="px-3" />
                  <select
                    className="select w-auto text-lg"
                    value={reminder}
                    onChange={(e) => {
                      const newReminders = [...reminders];
                      newReminders[index + 1] = e.target.value;
                      setReminders(newReminders);
                    }}
                  >
                    <option value="None">None</option>
                    <option value="5 minutes before">5 minutes before</option>
                    <option value="10 minutes before">10 minutes before</option>
                    <option value="15 minutes before">15 minutes before</option>
                    <option value="30 minutes before">30 minutes before</option>
                    <option value="1 hour before">1 hour before</option>
                    <option value="1 day before">1 day before</option>
                    <option value="Custom">Custom...</option>
                  </select>
                </div>
              ))}
            </div>
            <PermissionsManager />
            <button
              type="button"
              onClick={createAReminder}
              className="btn btn-ghost btn-block"
            >
              <MdNotificationAdd />
              Add notification
            </button>

            <div className="flex justify-center space-x-2">
              <button type="submit" className="btn btn-primary w-50 mb-4 mt-4">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
CreateAnEvent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};
export default CreateAnEvent;
