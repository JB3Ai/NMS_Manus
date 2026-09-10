import { mkdtemp, readFile, rm, stat } from "fs/promises";
import os from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  listFileDecisions,
  listFileReviews,
  recordFileReview,
  saveFileDecision,
} from "./fileStore";

let directory = "";
const previousDataFile = process.env.NMS_DATA_FILE;

beforeEach(async () => {
  directory = await mkdtemp(path.join(os.tmpdir(), "nms-file-store-"));
  process.env.NMS_DATA_FILE = path.join(directory, "portal-data.json");
});

afterEach(async () => {
  if (previousDataFile === undefined) delete process.env.NMS_DATA_FILE;
  else process.env.NMS_DATA_FILE = previousDataFile;
  await rm(directory, { recursive: true, force: true });
});

describe("isolated cPanel file store", () => {
  it("persists and updates executive decisions", async () => {
    await saveFileDecision({ userId: 1, area: "brand", selection: "Modern Botanical", status: "draft" });
    await saveFileDecision({ userId: 1, area: "brand", selection: "Modern Botanical", note: "Approve after legal review", status: "approved" });

    const decisions = await listFileDecisions(1);
    expect(decisions).toHaveLength(1);
    expect(decisions[0]).toMatchObject({
      area: "brand",
      selection: "Modern Botanical",
      note: "Approve after legal review",
      status: "approved",
    });
  });

  it("tracks opened, downloaded and read document states in a private file", async () => {
    const input = { reviewerId: "reviewer-123", reviewerName: "Executive Reviewer", documentId: "strategy" };
    await recordFileReview({ ...input, event: "opened" });
    await recordFileReview({ ...input, event: "downloaded" });
    await recordFileReview({ ...input, event: "read" });

    const reviews = await listFileReviews(input.reviewerId);
    expect(reviews).toHaveLength(1);
    expect(reviews[0]?.openedAt).toBeInstanceOf(Date);
    expect(reviews[0]?.downloadedAt).toBeInstanceOf(Date);
    expect(reviews[0]?.readAt).toBeInstanceOf(Date);

    if (process.platform !== "win32") {
      const mode = (await stat(process.env.NMS_DATA_FILE!)).mode & 0o777;
      expect(mode).toBe(0o600);
    }
    expect(JSON.parse(await readFile(process.env.NMS_DATA_FILE!, "utf8")).reviews).toHaveLength(1);
  });
});
