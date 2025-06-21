import "./AlumniRow.css";

export default function AlumniRow({ name, position, term, index, selectedIndex, setSelectedIndex }) {
    const isSelected = selectedIndex === index;

    const handleClick = () => {
        setSelectedIndex(isSelected ? null : index);
    };

    return (
        <div
            className={`alumni-row ${isSelected ? "highlighted" : index % 2 === 0 ? "light-blue" : "light-gray"}`}
            onClick={handleClick}
        >
            <span className="alumni-name">{name}</span>
            <span className="alumni-position">{position}</span>
            <span className="alumni-term">{term}</span>
        </div>
    );
}

