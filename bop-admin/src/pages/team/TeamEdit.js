import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Form,
    Button,
    Container,
    Modal,
    Image
} from "react-bootstrap";
import { cosmic } from "../../cosmic";
import { useSearchSaveNavigate } from "../../searchSaveNavigate";
import LoadingButton from "../../components/LoadingButton";

export default function TeamEdit() {
    const navigate = useSearchSaveNavigate();
    const { id } = useParams();

    const [currentId, setCurrentId] = useState(null);
    const [form, setForm] = useState({
        name: "",
        clubTitle: "",
        section: "",
        imageUrl: "",
        modifiedAt: ""
    });
    const [imageFile, setImageFile] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        (async () => {
            setCurrentId(id);
            if (id === "new") return;

            const raw = (await cosmic.objects.findOne({ type: "team-members", id })).object;
            setForm({
                name: raw.metadata.name,
                clubTitle: raw.metadata.club_title,
                section: raw.metadata.section,
                imageUrl: raw.metadata.photo?.url,
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

    const getLastListId = async () => {
        const members = (await cosmic.objects.find({ type: "team-members" })).objects;
        const getMemberBelow = id => members.find(member => member.metadata.id_above === id);

        let lastId = "0", nextMember;
        while ((nextMember = getMemberBelow(id))) {
            lastId = nextMember.id;
        }
        return lastId;
    };

    const makeSlug = str => {
        return str
            .split(" (")[0]
            .toLowerCase()
            .split(" ")
            .join("-");
    };

    const handleSubmit = async () => {
        if (currentId !== "new") {
            const latestModified = (await cosmic.objects.findOne({ type: "team-members", id: currentId })).object.modified_at;
            // eslint-disable-next-line no-restricted-globals
            if (form.modifiedAt !== latestModified && !confirm("modified times vary")) {
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
        }

        try {
            const payload = {
                title: makeSlug(form.name),
                metadata: {
                    name: form.name,
                    club_title: form.clubTitle,
                    section: form.section
                }
            };
            if (uploadMedia) {
                payload.metadata.photo = uploadMedia.name;
            }

            if (currentId === "new") {
                payload.type = "team-members";
                payload.metadata.id_above = await getLastListId();

                const insertRes = (await cosmic.objects.insertOne(payload)).object;
                setForm({
                    ...form,
                    imageUrl: uploadMedia?.url,
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
            alert("Member update failed");
        }
    };

    return (
        <Container className="mt-4">
            <h3>Edit Member</h3>

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formClubTitle">
                    <Form.Label>Club Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="clubTitle"
                        value={form.clubTitle}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formSection">
                    <Form.Label className="mb-0">Section</Form.Label>
                    <Form.Select
                        name="section"
                        value={form.section}
                        onChange={handleChange}
                    >
                        <option value="executive">Executive</option>
                        <option value="staff">Staff</option>
                    </Form.Select>
                </Form.Group>

                <ImageUpload form={form} handleImageFileChange={handleImageFileChange} />
                <br />

                <LoadingButton variant="primary" text="Save member" onClick={handleSubmit} />
            </Form>

            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Member Saved</Modal.Title>
                </Modal.Header>
                <Modal.Body>Your edits have been saved.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSuccessModal(false)}>
                        Continue editing
                    </Button>
                    <Button variant="success" onClick={() => navigate("/team")}>
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