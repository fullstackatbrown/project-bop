import "./MemberCard.css";
import { publicUrl } from "../publicUrl";

export default function MemberCard({ name, position, image }) {
    return (
        <div className="member-card">
            <img src={image || publicUrl("/bop_logo.avif")} alt={name} className="member-image" />
            <h2 className="member-name font-bold font-avenir">{name}</h2>
            <p className="member-position font-bold">{position}</p>
        </div>
    );
}
