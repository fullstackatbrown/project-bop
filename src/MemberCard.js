import "./MemberCard.css";

export default function MemberCard({ name, position, image }) {
    return (
        <div className="member-card">
            <img src={image || "/bop_logo.avif"} alt={name} className="member-image" />
            <h2 className="member-name">{name}</h2>
            <p className="member-position">{position}</p>
        </div>
    );
}
