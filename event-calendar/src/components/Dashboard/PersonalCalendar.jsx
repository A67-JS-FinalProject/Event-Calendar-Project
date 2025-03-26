import { useState, useEffect, useContext } from "react";
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { AppContext } from "../../store/app.context";
import { getEventById } from "../../services/eventService";

const Home = () => {
  const [view, setView] = useState("Month");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const { appState } = useContext(AppContext);
  const { userData } = appState;

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!userData || !userData.events || userData.events.length === 0) {
        console.warn("No user events found.");
        setEvents([]);
        return;
      }

      try {
        const eventPromises = userData.events.map((eventId) =>
          getEventById(eventId)
        );
        const eventData = await Promise.all(eventPromises);
        setEvents(eventData);
      } catch (error) {
        console.error("Error fetching user events:", error);
      }
    };

    fetchUserEvents();
  }, [userData]);

  const renderEvents = (date) => {
    const filteredEvents = events.filter((event) => {
      if (!event.startDate) return false;
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getUTCFullYear() === date.getUTCFullYear() &&
        eventDate.getUTCMonth() === date.getUTCMonth() &&
        eventDate.getUTCDate() === date.getUTCDate()
      );
    });

    return (
      <>
        {filteredEvents.map((event, index) => (
          <div key={index} className="text-xs text-[#DA4735] truncate">
            {event.title}
          </div>
        ))}
      </>
    );
  };

  // Navigation functions remain unchanged
  const changeMonth = (offset) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setSelectedDate(newDate);
  };

  const changeYear = (offset) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(newDate.getFullYear() + offset);
    setSelectedDate(newDate);
  };

  const changeWeek = (offset) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + offset * 7);
    setSelectedDate(newDate);
  };

  const changeDay = (offset) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + offset);
    setSelectedDate(newDate);
  };

  const changeWorkWeek = (offset) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + offset * 7);
    setSelectedDate(newDate);
  };

  const actions = {
    Day: changeDay,
    Week: changeWeek,
    "Work Week": changeWorkWeek,
    Month: changeMonth,
    Year: changeYear,
  };

  const handleDateClick = (day, month = selectedDate.getMonth()) => {
    const newDate = new Date(selectedDate.getFullYear(), month, day);
    setSelectedDate(newDate);
    setView("Day");
  };

  const renderYearView = () => {
    const months = Array.from({ length: 12 }, (_, i) => i);

    return (
      <div className="grid grid-cols-4 gap-4 p-4">
        {months.map((month) => {
          const daysInMonth = new Date(
            selectedDate.getFullYear(),
            month + 1,
            0
          ).getDate();
          const firstDay = new Date(
            selectedDate.getFullYear(),
            month,
            1
          ).getDay();

          const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
          const prevMonthDays = adjustedFirstDay;
          const prevMonthLastDay = new Date(
            selectedDate.getFullYear(),
            month,
            0
          ).getDate();
          const prevMonthDates = Array.from(
            { length: prevMonthDays },
            (_, i) => prevMonthLastDay - prevMonthDays + i + 1
          );

          const nextMonthDays = 42 - (prevMonthDays + daysInMonth);
          const nextMonthDates = Array.from(
            { length: nextMonthDays },
            (_, i) => i + 1
          );

          const allDates = [
            ...prevMonthDates.map((day) => ({ day, isCurrentMonth: false })),
            ...Array.from({ length: daysInMonth }, (_, i) => ({
              day: i + 1,
              isCurrentMonth: true,
            })),
            ...nextMonthDates.map((day) => ({ day, isCurrentMonth: false })),
          ];

          return (
            <div key={month} className="flex flex-col rounded-md border p-2">
              <div className="text-center font-semibold text-base mb-1">
                {new Date(selectedDate.getFullYear(), month, 1).toLocaleString(
                  "default",
                  { month: "short" }
                )}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                  <div
                    key={`${day}-${index}`}
                    className="text-xs text-gray-500 text-center"
                  >
                    {day}
                  </div>
                ))}
                {allDates.map((date, i) => (
                  <div
                    key={i}
                    onClick={() => handleDateClick(date.day, month)}
                    className={`text-center text-sm mx-auto cursor-pointer 
                      ${date.isCurrentMonth ? "text-black" : "text-gray-300"} 
                      hover:bg-[#f7d9d4] rounded-full w-6 h-6 flex items-center justify-center
                      ${
                        selectedDate.getDate() === date.day &&
                        selectedDate.getMonth() === month &&
                        date.isCurrentMonth
                          ? "bg-[#DA4735] text-white"
                          : ""
                      }`}
                  >
                    {date.day}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMonthView = () => {
    const daysInMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0
    ).getDate();
    const firstDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    ).getDay();

    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

    const prevMonthDays = adjustedFirstDay;
    const prevMonthLastDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      0
    ).getDate();
    const prevMonthDates = Array.from(
      { length: prevMonthDays },
      (_, i) => prevMonthLastDay - prevMonthDays + i + 1
    );

    const nextMonthDays = 42 - (prevMonthDays + daysInMonth);
    const nextMonthDates = Array.from(
      { length: nextMonthDays },
      (_, i) => i + 1
    );

    const allDates = [
      ...prevMonthDates.map((day) => ({
        day,
        isCurrentMonth: false,
        isPrevMonth: true,
      })),
      ...Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        isCurrentMonth: true,
        isPrevMonth: false,
      })),
      ...nextMonthDates.map((day) => ({
        day,
        isCurrentMonth: false,
        isPrevMonth: false,
      })),
    ];

    return (
      <div className="grid grid-cols-7 gap-1 p-4">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div
            key={day}
            className="text-sm font-semibold text-gray-600 text-center pb-2"
          >
            {day}
          </div>
        ))}
        {allDates.map((date, i) => {
          const currentDate = new Date(
            selectedDate.getFullYear(),
            date.isPrevMonth
              ? selectedDate.getMonth() - 1
              : date.isCurrentMonth
              ? selectedDate.getMonth()
              : selectedDate.getMonth() + 1,
            date.day
          );

          return (
            <div
              key={i}
              className={`min-h-16 p-1 border rounded text-sm 
                ${date.isCurrentMonth ? "text-black" : "text-gray-400"} 
                hover:bg-[#f7d9d4]
                ${
                  selectedDate.getDate() === date.day && date.isCurrentMonth
                    ? "bg-[#DA4735] border-[#DA4735] text-white"
                    : ""
                }`}
              onClick={() => date.isCurrentMonth && handleDateClick(date.day)}
            >
              <div className="text-right p-1">{date.day}</div>
              <div className="overflow-hidden max-h-12">
                {renderEvents(currentDate)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  const renderWorkWeekView = () => {
    const startOfWeek = new Date(selectedDate);
    // Adjust to Monday (if Sunday, go back 6 days; otherwise go to previous Monday)
    const dayOfWeek = startOfWeek.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // How many days to subtract to get to Monday
    startOfWeek.setDate(startOfWeek.getDate() - diff);

    // Only show Monday to Friday (5 days)
    const days = Array.from({ length: 5 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });

    return (
      <div className="grid grid-cols-6 border-t border-l">
        <div className="border-b border-r p-1"></div>
        {days.map((day) => (
          <div
            key={day.toDateString()}
            className="border-b border-r p-2 text-center"
          >
            <div className="text-sm text-gray-600">
              {day.toLocaleDateString("default", { weekday: "short" })}
            </div>
            <div
              className={`text-lg 
              ${
                day.getDate() === selectedDate.getDate()
                  ? "bg-[#DA4735] text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                  : ""
              }`}
            >
              {day.getDate()}
            </div>
          </div>
        ))}

        {Array.from({ length: 24 }).map((_, i) => (
          <React.Fragment key={i}>
            <div className="border-b border-r p-1 text-right text-xs text-gray-500 pr-2">
              {i}:00
            </div>
            {days.map((day) => {
              const hourDate = new Date(day);
              hourDate.setHours(i);
              return (
                <div
                  key={`${i}-${day.getDay()}`}
                  className="border-b border-r h-12 hover:bg-[#f7d9d4] cursor-pointer relative"
                  onClick={() => {
                    setSelectedDate(hourDate);
                    setView("Day");
                  }}
                >
                  {renderEvents(hourDate)}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    );
  };
  const renderWeekView = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay() + 1);

    const days = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });

    return (
      <div className="grid grid-cols-8 border-t border-l">
        <div className="border-b border-r p-1"></div>
        {days.map((day) => (
          <div
            key={day.toDateString()}
            className="border-b border-r p-2 text-center"
          >
            <div className="text-sm text-gray-600">
              {day.toLocaleDateString("default", { weekday: "short" })}
            </div>
            <div
              className={`text-lg 
              ${
                day.getDate() === selectedDate.getDate()
                  ? "bg-[#DA4735] text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                  : ""
              }`}
            >
              {day.getDate()}
            </div>
          </div>
        ))}

        {Array.from({ length: 24 }).map((_, i) => (
          <React.Fragment key={i}>
            <div className="border-b border-r p-1 text-right text-xs text-gray-500 pr-2">
              {i}:00
            </div>
            {days.map((day) => {
              const hourDate = new Date(day);
              hourDate.setHours(i);
              return (
                <div
                  key={`${i}-${day.getDay()}`}
                  className="border-b border-r h-12 hover:bg-[#f7d9d4] cursor-pointer relative"
                  onClick={() => {
                    setSelectedDate(hourDate);
                    setView("Day");
                  }}
                >
                  {renderEvents(hourDate)}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    return (
      <div className="grid grid-cols-1 divide-y">
        {Array.from({ length: 24 }).map((_, i) => {
          const hourDate = new Date(selectedDate);
          hourDate.setHours(i, 0, 0, 0);
          const isCurrentHour =
            new Date().getHours() === i &&
            new Date().toDateString() === selectedDate.toDateString();

          return (
            <div
              key={i}
              className={`p-4 flex items-start ${
                isCurrentHour ? "bg-[#f7d9d4]" : ""
              }`}
            >
              <div className="w-16 text-right pr-2 text-gray-500">
                {i.toString().padStart(2, "0")}:00
              </div>
              <div className="flex-1 border-l-2 pl-4 min-h-12">
                {renderEvents(hourDate)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <button
            onClick={() => actions[view](-1)}
            className="p-2 rounded-full hover:bg-[#f7d9d4] text-[#DA4735]"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() => actions[view](1)}
            className="p-2 rounded-full hover:bg-[#f7d9d4] text-[#DA4735]"
          >
            <FaChevronRight />
          </button>
        </div>
        <div className="text-xl font-semibold">
          {view === "Year" &&
            selectedDate.toLocaleDateString("default", { year: "numeric" })}
          {view === "Month" &&
            selectedDate.toLocaleDateString("default", {
              year: "numeric",
              month: "long",
            })}
          {view === "Week" &&
            `Week of ${selectedDate.toLocaleDateString("default", {
              month: "short",
              day: "numeric",
            })}`}
          {view === "Day" &&
            selectedDate.toLocaleDateString("default", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
        </div>
        <div className="flex space-x-2">
          {["Day", "Week", "Work Week", "Month", "Year"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 rounded-md text-sm 
      ${
        view === v
          ? "bg-[#DA4735] text-black "
          : "bg-black-100 hover:bg-black-200"
      }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {events && events.length > 0 ? (
          <>
            {view === "Year" && renderYearView()}
            {view === "Month" && renderMonthView()}
            {view === "Work Week" && renderWorkWeekView()}
            {view === "Week" && renderWeekView()}
            {view === "Day" && renderDayView()}
          </>
        ) : (
          <div className="p-4 text-gray-600">No events to display</div>
        )}
      </div>
    </div>
  );
};

export default Home;
