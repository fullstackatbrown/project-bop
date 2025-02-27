import "./Team.css";
import MemberCard from "../MemberCard";

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
                    The Brown Opinion Project is a student-run organization and publication that measures public opinion within the 
                    Brown University undergraduate community. We publish findings on our website and social media to amplify student
                    voices, encourage meaningful discourse on campus, and cultivate a better understanding of the Brown student body.
                </div>
            </div>
        </div>
    );
}

function TeamSections() {
    return (
        <>
            <div className="center">
                <span className="title">Meet the Team</span>
            </div>

            <Section 
                title="Executive Members" 
                style={{ backgroundColor: "#304acf" }} 
                members={[
                    { name: "Some Name", position: "President" },
                    { name: "Some Name", position: "Vice President" },
                    { name: "Some Name", position: "Director of Operations" }
                ]}
            />

            <Section 
                title="Staff Members" 
                style={{ backgroundColor: "#ad2a2a" }} 
                members={[
                    { name: "Some Name", position: "Research Lead" },
                    { name: "Some Name", position: "Data Analyst" },
                    { name: "Some Name", position: "Communications Manager" }
                ]}
            />

            <Section 
                title="Leadership Alumni" 
                style={{ backgroundColor: "#FF9800" }} 
                members={[
                    { name: "Some Name", position: "Former President" },
                    { name: "Some Name", position: "Former Research Head" }
                ]}
            />
        </>
    );
}

function Section({ title, style, members }) {
    return (
        <div>
            <div style={{ ...style, width: "100%" }}>
                <h2 className="section-title subheading-banner">{title}</h2>
            </div>
            <TeamGrid members={members} />
        </div>
        
    );
}

function TeamGrid({ members }) {
    return (
        <div className="team-grid">
            {members.map((member, index) => (
                <MemberCard key={index} {...member} />
            ))}
        </div>
    );
}
