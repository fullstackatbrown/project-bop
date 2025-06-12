import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";

export default function LoadingButton({ variant, text, onClick }) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        await onClick();
        setLoading(false);
    };

    return (
        <>
            <Button
                variant={variant}
                onClick={handleClick}
                disabled={loading}
            >
                {text}
            </Button>
            {loading &&
                <Spinner
                    animation="border"
                    size="sm"
                    role="status"
                    style={{ margin: "0 5px" }}
                >
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            }
        </>
    );
}