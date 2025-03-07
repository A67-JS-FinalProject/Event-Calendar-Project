import { useEffect, useState } from "react";
import { getEventById } from "../servise/eventServise";

function RenderEvent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getEventById(`67c9dee4ff7fc07b94f36e98`);
      setData(result);
    };

    fetchData();
  }, []);
  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    // title,
    // startDate,
    // endDate,
    // location,
    // description,
    // participants,
    // isPublic,
    // isRecurring,
    // coverPhoto,
    // tags,
    // reminders,
    <>
      <h1 color="black">Creta</h1>
      <h2>{data.title}</h2>
      <p>{data.description}</p>
      <p>Start Date: {data.startDate}</p>
      <p>End Date: {data.endDate}</p>
      <p>Location: {data.location}</p>
    </>
  );
}

export default RenderEvent;
