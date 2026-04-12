export type BlogStatus = "draft" | "review" | "published";

export function normaliseBlogStatus(status: unknown): BlogStatus {
  if (status === "draft" || status === "review" || status === "published") {
    return status;
  }
  return "published";
}

export function isPublishedStatus(status: unknown): boolean {
  return normaliseBlogStatus(status) === "published";
}
