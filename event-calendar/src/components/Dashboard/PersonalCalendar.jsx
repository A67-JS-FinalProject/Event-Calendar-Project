import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../store/app.context';
import { getEventsByDateRange } from '../../services/eventService';

const PersonalCalendar = () => {
  const { appState } = useContext(AppContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
        
        const monthEvents = await getEventsByDateRange(
          firstDay.toISOString(),
          lastDay.toISOString(),
          appState.token
        );
        setEvents(Array.isArray(monthEvents) ? monthEvents : []);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      }
    };

    if (appState.token) {
      fetchEvents();
    }
  }, [selectedDate, appState.token]);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendarHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-xl font-semibold">
          {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}
          className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
        >
          Previous
        </button>
        <button
          onClick={() => setSelectedDate(new Date())}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Today
        </button>
        <button
          onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}
          className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderCalendarDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map(day => (
          <div key={day} className="text-center font-semibold py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCalendarCells = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const cells = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="h-24 bg-gray-50 border"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const isToday = new Date().toDateString() === currentDate.toDateString();
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === currentDate.toDateString();
      });

      cells.push(
        <div
          key={day}
          className={`h-24 border p-2 ${isToday ? 'bg-blue-50' : 'bg-white'}`}
        >
          <div className={`font-semibold ${isToday ? 'text-blue-600' : ''}`}>{day}</div>
          <div className="overflow-y-auto h-16">
            {dayEvents.map(event => (
              <div
                key={event.id}
                className="text-xs p-1 mb-1 bg-blue-100 rounded truncate"
                title={event.title}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return <div className="grid grid-cols-7 gap-1">{cells}</div>;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {renderCalendarHeader()}
      {renderCalendarDays()}
      {renderCalendarCells()}
    </div>
  );
};

export default PersonalCalendar;