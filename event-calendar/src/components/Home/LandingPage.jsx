import { useState } from "react";
import NavBarPublic from "../NavBarPublic/NavBarPublic";
import {
  FaCalendarAlt,
  FaUsers,
  FaBell,
  FaUserPlus,
  FaLockOpen,
  FaRocket,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

function LandingPage() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I create an event?",
      answer:
        "Simply sign up for an account, click on 'Create Event' in your dashboard, fill in the details, and save. You can then invite participants and set reminders.",
    },
    {
      question: "Can I collaborate with others on event planning?",
      answer:
        "Yes! Our platform allows you to invite other users to your events, manage participants, and collaborate seamlessly. Event creators can invite or disinvite participants at any time.",
    },
    {
      question: "What calendar views are available?",
      answer:
        "Our calendar supports day, week, month, and work week views - all built from scratch without external libraries for optimal performance and customization.",
    },
    {
      question: "How do recurring events work?",
      answer:
        "You can create event series that repeat weekly, monthly, or yearly. Each series can have an end date or run indefinitely, perfect for regular meetings or reminders.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely. We use industry-standard security practices. Only authenticated users can access private content, and admin controls ensure proper user management.",
    },
  ];

  const teamMembers = [
    {
      name: "Nikolay",
      role: "Backend Developer",
      bio: "Specializes in authentication systems and calendar logic implementation.",
      funFact: "Can solve complex algorithms while sleeping.",
    },
    {
      name: "Atanas",
      role: "Frontend Developer",
      bio: "Focuses on responsive UI design and calendar view implementations.",
      funFact: "Once coded for 48 hours straight during a hackathon.",
    },
    {
      name: "Martin",
      role: "Full-stack Developer",
      bio: "Handles user management features and event collaboration systems.",
      funFact:
        "Believes every problem can be solved with proper state management.",
    },
  ];

  const features = [
    {
      icon: <FaCalendarAlt />,
      title: "Comprehensive Calendar System",
      description:
        "Custom-built calendar with day, week, month, and work week views. Create and manage events with detailed information including cover photos, locations, and participant lists.",
    },
    {
      icon: <FaUsers />,
      title: "Advanced User Management",
      description:
        "Secure authentication system with public registration. Private user profiles with editable personal information. Powerful search to find other users by name, phone, or email.",
    },
    {
      icon: <FaBell />,
      title: "Event Collaboration Tools",
      description:
        "Invite system with accept/decline functionality. Event series with flexible scheduling options. Tag system for easy event organization and filtering.",
    },
  ];

  return (
    <div className="font-sans bg-white">
      <NavBarPublic />

      {/* Hero Section with Search and Auth */}
      <section className="relative bg-[#DA4735] py-24 text-center text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            EventHub Pro
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed">
            A complete event management solution with custom calendar views,
            user collaboration, and advanced scheduling features - all built
            from the ground up.
          </p>

          {/* Auth Buttons */}
          <div className="flex flex-row sm:flex-col justify-center gap-4">
            <a
              href="/login"
              className=" cursor-pointer bg-white hover:bg-gray-100 text-[#DA4735] font-semibold py-4 px-8 rounded-full flex items-center justify-center gap-2 transition-colors duration-300"
            >
              <FaLockOpen /> Login
            </a>
            <a
              href="/register"
              className="cursor-pointer bg-transparent hover:bg-[#c23f2f] border-2 border-white text-white font-semibold py-4 px-8 rounded-full flex items-center justify-center gap-2 transition-colors duration-300"
            >
              <FaUserPlus /> Register
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-[#DA4735] text-5xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-[#DA4735] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 font-bold text-2xl">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Register or Login
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Anonymous users can register for free or login to access their
                private calendar area.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-[#DA4735] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 font-bold text-2xl">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Manage Your Calendar
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Use our custom-built calendar views to create events, set up
                recurring series, and organize with tags.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-[#DA4735] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 font-bold text-2xl">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Collaborate with Others
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Search for users, invite them to events, and manage
                participants. Accept or decline invitations you receive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Meet Our Development Team
            </h2>
            <div className="w-24 h-1 bg-[#DA4735] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
              >
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 overflow-hidden">
                  <div className="w-full h-full bg-[#DA4735] opacity-20 flex items-center justify-center">
                    <span className="text-4xl text-[#DA4735] font-bold">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  {member.name}
                </h4>
                <p className="text-[#DA4735] font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 mb-4">{member.bio}</p>
                <p className="text-sm text-gray-500 italic">
                  Fun fact: {member.funFact}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl shadow-md overflow-hidden transition-shadow hover:shadow-lg duration-300"
              >
                <button
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {faq.question}
                  </h3>
                  {activeIndex === index ? (
                    <FaChevronUp className="text-[#DA4735] text-xl" />
                  ) : (
                    <FaChevronDown className="text-[#DA4735] text-xl" />
                  )}
                </button>
                {activeIndex === index && (
                  <div className="px-8 pb-8 pt-4 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-[#DA4735] text-white">
        <div className="container mx-auto px-4 text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience Our Custom Calendar Solution?
          </h2>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed">
            Join now to access powerful event management features with our
            custom-built calendar system.
          </p>
          <a
            href="/register"
            className="bg-white hover:bg-gray-100 text-[#DA4735] font-semibold py-4 px-10 rounded-full text-lg flex items-center gap-2 transition-colors duration-300"
          >
            <FaRocket /> Get Started for Free
          </a>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
