import {createContext} from "react";

interface NotesContextType {
  notesActive: boolean,
  setNotesActive: (c: boolean) => void
}
export const NotesContext = createContext<NotesContextType>({
  notesActive: false,
  setNotesActive: () => {}
});