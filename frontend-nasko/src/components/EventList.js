const [events, setEvents] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

useEffect(() => {
    fetchEvents(currentPage);
}, [currentPage]);

const fetchEvents = async (page) => {
    const response = await fetch(`/api/events?page=${page}&limit=10`);
    const data = await response.json();
    setEvents(data.events);
    setTotalPages(data.totalPages);
};

const handlePageChange = (page) => {
    setCurrentPage(page);
};

return (
    <div>
        {events.map(event => (
            <div key={event.id}>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p>{new Date(event.date).toLocaleDateString()}</p>
            </div>
        ))}
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
        />
    </div>
);

