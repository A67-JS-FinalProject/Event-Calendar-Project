import { useState } from "react";
import React from "react";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";

const Home = () => {
  const [view, setView] = useState("year");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const changeMonth = (offset) => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() + offset, 1)
    );
  };

  const changeYear = (offset) => {
    setSelectedDate(
      new Date(selectedDate.getFullYear() + offset, selectedDate.getMonth(), 1)
    );
  };

  const changeWeek = (offset) => {
    setSelectedDate(
      new Date(selectedDate.setDate(selectedDate.getDate() + offset * 7))
    );
  };

  const changeDay = (offset) => {
    setSelectedDate(
      new Date(selectedDate.setDate(selectedDate.getDate() + offset))
    );
  };

  const handleDateClick = (day) => {
    const newDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      day
    );
    setSelectedDate(newDate);
    setView("day");
  };

  const renderYearView = () => {
    return (
      <div className="p-4 bg-base-100 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold text-primary">
            {selectedDate.getFullYear()}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="border p-4 rounded-lg cursor-pointer hover:bg-gray-200 text-center text-lg font-semibold"
              onClick={() => {
                setSelectedDate(new Date(selectedDate.getFullYear(), i, 1));
                setView("month");
              }}
            >
              {new Date(selectedDate.getFullYear(), i, 1).toLocaleString(
                "default",
                { month: "long" }
              )}
            </div>
          ))}
        </div>
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

    // Adjust firstDay to make Monday the first day of the week
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

    return (
      <div className="p-4 bg-base-100 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold text-primary">
            {selectedDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="grid grid-cols-7 text-center font-bold mb-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="text-lg text-secondary">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 grid-rows-6 gap-2">
          {Array.from({ length: adjustedFirstDay }).map((_, i) => (
            <div key={i}></div>
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => (
            <div
              key={i}
              className="border p-4 text-center cursor-pointer hover:bg-blue-100 rounded-lg text-lg font-semibold"
              onClick={() => handleDateClick(i + 1)}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay() + 1);

    return (
      <div className="p-4 bg-base-100 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold text-primary">
            Week of {startOfWeek.toDateString()}
          </span>
        </div>
        <div className="grid grid-cols-8">
          <div></div>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="text-center font-bold text-secondary">
              {day}
            </div>
          ))}
          {Array.from({ length: 24 }).map((_, i) => (
            <React.Fragment key={i}>
              <div className="inline-block w-fit h-fit text-right p-0 m-0 pr-2 text-secondary">
                {i}:00
              </div>
              {Array.from({ length: 7 }).map((_, j) => (
                <div key={`${i}-${j}`} className="border h-10"></div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    return (
      <div className="p-4 bg-base-100 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold text-primary">
            {selectedDate.toDateString()}
          </span>
        </div>
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="border text-blue-600 p-2 ">
            {i}:00
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <nav className="bg-gray-800 text-white p-4 flex flex-row items-center">
        <h1 className="text-2xl font-bold">Event Calendar</h1>
        <div className="">
          {view === "day" && (
            <>
              <li className="text-decoration-none">
                <button
                  className="btn btn-primary"
                  onClick={() => changeDay(-1)}
                >
                  <FaChevronLeft />
                </button>
              </li>
              <li className="text-decoration-none">
                <button
                  className="btn btn-primary"
                  onClick={() => changeDay(1)}
                >
                  <FaChevronRight />
                </button>
              </li>
            </>
          )}
          {view === "week" && (
            <>
              <li className="text-decoration-none">
                <button
                  className="btn btn-primary"
                  onClick={() => changeWeek(-1)}
                >
                  <FaChevronLeft />
                </button>
              </li>
              <li className="text-decoration-none">
                <button
                  className="btn btn-primary"
                  onClick={() => changeWeek(1)}
                >
                  <FaChevronRight />
                </button>
              </li>
            </>
          )}
          {view === "month" && (
            <>
              <li className="text-decoration-none">
                <button
                  className="btn btn-primary"
                  onClick={() => changeMonth(-1)}
                >
                  <FaChevronLeft />
                </button>
              </li>
              <li className="text-decoration-none">
                <button
                  className="btn btn-primary"
                  onClick={() => changeMonth(1)}
                >
                  <FaChevronRight />
                </button>
              </li>
            </>
          )}
          {view === "year" && (
            <>
              <li className="text-decoration-none">
                <button
                  className="btn btn-primary"
                  onClick={() => changeYear(-1)}
                >
                  <FaChevronLeft />
                </button>
              </li>
              <li className="text-decoration-none">
                <button
                  className="btn btn-primary"
                  onClick={() => changeYear(1)}
                >
                  <FaChevronRight />
                </button>
              </li>
            </>
          )}
        </div>
        <div>
          <details className="dropdown">
            <summary className="btn m-1">Select View</summary>

            <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
              <li className="text-decoration-none">
                <button
                  className="w-full text-left p-2 hover:bg-gray-600"
                  onClick={() => setView("day")}
                >
                  Day View
                </button>
              </li>
              <li className="text-decoration-none">
                <button
                  className="w-full text-left p-2 hover:bg-gray-600"
                  onClick={() => setView("week")}
                >
                  Week View
                </button>
              </li>
              <li className="text-decoration-none">
                <button
                  className="w-full text-left p-2 hover:bg-gray-600"
                  onClick={() => setView("month")}
                >
                  Month View
                </button>
              </li>
              <li className="text-decoration-none">
                <button
                  className="w-full text-left p-2 hover:bg-gray-600"
                  onClick={() => setView("year")}
                >
                  Year View
                </button>
              </li>
            </ul>
          </details>
        </div>
      </nav>
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-3/15 bg-gray-800 text-white p-4">
          <ul className="space-y-2">
            <li className="text-decoration-none">
              <button
                className="w-full text-left p-2 bg-gray-700 rounded"
                onClick={() => setView("month")}
              >
                Create A Event
              </button>
            </li>
          </ul>
        </aside>

        {/* Calendar */}
        <div className="w-14/15 p-4 overflow-auto">
          {view === "year" && renderYearView()}
          {view === "month" && renderMonthView()}
          {view === "week" && renderWeekView()}
          {view === "day" && renderDayView()}
        </div>
      </div>
    </>
  );
};

export default Home;
