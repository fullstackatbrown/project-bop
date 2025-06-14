import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Main() {
    const navigate = useNavigate();

    return (
        <Container className="d-flex flex-column align-items-center text-center mt-5">
            <h3>BOP Admin Page</h3>
            <div className="d-flex gap-2 mt-3">
                <Button variant="secondary" onClick={() => navigate("/news")}>
                    Edit news articles
                </Button>
                <Button variant="secondary" onClick={() => navigate("/poll")}>
                    Edit poll groups
                </Button>
            </div>
        </Container>
    );
}