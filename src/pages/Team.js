import "./Team.css";
import MemberCard from "../MemberCard";
import AlumniRow from "../AlumniRow";
import { createBucketClient } from "@cosmicjs/sdk";
import { useState, useEffect } from "react";

export default function Team() {
  return (
    <div className="team-container">
      <Banner />
      <TeamSections />
    </div>
  );
}

function Banner() {
  return (
    <div className="relative w-full flex flex-col md:flex-row">
      {/* Background image container */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: "url('/bop_team_pic.avif')" }}
      />
      
      {/* Blue section */}
      <div className="relative min-h-[300px] md:min-h-[420px] lg:min-h-[600px] w-full md:w-1/2 flex items-center justify-start px-12 md:px-16 lg:px-20 lg:px-24 py-12 bg-[#133578b5] z-10">
        <div className="text-white flex flex-col max-w-md">
          <h1 className="text-left text-5xl md:text-6xl font-avenir font-bold my-0">We are BOP.</h1>
          <h1 className="text-4xl md:text-6xl justify-center text-center font-avenir font-medium leading-none my-0">&mdash;</h1>
          <p className="text-left mt-4 text-3xl lg:text-4xl font-avenir font-bold leading-[50px] lg:leading-[55px]">
            We make it easy to gauge what Brunonians really think.
          </p>
          <p className="text-left font-bold mt-6 text-sm md:text-lg font-avenir">
            If you have any interest in joining the team or have any questions,
            feel free to reach out to{" "}
            <a
              href="mailto:brownopinionproject@brown.edu"
              className="underline hover:text-blue-400"
            >
              brownopinionproject@brown.edu
            </a>
          </p>
        </div>
      </div>

      {/* Red section */} 
      <div className="relative min-h-[300px] md:min-h-[420px] lg:min-h-[600px] w-full md:w-1/2 flex items-center justify-center px-12 md:px-16 lg:px-24 py-12 bg-[#e21c21a6] z-10">
        <div className="flex flex-col text-white text-md md:text-lg lg:text-xl font-avenir font-bold leading-relaxed lg:leading-[40px] max-w-md text-center w-full">
          <p>
            The Brown Opinion Project is a student-run organization and
            publication that measures public opinion within the Brown University
            undergraduate community. We publish findings on our website and social
            media to amplify student voices, encourage meaningful discourse on
            campus, and cultivate a better understanding of the Brown student
            body.
          </p>

          {/* Social Media Icons (Right-aligned) */}
          <div style={{ paddingTop: "16px"}} className="flex space-x-2 mt-4 self-end">
            <a href="https://www.instagram.com/brownopinionproject/" target="_blank" rel="noopener noreferrer">
              <img src="/bop_ig_logo.avif" alt="Instagram" className="w-8 h-8" />
            </a>
            <a href="https://twitter.com/brownu_opinion" target="_blank" rel="noopener noreferrer">
              <img src="/bop_twitter_logo.avif" alt="Twitter" className="w-8 h-8" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlumniSection({ alumni }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <div className="alumni-section">
      {alumni.map((person, index) => (
        <AlumniRow
          key={index}
          index={index}
          {...person}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
      ))}
    </div>
  );
}

function TeamSections() {
  const [executives, setExecutives] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const cosmic = createBucketClient({
          bucketSlug: "bop-backend-production",
          readKey: "8N6HiTQekcWvzJbMA4qSeTbIcb11wLI04UpzC68HzLyd2uuiXz",
        });

        const response = await cosmic.objects
          .find({ type: "members" })
          .limit(100)
          .props("metadata")
          .depth(1);

        let execsList = [];
        let staffList = [];

        for (const member of response.objects) {
          if (member.metadata.section === "executive") {
            execsList.push(member.metadata);
          } else {
            staffList.push(member.metadata);
          }
        }

        staffList.reverse();

        setExecutives(execsList);
        setStaff(staffList);
        setLoading(false);
      } catch (err) {
        console.log("Failed to fetch");
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="title center font-avenir font-bold text-3xl md:text-5xl lg:text-6xl">
        Meet the Team
      </div>

      <Section
        title="Executive Board"
        style={{ backgroundColor: "#32488f", marginTop: 60, width: "100%" }}
        members={executives}
      />

      <Section
        title="Staff Members"
        style={{ backgroundColor: "#9e2b25", marginTop: 60, width: "100%" }}
        members={staff}
      />

      <Section
        title="Leadership Alumni"
        style={{ backgroundColor: "#32488f", marginBottom: 40, marginTop: 30, width: "100%" }}
      />

      <AlumniSection
        alumni={[
          {
            name: "Corey Wood ('24)",
            position: "Co-President",
            term: "Fall 2023 - Spring 2024",
          },
          {
            name: "Annie Schwerdtfeger ('24)",
            position: "Co-President",
            term: "Spring 2022 - Spring 2023",
          },
          {
            name: "Noah Rosenfeld ('24)",
            position: "Chief of Staff",
            term: "Fall 2021 - Fall 2022",
          },
          {
            name: "Benji Glanz ('23)",
            position: "Co-President",
            term: "Fall 2021 - Spring 2023",
          },
          {
            name: "Justen Joffe ('23)",
            position: "Founder",
            term: "Spring 2021 - Fall 2021",
          },
          {
            name: "Gabe Merkel ('23)",
            position: "Founter & Co-President",
            term: "Spring 2021 - Spring 2023",
          },
          {
            name: "Molley Siegel ('23)",
            position: "Founder & Co-President",
            term: "Spring 2021 - Spring 2023",
          },
        ]}
      />

      <p>©2024 Brown Opinion Project</p>
    </>
  );
}

function Section({ title, style, members = [] }) {
  return (
    <div>
      <div style={{ ...style, paddingLeft: "5vw" }}>
        <h2 className="section-title subheading-banner font-avenir h-[75px] md:h-[100px]">{title}</h2>
      </div>
      {members.length > 0 && <TeamGrid members={members} />}
    </div>
  );
}

function TeamGrid({ members }) {
  return (
    <div className="team-grid">
      {members.map((member, index) => {
        let memberPhoto = member.photo ? member.photo.url : "";

        return (
          <MemberCard
            key={index}
            name={member.name}
            position={member.club_title}
            image={memberPhoto}
          />
        );
      })}
    </div>
  );
}

