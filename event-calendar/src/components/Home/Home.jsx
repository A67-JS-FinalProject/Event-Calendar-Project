import { useEffect, useState } from "react";
import React from "react";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { GoTriangleDown } from "react-icons/go";
import { MdAccountCircle } from "react-icons/md";

const Home = () => {
  const [view, setView] = useState("Year");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    document.title = "Event Calendar";
    fetch("/api/events");
  });

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
  const actions = {
    Day: changeDay,
    Week: changeWeek,
    Month: changeMonth,
    Year: changeYear,
  };

  const handleDateClick = (day) => {
    const newDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      day
    );
    setSelectedDate(newDate);
    setView("Day");
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
                setView("Month");
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
      <nav className="bg-gray-800 text-white p-4 flex flex-row items-center ">
        {/* Right part navbar */}
        <div className="flex flex-row items-center basis-1/2">
          <a className="btn btn-ghost  " onClick={() => setIsOpen(!isOpen)}>
            <RxHamburgerMenu className="text-3xl" />
          </a>
          <h1 className="text-2xl font-bold">Event Calendar</h1>
          <div className="">

            {actions[view] && (
              <div className="flex flex-row  items-center">
                {[-1, 1].map((dir) => (
                  <li key={dir} className="list-none px-1">
                    <button
                      className="p-3 hover:bg-secondary hover:scale-105 transition duration-300 rounded-full text-decoration-none"
                      onClick={() => actions[view](dir)}
                    >
                      {dir === -1 ? <FaChevronLeft /> : <FaChevronRight />}
                    </button>
                  </li>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Leftside navbar*/}
        <div className="flex justify-end basis-1/2">
          {/* Dropdown */}
          <details className="dropdown rounded-full">
            <summary className="btn rounded-full w-27 text-1/2 p-4">
              {view} <GoTriangleDown />
            </summary>

            <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
              <li className="text-decoration-none">
                <button
                  className="w-full text-left p-2 hover:bg-gray-600"
                  onClick={() => setView("Day")}
                >
                  Day View
                </button>
              </li>
              <li className="text-decoration-none">
                <button
                  className="w-full text-left p-2 hover:bg-gray-600"
                  onClick={() => setView("Week")}
                >
                  Week View
                </button>
              </li>
              <li className="text-decoration-none">
                <button
                  className="w-full text-left p-2 hover:bg-gray-600"
                  onClick={() => setView("Month")}
                >
                  Month View
                </button>
              </li>
              <li className="text-decoration-none">
                <button
                  className="w-full text-left p-2 hover:bg-gray-600"
                  onClick={() => setView("Year")}
                >
                  Year View
                </button>
              </li>
            </ul>
          </details>
          <div>
            <button className="btn"></button>
          </div>
          <div>
            <MdAccountCircle />
          </div>
        </div>
      </nav>
      <div className="flex h-screen">
        {/* Sidebar */}

        <div
          className={`bg-base-200 h-screen p-5 shadow-lg transition-all ${
            isOpen ? "w-64" : "w-0"
          }`}
        >
          {/* Menu Items */}
          <ul className="menu space-y-2">
            <li>
              {isOpen ? (
                <button
                  className="w-full text-left p-2 bg-gray-700 rounded"
                  onClick={() => setView("Month")}
                >
                  Create A Event
                </button>
              ) : (
                "kurrr"
              )}
            </li>
            <li>
              <a className="flex items-center gap-3 hover:bg-base-300 p-2 rounded-lg">
                {isOpen && <span>Settings</span>}
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-lg">
                {isOpen && <span>Logout</span>}
              </a>
            </li>
          </ul>
        </div>

        {/* Calendar */}
        <div className="w-14/15 p-4 overflow-auto">
          {view === "Year" && renderYearView()}
          {view === "Month" && renderMonthView()}
          {view === "Week" && renderWeekView()}
          {view === "Day" && renderDayView()}
        </div>
      </div>
    </>
  );
};

export default Home;
