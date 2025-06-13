import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Main() {
    const navigate = useNavigate();

    return (
        <Container>
            <h3>BOP Admin Page</h3>
            <Button variant="secondary" onClick={() => navigate("/news")}>Edit news articles</Button>
            <Button variant="secondary" onClick={() => navigate("/poll")}>Edit poll groups</Button>
        </Container>
    );
}