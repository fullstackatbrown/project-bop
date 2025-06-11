import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Form,
    Button,
    Container,
    Modal,
} from "react-bootstrap";
import { cosmic } from "../cosmic";

export default function NewsEdit() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [form, setForm] = useState({
        title: "",
        author: "",
        image: "",
        image_caption: "",
        content: "",
    });
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        (async () => {
            const raw = (await cosmic.objects.findOne({ type: "news-posts", id })).object;
            setForm(
                {
                    title: raw.title,
                    author: raw.metadata.author,
                    image: raw.metadata.image.url,
                    image_caption: raw.metadata.image_caption,
                    content: raw.metadata.content
                }
            )
        })();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Updated Article:", form);
        cosmic.objects.updateOne(
            id,
            {
                title: form.title,
                metadata: {
                    author: form.author,
                    image_caption: form.image_caption,
                    content: form.content
                }
            }
        );
        setShowSuccessModal(true);
    };

    return (
        <Container className="mt-4">
            <h3>Edit Article</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAuthor">
                    <Form.Label>Author</Form.Label>
                    <Form.Control
                        type="text"
                        name="author"
                        value={form.author}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formImage">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control
                        type="text"
                        name="image"
                        value={form.image}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formImageCaption">
                    <Form.Label>Image Caption</Form.Label>
                    <Form.Control
                        type="text"
                        name="image_caption"
                        value={form.image_caption}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formContent">
                    <Form.Label>Article Body</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={6}
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Save Article
                </Button>
            </Form>

            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Article Saved</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Your edits have been saved.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSuccessModal(false)}>
                        Continue editing
                    </Button>
                    <Button variant="success" onClick={() => navigate("/news")}>
                        Return to menu
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
