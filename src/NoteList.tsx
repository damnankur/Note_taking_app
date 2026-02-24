import { useMemo, useState } from "react";
import {
  Button,
  Col,
  Row,
  Stack,
  Form,
  Card,
  Badge,
  Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Note, Tag } from "./App";
import styles from "./NoteList.module.css";

type SimplifiedNote = {
  tags: Tag[];
  title: string;
  id: string;
};
type NoteListProps = {
  availableTags: Tag[];
  notes: Note[];
  onDeleteTag: (id: string) => void;
  onUpdateTag: (id: string, label: string) => void;
  onTogglePin: (id: string) => void;
  onToggleArchive: (id: string) => void;
};

type EditTagsModalProps = {
  show: boolean;
  availableTags: Tag[];
  handleClose: () => void;
  onDeleteTag: (id: string) => void;
  onUpdateTag: (id: string, label: string) => void;
};

export function NoteList({
  availableTags,
  notes,
  onUpdateTag,
  onDeleteTag,
  onTogglePin,
  onToggleArchive,
}: NoteListProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [sortBy, setSortBy] = useState("updated");
  const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false);

  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        return (
          note.archived === showArchived &&
          (title === "" ||
            note.title.toLowerCase().includes(title.toLowerCase())) &&
          (selectedTags.length === 0 ||
            selectedTags.every((tag) =>
              note.tags.some((noteTag) => noteTag.id === tag.id)
            ))
        );
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "created") return b.createdAt - a.createdAt;
        return b.updatedAt - a.updatedAt;
      });
  }, [title, selectedTags, notes, showArchived, sortBy]);

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>{showArchived ? "Archived Notes" : "Notes"}</h1>
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to="/new">
              <Button variant="primary">Create Note</Button>
            </Link>
            <Button
              onClick={() => setEditTagsModalIsOpen(true)}
              variant="outline-secondary"
            >
              Edit Tags
            </Button>
          </Stack>
        </Col>
      </Row>
      <Form>
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="sortBy">
              <Form.Label>Sort By</Form.Label>
              <Form.Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="updated">Last Updated</option>
                <option value="created">Created Date</option>
                <option value="title">Title</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Col>
          <Form.Group controlId="tags">
            <Form.Label>Tags</Form.Label>
            <ReactSelect
              value={selectedTags.map((tag) => {
                return { label: tag.label, value: tag.id };
              })}
              options={availableTags.map((tag) => {
                return { label: tag.label, value: tag.id };
              })}
              onChange={(tags) => {
                setSelectedTags(
                  tags.map((tag) => {
                    return { label: tag.label, id: tag.value };
                  })
                );
              }}
              isMulti
            />
          </Form.Group>
        </Col>
      </Form>
      <Stack direction="horizontal" gap={2} className="mb-3">
        <Button
          variant={showArchived ? "outline-secondary" : "secondary"}
          onClick={() => setShowArchived(false)}
        >
          Active
        </Button>
        <Button
          variant={showArchived ? "secondary" : "outline-secondary"}
          onClick={() => setShowArchived(true)}
        >
          Archived
        </Button>
      </Stack>
      <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
        {filteredNotes.map((note) => (
          <Col key={note.id}>
            <NoteCard
              id={note.id}
              title={note.title}
              tags={note.tags}
              pinned={note.pinned}
              archived={note.archived}
              updatedAt={note.updatedAt}
              onTogglePin={onTogglePin}
              onToggleArchive={onToggleArchive}
            />
          </Col>
        ))}
      </Row>
      {filteredNotes.length === 0 && (
        <p className="text-muted mt-4 mb-0">No notes found.</p>
      )}
      <EditTagsModal
        onUpdateTag={onUpdateTag}
        onDeleteTag={onDeleteTag}
        show={editTagsModalIsOpen}
        handleClose={() => setEditTagsModalIsOpen(false)}
        availableTags={availableTags}
      />
    </>
  );
}

function NoteCard({
  id,
  title,
  tags,
  pinned,
  archived,
  updatedAt,
  onTogglePin,
  onToggleArchive,
}: SimplifiedNote & {
  pinned: boolean;
  archived: boolean;
  updatedAt: number;
  onTogglePin: (id: string) => void;
  onToggleArchive: (id: string) => void;
}) {
  return (
    <Card className={`h-100 ${styles.card}`}>
      <Card.Body>
        <Stack
          gap={2}
          className="align-items-center
        justify-content-center h-100"
        >
          <span className="fs-5 text-center">{title}</span>
          <small className="text-muted">
            {new Date(updatedAt).toLocaleString()}
          </small>
          {tags.length > 0 && (
            <Stack
              gap={1}
              direction="horizontal"
              className="justify-content-center flex-wrap"
            >
              {tags.map((tag) => (
                <Badge className="text-truncate" key={tag.id}>
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
          {pinned && <Badge bg="warning">Pinned</Badge>}
        </Stack>
      </Card.Body>
      <Card.Footer className="bg-white border-0 pt-0">
        <Stack direction="horizontal" gap={2}>
          <Button
            as={Link}
            to={`/${id}`}
            variant="outline-primary"
            size="sm"
            className="w-100"
          >
            Open
          </Button>
          <Button
            variant={pinned ? "warning" : "outline-warning"}
            size="sm"
            onClick={() => onTogglePin(id)}
          >
            ★
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => onToggleArchive(id)}
          >
            {archived ? "Restore" : "Archive"}
          </Button>
        </Stack>
      </Card.Footer>
    </Card>
  );
}

function EditTagsModal({
  availableTags,
  handleClose,
  show,
  onUpdateTag,
  onDeleteTag,
}: EditTagsModalProps) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Tags</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack gap={2}>
            {availableTags.map((tag) => (
              <Row key={tag.id}>
                <Col>
                  <Form.Control
                    type="text"
                    value={tag.label}
                    onChange={(e) => onUpdateTag(tag.id, e.target.value)}
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    onClick={() => onDeleteTag(tag.id)}
                    variant="outline-danger"
                  >
                    &times;
                  </Button>
                </Col>
              </Row>
            ))}
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
