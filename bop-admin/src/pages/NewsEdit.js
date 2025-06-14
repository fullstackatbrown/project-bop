import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Form,
    Button,
    Container,
    Modal,
    Image
} from "react-bootstrap";
import { cosmic } from "../cosmic";
import { useSearchSaveNavigate } from "../searchSaveNavigate";
import LoadingButton from "../components/LoadingButton";

export default function NewsEdit() {
    const navigate = useSearchSaveNavigate();
    const { id } = useParams();

    const [currentId, setCurrentId] = useState(null);
    const [form, setForm] = useState({
        title: "",
        author: "",
        imageUrl: "",
        image_caption: "",
        content: "",
        modifiedAt: ""
    });
    const [imageFile, setImageFile] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        (async () => {
            setCurrentId(id);
            if (id == "new") return;

            const raw = (await cosmic.objects.findOne({ type: "news-posts", id })).object;
            setForm({
                title: raw.title,
                author: raw.metadata.author,
                imageUrl: raw.metadata.image?.url,
                image_caption: raw.metadata.image_caption,
                content: raw.metadata.content,
                modifiedAt: raw.modified_at
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

    const handleSubmit = async () => {
        if (currentId != "new") {
            const latestModified = (await cosmic.objects.findOne({ type: "news-posts", id })).object.modified_at;
            // eslint-disable-next-line no-restricted-globals
            if (form.modifiedAt != latestModified && !confirm("modified times vary")) {
                return;
            }
        }

        let uploadMedia;
        if (imageFile) {
            try {
                uploadMedia = (await cosmic.media.insertOne({ media: imageFile })).media;
            } catch (err) {
                console.error("Image upload failed:", err);
                alert("Image upload failed");
                return;
            }
        } else if (!form.imageUrl) {
            alert("Please upload an image.");
            return;
        }

        try {
            const payload = {
                title: form.title,
                metadata: {
                    author: form.author,
                    image_caption: form.image_caption,
                    content: form.content
                },
            };
            if (uploadMedia) {
                payload.metadata.image = uploadMedia.name;
            }

            if (currentId == "new") {
                payload.type = "news-posts";
                payload.metadata.date_published = new Date().toISOString().split("T")[0];

                const insertRes = await cosmic.objects.insertOne(payload);
                setForm({
                    ...form,
                    imageUrl: uploadMedia.url,
                    modifiedAt: insertRes.modified_at
                });
                setCurrentId(insertRes.id);
            } else {
                await cosmic.objects.updateOne(currentId, payload);
                if (uploadMedia) {
                    setForm({ ...form, imageUrl: uploadMedia.url });
                }
            }

            setImageFile(null);
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

                <Form.Group className="mb-3" controlId="formAuthor">
                    <Form.Label>Author</Form.Label>
                    <Form.Control
                        type="text"
                        name="author"
                        value={form.author}
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
                        required
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

                <LoadingButton variant="primary" text="Save article" onClick={handleSubmit} />
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