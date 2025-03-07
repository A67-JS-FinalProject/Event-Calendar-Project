import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "../servise/eventServise";

function RenderEvent() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getEventById(id);
      setData(result);
    };

    fetchData();
  }, [id]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h2>{data.title}</h2>
      <p>{data.description}</p>
      <p>Start Date: {data.startDate}</p>
      <p>End Date: {data.endDate}</p>
      <p>Location: {data.location}</p>
    </>
  );
}

export default RenderEvent;
