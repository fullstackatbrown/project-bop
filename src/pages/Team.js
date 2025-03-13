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
    <div className="image-banner">
      <div className="blue-filter">
        <p className="banner-text left-text">Placeholder text.</p>
      </div>
      <div className="red-filter">
        <div className="text" style={{ fontSize: "2vw", lineHeight: "2" }}>
          The Brown Opinion Project is a student-run organization and
          publication that measures public opinion within the Brown University
          undergraduate community. We publish findings on our website and social
          media to amplify student voices, encourage meaningful discourse on
          campus, and cultivate a better understanding of the Brown student
          body.
        </div>
      </div>
    </div>
  );
}

function AlumniSection({ alumni }) {
  return (
    <div className="alumni-section">
      {alumni.map((person, index) => {
        return (<AlumniRow key={index} index={index} {...person} />);
      })}
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
          if (member.metadata.section == "executive") {
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
      <div className="center">
        <span className="title">Meet the Team</span>
      </div>

      <Section
        title="Executive Members"
        style={{ backgroundColor: "#304acf" }}
        members={executives}
      />

      <Section
        title="Staff Members"
        style={{ backgroundColor: "#ad2a2a" }}
        members={staff}
      />

      <Section
        title="Leadership Alumni"
        style={{ backgroundColor: "#304acf" }}
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
      <div style={{ ...style, width: "100%", paddingLeft: "5vw" }}>
        <h2 className="section-title subheading-banner">{title}</h2>
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
