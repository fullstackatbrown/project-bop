import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NewGroupView from "../../components/poll/NewGroupView";
import ExistingGroupView from "../../components/poll/ExistingGroupView";

export default function PollEdit() {
    const { id } = useParams();

    const [currentId, setCurrentId] = useState(null);

    useEffect(() => {
        setCurrentId(id);
    }, [id]);

    return (
        <>
            {currentId === "new" && <NewGroupView setId={setCurrentId} />}
            {currentId && currentId !== "new" && <ExistingGroupView id={currentId} />}
        </>
    );
}