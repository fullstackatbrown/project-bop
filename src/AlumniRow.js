import "./AlumniRow.css";

export default function AlumniRow({ name, position, term, index }) {
    return (
        <div className={`alumni-row ${index % 2 === 0 ? "light-blue" : "light-gray"}`}>
            <span className="alumni-name">{name}</span>
            <span className="alumni-position">{position}</span>
            <span className="alumni-term">{term}</span>
        </div>
    );
}
