import { Link, useNavigate } from "react-router-dom";
import { useNote } from "./NoteLayout.tsx";
import { Row, Col, Stack, Badge, Button } from "react-bootstrap";
import ReactMarkdown from "react-markdown";

type NoteProps = {
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onDuplicate: (id: string) => void;
};
export function Note({
  onDelete,
  onTogglePin,
  onToggleArchive,
  onDuplicate,
}: NoteProps) {
  const note = useNote();
  const navigate = useNavigate();

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>{note.title} </h1>
          <small className="text-muted d-block mb-2">
            Updated: {new Date(note.updatedAt).toLocaleString()}
          </small>
          {note.tags.length > 0 && (
            <Stack gap={1} direction="horizontal" className="flex-wrap">
              {note.tags.map((tag) => (
                <Badge className="text-truncate" key={tag.id}>
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to={`/${note.id}/edit`}>
              <Button variant="primary">Edit</Button>
            </Link>
            <Button
              onClick={() => onTogglePin(note.id)}
              variant={note.pinned ? "warning" : "outline-warning"}
            >
              {note.pinned ? "Unpin" : "Pin"}
            </Button>
            <Button
              onClick={() => onToggleArchive(note.id)}
              variant="outline-secondary"
            >
              {note.archived ? "Restore" : "Archive"}
            </Button>
            <Button
              onClick={() => onDuplicate(note.id)}
              variant="outline-primary"
            >
              Duplicate
            </Button>
            <Button
              onClick={() => {
                onDelete(note.id);
                navigate("/");
              }}
              variant="outline-danger"
            >
              Delete
            </Button>
            <Link to="/">
              <Button variant="outline-secondary">Back</Button>
            </Link>
          </Stack>
        </Col>
      </Row>
      <ReactMarkdown>{note.markdown}</ReactMarkdown>
    </>
  );
}
