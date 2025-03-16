import NavBarPublic from "../NavBarPublic/NavBarPublic";

function LandingPage() {
  return (
    <div className="home text-center">
      <NavBarPublic />
      <div className="flex flex-col items-center text-center mt-16 px-5">
        <h1 className="text-4xl font-bold">
          Stay Ahead with Our <br />
          <span className="text-orange-600">Event Calendar</span>
        </h1>
        <button className="btn btn-error text-white mt-6 px-20 py-6 text-lg rounded-full">
          START IMPROVING YOUR ORGANIZATION TODAY
        </button>
        <div className="mt-12"></div>
      </div>
    </div>
  );
}

export default LandingPage;
