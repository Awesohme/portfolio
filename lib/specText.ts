/**
 * /v2 (Spec) drops em/en dashes from the shared project copy in lib/projects.ts
 * WITHOUT mutating that file (the galaxy site still reads it as-is).
 * Date ranges ("2022 – Present") become "to"; prose dashes become a comma.
 */
export const cleanDashes = (s: string): string =>
  s
    .replace(/\s*[—–]\s*(Present|present|\d)/g, " to $1")
    .replace(/\s*[—–]\s*/g, ", ")
    .replace(/[—–]/g, ", ");
