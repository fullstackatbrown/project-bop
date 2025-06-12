import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Form,
    Button,
    Container,
    Modal,
    Image
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
    const [imageFile, setImageFile] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        (async () => {
            const raw = (await cosmic.objects.findOne({ type: "news-posts", id })).object;
            setForm({
                title: raw.title,
                author: raw.metadata.author,
                imageUrl: raw.metadata.image?.url || "",
                image_caption: raw.metadata.image_caption,
                content: raw.metadata.content
            });
        })();
    }, [id]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleImageFileChange = e => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setForm(prev => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();

        let uploadMedia;
        if (imageFile) {
            try {
                uploadMedia = (await cosmic.media.insertOne({ media: imageFile })).media;
            } catch (err) {
                console.error("Image upload failed:", err);
                alert("Image upload failed");
                return;
            }
        }

        try {
            await cosmic.objects.updateOne(id, {
                title: form.title,
                metadata: {
                    author: form.author,
                    image: uploadMedia?.name,
                    image_caption: form.image_caption,
                    content: form.content
                },
            });
            setForm(prev => ({ ...prev, imageUrl: uploadMedia.url }));
            setShowSuccessModal(true);
        } catch (err) {
            console.error("Update failed:", err);
            alert("Article update failed");
        }
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

                <ImageUpload form={form} handleImageFileChange={handleImageFileChange} />
                <br />

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
                    <Form.Label>Article Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={12}
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
                <Modal.Body>Your edits have been saved.</Modal.Body>
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

function ImageUpload({ form, handleImageFileChange }) {
    const fileInputRef = useRef(null);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <Form.Label>Image</Form.Label>
            <div
                onClick={handleImageClick}
                style={{
                    cursor: "pointer",
                    width: "100%",
                    maxWidth: "400px",
                    aspectRatio: "16/9",
                    backgroundColor: form.imageUrl ? "transparent" : "#ccc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    overflow: "hidden"
                }}
            >
                {form.imageUrl ? (
                    <Image src={form.imageUrl} fluid />
                ) : (
                    <span style={{ color: "#666" }}>Click to upload image</span>
                )}
            </div>

            <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                ref={fileInputRef}
                style={{ display: "none" }}
            />
        </>
    );
}