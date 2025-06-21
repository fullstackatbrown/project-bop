import "./Team.css";
import { useState, useEffect } from "react";
import { publicUrl } from "../publicUrl";
import { cosmic } from "../cosmic";

export default function Team() {
    return (
        <div className="team-container">
            <Banner />
            <TeamSections />
            <br />
        </div>
    );
}

function Banner() {
    return (
        <div className="relative w-full flex flex-col md:flex-row">
            {/* Background image container */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${publicUrl("/pics/team_group.avif")})` }}
            />

            {/* Blue section */}
            <div className="relative min-h-[300px] md:min-h-[420px] lg:min-h-[600px] w-full md:w-1/2 flex items-center justify-center px-12 md:px-16 lg:px-20 lg:px-24 py-12 bg-[#133578d6] z-10">
                <div className="text-white flex flex-col max-w-md">
                    <h1 className="text-5xl md:text-6xl font-avenir font-bold my-0">
                        We are BOP.
                    </h1>
                    <h1 className="text-4xl md:text-6xl text-center font-avenir font-medium leading-none my-0">
                        &mdash;
                    </h1>
                    <p className="mt-4 text-3xl text-white lg:text-4xl font-avenir font-bold leading-[35px] lg:leading-[55px]">
                        We make it easy to gauge what Brunonians really think.
                    </p>
                    <p className="font-bold mt-6 text-sm md:text-lg text-white font-avenir">
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
            <div className="relative min-h-[300px] md:min-h-[420px] lg:min-h-[600px] w-full md:w-1/2 flex items-center justify-center px-12 md:px-16 lg:px-24 py-12 bg-[#e21c21c3] z-10">
                <div className="flex flex-col text-white text-md md:text-lg lg:text-xl font-avenir font-bold leading-relaxed lg:leading-[40px] max-w-md text-center w-full">
                    <p style={{ fontSize: "20px" }}>
                        The Brown Opinion Project is a student-run organization and
                        publication that measures public opinion within the Brown University
                        undergraduate community. We publish findings on our website and
                        social media to amplify student voices, encourage meaningful
                        discourse on campus, and cultivate a better understanding of the
                        Brown student body.
                    </p>

                    {/* Social Media Icons (Right-aligned) */}
                    <div
                        style={{ paddingTop: "16px" }}
                        className="flex space-x-2 mt-4 self-end"
                    >
                        <a
                            href="https://www.instagram.com/brownopinionproject/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={publicUrl("/logos/team_instagram.avif")}
                                alt="Instagram"
                                className="w-8 h-8"
                            />
                        </a>
                        <a
                            href="https://twitter.com/brownu_opinion"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={publicUrl("/logos/team_twitter.avif")}
                                alt="Twitter"
                                className="w-8 h-8"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AlumniSection({ alumni }) {
    return (
        <div className="alumni-section">
            {alumni.map((person, index) => (
                <div key={index} className={`alumni-row ${index % 2 === 0 ? "light-blue" : "light-gray"}`}>
                    <span className="alumni-name">{person.name}</span>
                    <span className="alumni-position">{person.position}</span>
                    <span className="alumni-term">{person.term}</span>
                </div>
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
            const sortMembers = start => {
                try {
                    let end = [start.find(member => member.metadata.id_above == "0")];
                    while (end.length < start.length) {
                        end.push(start.find(member => member.metadata.id_above == end[end.length - 1].id));
                    }
                    return end;
                } catch (err) {
                    console.error("sort failed");
                    return start;
                }
            };

            try {
                const response = await cosmic.objects.find({ type: "team-members" });

                const members = sortMembers(response.objects);

                let execsList = [];
                let staffList = [];

                for (const member of members) {
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
            <div
                className="title text-center mt-8 py-6 font-avenir font-bold text-3xl md:text-5xl lg:text-6xl"
                style={{ fontSize: "45px" }}
            >
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
                style={{
                    backgroundColor: "#32488f",
                    marginBottom: 40,
                    marginTop: 30,
                    width: "100%",
                }}
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
                        position: "Founder & Co-President",
                        term: "Spring 2021 - Spring 2023",
                    },
                    {
                        name: "Molley Siegel ('23)",
                        position: "Founder & Co-President",
                        term: "Spring 2021 - Spring 2023",
                    },
                ]}
            />
        </>
    );
}

function Section({ title, style, members = [] }) {
    return (
        <div>
            <div
                style={{ ...style, paddingLeft: "5vw" }}
                className={title.split(" ")[0]}
            >
                <h2 className="section-title subheading-banner font-avenir h-[75px] md:h-[100px]">
                    {title}
                </h2>
            </div>
            {members.length > 0 && <TeamGrid members={members} />}
        </div>
    );
}

function TeamGrid({ members }) {
    return (
        <div className="team-grid mx-5">
            {members.map((member, index) => {
                let memberPhoto = member.photo ? member.photo.url : publicUrl("/logos/bop_red.avif");

                return (
                    <div key={index} className="member-card">
                        <img src={memberPhoto} alt={member.name} className="member-image" />
                        <h2 className="member-name font-bold font-avenir">{member.name}</h2>
                        <p className="member-position font-bold">{member.club_title}</p>
                    </div>
                );
            })}
        </div>
    );
}
