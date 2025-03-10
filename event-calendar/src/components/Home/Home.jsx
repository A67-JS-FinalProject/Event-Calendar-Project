import { useState } from "react";
import React from "react";

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
          <button className="btn btn-primary" onClick={() => changeYear(-1)}>
            Prev Year
          </button>
          <span className="text-xl font-bold text-primary">
            {selectedDate.getFullYear()}
          </span>
          <button className="btn btn-primary" onClick={() => changeYear(1)}>
            Next Year
          </button>
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
          <button className="btn btn-primary" onClick={() => changeMonth(-1)}>
            Prev Month
          </button>
          <span className="text-xl font-bold text-primary">
            {selectedDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button className="btn btn-primary" onClick={() => changeMonth(1)}>
            Next Month
          </button>
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
          <button className="btn btn-primary" onClick={() => changeWeek(-1)}>
            Prev Week
          </button>
          <span className="text-xl font-bold text-primary">
            Week of {startOfWeek.toDateString()}
          </span>
          <button className="btn btn-primary" onClick={() => changeWeek(1)}>
            Next Week
          </button>
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
          <button className="btn btn-primary" onClick={() => changeDay(-1)}>
            Prev Day
          </button>
          <span className="text-xl font-bold text-primary">
            {selectedDate.toDateString()}
          </span>
          <button className="btn btn-primary" onClick={() => changeDay(1)}>
            Next Day
          </button>
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
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-3/15 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Navigation</h2>
        <ul className="space-y-2">
          <li>
            <button
              className="w-full text-left p-2 bg-gray-700 rounded"
              onClick={() => setView("month")}
            >
              Create A Event
            </button>
          </li>
          <li>
            <button
              className="w-full text-left p-2 bg-gray-700 rounded"
              onClick={() => setView("year")}
            >
              Year View
            </button>
          </li>
          <li>
            <button
              className="w-full text-left p-2 bg-gray-700 rounded"
              onClick={() => setView("month")}
            >
              Month View
            </button>
          </li>
          <li>
            <button
              className="w-full text-left p-2 bg-gray-700 rounded"
              onClick={() => setView("week")}
            >
              Week View
            </button>
          </li>
          <li>
            <button
              className="w-full text-left p-2 bg-gray-700 rounded"
              onClick={() => setView("day")}
            >
              Day View
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
  );
};

export default Home;
