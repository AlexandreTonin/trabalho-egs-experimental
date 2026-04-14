export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium"
  }).format(new Date(date));
}
