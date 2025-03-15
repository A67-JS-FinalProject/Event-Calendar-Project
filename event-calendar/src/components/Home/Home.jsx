import { useEffect, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { GoTriangleDown } from "react-icons/go";
import { FaRegCalendarAlt } from "react-icons/fa";
import { LuListTodo } from "react-icons/lu";
import { FaPlus } from "react-icons/fa";
import CreateAnEvent from "../CreateAEvent/CreateAnEvent";

import logo from "../../assets/logo.png";

const Home = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("Year");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  useEffect(() => {
    document.title = "Event Calendar";
    fetch("/api/events");
  }, []);

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
    const months = Array.from({ length: 12 }, (_, i) => i);

    return (
      <div className=" m-0 bg-red-100 rounded-[3rem] w-98/100 h-  pb-40 pt-7 pr-0 shadow-md">
        <div className="grid grid-cols-4 gap-2.5">
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
              <div
                key={month}
                className="flex flex-col rounded-md w-4xs h-4xs px-8 justify-center"
              >
                <div className="text-start font-bold text-base mb-1">
                  {new Date(
                    selectedDate.getFullYear(),
                    month,
                    1
                  ).toLocaleString("default", { month: "short" })}
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                    <div
                      key={`${day}-${index}`}
                      className="text-[13px] text-black text-center"
                    >
                      {day}
                    </div>
                  ))}
                  {allDates.map((date, i) => (
                    <div
                      key={i}
                      onClick={() => handleDateClick(date.day)}
                      className="text-center text-[13px] mx-1 cursor-pointer text-black hover:bg-gray-200 rounded-full w-7 h-7 flex items-center justify-center"
                    >
                      {date.day}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
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
      <div className="p-4 bg-base-100 rounded-lg shadow-md w-full h-full">
        <div className="flex justify-between items-center mb-4"></div>
        <div className="grid grid-cols-7 text-center font-bold ">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="text-lg  border">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 grid-rows-7 w-full h-full">
          {allDates.map((date, i) => (
            <div
              key={i}
              className={`text-center cursor-pointer h-30  hover:bg-blue-100 border text-lg font-semibold ${
                date.isCurrentMonth
                  ? "text-black"
                  : "text-gray-400 border-black"
              }`}
              onClick={() => date.isCurrentMonth && handleDateClick(date.day)}
            >
              {date.day}
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
          <span className="text-xl font-bold text-primary"></span>
        </div>
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="border text-blue-600 p-2">
            {i}:00
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <nav className="bg-gray-800 text-white p-4 flex items-center justify-between">
        {/* Left: Hamburger + Logo + Navigation */}
        <div className="flex items-center gap-4">
          <button className="btn btn-ghost" onClick={() => setIsOpen(!isOpen)}>
            <RxHamburgerMenu className="text-3xl" />
          </button>
          <img src={logo} alt="Logo" className="h-8" />

          {actions[view] && (
            <ul className="flex items-center gap-2">
              {[-1, 1].map((dir) => (
                <li key={dir}>
                  <button
                    className=" p-3 hover:bg-gray-600 hover:rounded-full hover:scale-105 transition duration-300"
                    onClick={() => actions[view](dir)}
                  >
                    {dir === -1 ? <FaChevronLeft /> : <FaChevronRight />}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {/* Display Selected Date */}
          <div className="text-lg font-semibold">
            {view === "Year" &&
              selectedDate.toLocaleDateString("default", {
                year: "numeric",
              })}
            {view === "Month" &&
              selectedDate.toLocaleDateString("default", {
                year: "numeric",
                month: "long",
              })}
            {view === "Week" &&
              selectedDate.toLocaleDateString("default", {
                month: "long",
                year: "numeric",
              })}
            {view === "Day" &&
              selectedDate.toLocaleDateString("default", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
          </div>
        </div>

        {/* Right: Dropdowns & Icons */}
        <div className="flex items-center gap-4">
          {/* View Selection Dropdown */}
          <details className="dropdown border-2 divide-x rounded-full p-1">
            <summary className="btn btn-ghost rounded-full flex items-center">
              {view} <GoTriangleDown className="ml-2" />
            </summary>
            <ul className="menu m-3 dropdown-content bg-base-100 rounded-box shadow-lg z-10 w-52 p-2">
              {["Day", "Week", "Month", "Year"].map((v) => (
                <li key={v}>
                  <button
                    className="w-full text-left p-2 hover:bg-gray-600"
                    onClick={() => setView(v)}
                  >
                    {v}
                  </button>
                </li>
              ))}
            </ul>
          </details>

          {/* Calendar & To-Do Icons */}
          <div className="flex items-center border-2 divide-x rounded-full px-4 py-2">
            <div className="p-2">
              <FaRegCalendarAlt className="mr-2" />
            </div>
            <div className="p-2">
              <LuListTodo className="ml-2" />
            </div>
          </div>

          {/* Profile Dropdown */}
          <details className="dropdown">
            <summary className="btn btn-ghost rounded-full">
              <img src=" " alt="" /> <GoTriangleDown />
            </summary>
            <ul className="menu dropdown-content bg-base-100 rounded-box shadow-lg z-10 w-52 p-2">
            <li>
                <button onClick={() => navigate("/dashboard")}>
                  Profile
                </button>
              </li>        <li>
                <button onClick={() => navigate("/home/profile")}>
                  Profile Details
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/home/profile")}>
                  My Events
                </button>
              </li>
            </ul>
          </details>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex h-full bg-gray-800 p-0">
        <CreateAnEvent isOpen={isModalOpen} onRequestClose={closeModal} />
        {/* Sidebar */}
        <div className="flex h-full bg-gray-800 p-0">
          {/* Sidebar */}
          <div
            className={`bg-gray-800 h-screen shadow-lg transition-all duration-300 ease-in-out p-0 ${
              isOpen ? "w-72" : "w-20 overflow-hidden"
            }`}
          >
            <ul className="menu p-4">
              <li>
                <button
                  className={`w-full text-left p-2 bg-gray-700 rounded-2xl transition-all transform duration-200 ease-in-out ${
                    isOpen ? "scale-100" : "scale-90"
                  }`}
                  onClick={() => setView("Month")}
                >
                  <div
                    className={`flex items-center ${
                      isOpen ? "opacity-100" : "opacity-100"
                    } transition-opacity duration-300 ease-in-out`}
                  >
                    {isOpen && (
                      <button
                        onClick={openModal}
                        className="text-lg font-medium flex flex-row  items-center pr-3"
                      >
                        <FaPlus className="text-2xl m-2" />
                        Create
                      </button>
                    )}
                  </div>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="flex-1 p-0 pt-1 bg-gray-800  w-98/100 h-full  overflow-auto">
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
