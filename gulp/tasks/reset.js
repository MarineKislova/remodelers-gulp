// чтобы плагин работал, его надо установить в терминале командой:
// npm i -D del
import { deleteAsync } from "del";

// Clean the build directory before building
export const reset = () => {
  return deleteAsync(app.path.clean);
};
