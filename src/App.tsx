import "bootstrap/dist/css/bootstrap.min.css";
import { useMemo } from "react";
import { Container } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import NewNote from "./NewNote";
import { useLocalStorage } from "./useLocalStorage";
import { v4 as uuidV4 } from "uuid";
import { NoteList } from "./NoteList";
import { NoteLayout } from "./NoteLayout";
import { Note } from "./Note";
import { EditNote } from "./EditNote";

export type Note = {
  id: string;
} & NoteData &
  NoteMetaData;

export type RawNote = {
  id: string;
  tagIds: string[];
} & RawNoteData;

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
} & NoteMetaData;

export type NoteMetaData = {
  createdAt: number;
  updatedAt: number;
  pinned: boolean;
  archived: boolean;
};
export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

export type Tag = {
  id: string;
  label: string;
};
function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        id: note.id,
        title: note.title,
        markdown: note.markdown,
        createdAt: note.createdAt ?? Date.now(),
        updatedAt: note.updatedAt ?? note.createdAt ?? Date.now(),
        pinned: note.pinned ?? false,
        archived: note.archived ?? false,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      const now = Date.now();
      return [
        ...prevNotes,
        {
          ...data,
          id: uuidV4(),
          tagIds: tags.map((tag) => tag.id),
          createdAt: now,
          updatedAt: now,
          pinned: false,
          archived: false,
        },
      ];
    });
  }

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id === id) {
          return {
            ...note,
            ...data,
            tagIds: tags.map((tag) => tag.id),
            createdAt: note.createdAt ?? Date.now(),
            updatedAt: Date.now(),
          };
        } else {
          return note;
        }
      });
    });
  }

  function addTag(tag: Tag) {
    setTags((prev) => [...prev, tag]);
  }

  function onDeleteNote(id: string): void {
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id);
    });
  }

  function onUpdateTag(id: string, label: string) {
    setTags((prevTags) => {
      return prevTags.map((tag) => {
        if (tag.id === id) {
          return { ...tag, label };
        } else {
          return tag;
        }
      });
    });
  }

  function onDeleteTag(id: string) {
    setTags((prevTags) => {
      return prevTags.filter((tag) => tag.id !== id);
    });
  }

  function onTogglePin(id: string) {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, pinned: !note.pinned, updatedAt: Date.now() } : note
      )
    );
  }

  function onToggleArchive(id: string) {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, archived: !note.archived, updatedAt: Date.now() } : note
      )
    );
  }

  function onDuplicateNote(id: string) {
    setNotes((prevNotes) => {
      const noteToCopy = prevNotes.find((note) => note.id === id);
      if (noteToCopy == null) return prevNotes;
      const now = Date.now();
      return [
        ...prevNotes,
        {
          ...noteToCopy,
          id: uuidV4(),
          title: `${noteToCopy.title} (Copy)`,
          createdAt: now,
          updatedAt: now,
          pinned: false,
          archived: false,
        },
      ];
    });
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={
            <NoteList
              notes={notesWithTags}
              availableTags={tags}
              onUpdateTag={onUpdateTag}
              onDeleteTag={onDeleteTag}
              onTogglePin={onTogglePin}
              onToggleArchive={onToggleArchive}
            />
          }
        />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route
            index
            element={
              <Note
                onDelete={onDeleteNote}
                onTogglePin={onTogglePin}
                onToggleArchive={onToggleArchive}
                onDuplicate={onDuplicateNote}
              />
            }
          />
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;
