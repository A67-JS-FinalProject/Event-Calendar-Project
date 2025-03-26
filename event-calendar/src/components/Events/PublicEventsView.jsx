import { getEvents } from "../../services/eventService";
import { useEffect, useState } from "react";
import NavBarPublic from "../NavBarPublic/NavBarPublic";
import { Link } from "react-router-dom";

const PublicEventsView = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const data = await getEvents();
            const publicEvents = data.filter(event => event.isPublic && new Date(event.startDate) > new Date());
            setEvents(publicEvents);
        };
        fetchEvents();
    }, []);

    return (
        <>
            <NavBarPublic />
            <div className="p-10">
                <h1 className="text-3xl font-bold mb-10 text-center">Upcoming Events</h1>
                {/* Adjust grid for responsive 3-column layout */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-9">
                    {events.length > 0 ? (
                        events.map((event) => (
                            
                            <div
                                key={event._id}
                                className="card bg-base-100 shadow-xl transform transition-transform duration-300 ease-in-out hover:scale-105 "
                            >
                                <figure>
                                    <img
                                        src={event.eventCover}
                                        alt={event.title}
                                        className="w-full h-48 object-cover"
                                    />
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title">{event.title}</h2>
                                    <p>{(event.description).slice(0, 20) + "..."}</p>
                                    <p>Start in: {new Date(event.startDate).toLocaleString()}</p>
                                    <div className="card-actions justify-end">
                                    <Link to={`/events/${event._id}`} key={event._id}>
                                        <button className="btn bg-[#DA4735] hover:bg-orange-400 text-white">View Details</button>
                                    </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center col-span-3">No events found.</p>
                    )}
                </div>
            </div>

        </>

    );
};

export default PublicEventsView;