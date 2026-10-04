import { describe, expect, it } from "vitest";
import { blogPosts } from "@/data/home";
import { doctors } from "@/data/doctors";
import { specialties } from "@/data/specialties";
import { treatments } from "@/data/treatments";
import { blogArticles, getBlogArticle } from "@/data/blog-articles";
import { getSpecialtyDetail, specialtyDetails } from "@/data/specialty-details";
import { allFaqGroups } from "@/data/faq-page";

describe("specialty details", () => {
  it("exist for every specialty", () => {
    expect(Object.keys(specialtyDetails).sort()).toEqual(specialties.map((s) => s.slug).sort());
  });

  it("explain who is affected, how it is diagnosed and answer at least two questions", () => {
    for (const specialty of specialties) {
      const detail = getSpecialtyDetail(specialty.slug);
      expect(detail.whoIsAffected.length).toBeGreaterThan(20);
      expect(detail.diagnosis.length).toBeGreaterThanOrEqual(3);
      expect(detail.faq.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("only link to treatments that exist", () => {
    const slugs = new Set(treatments.map((t) => t.slug));
    for (const detail of Object.values(specialtyDetails)) {
      for (const slug of detail.treatments) expect(slugs.has(slug)).toBe(true);
    }
  });
});

describe("blog articles", () => {
  it("exist for every published post", () => {
    expect(Object.keys(blogArticles).sort()).toEqual(blogPosts.map((post) => post.slug).sort());
  });

  it("have an intro, at least three sections and a takeaway", () => {
    for (const post of blogPosts) {
      const article = getBlogArticle(post.slug);
      expect(article.intro.length).toBeGreaterThan(40);
      expect(article.sections.length).toBeGreaterThanOrEqual(3);
      expect(article.takeaway.length).toBeGreaterThan(20);
    }
  });

  it("are written by a doctor of the staff", () => {
    const staff = new Set(doctors.map((d) => d.slug));
    for (const post of blogPosts) expect(staff.has(post.authorSlug)).toBe(true);
  });
});

describe("FAQ page", () => {
  it("never repeats a question id", () => {
    const ids = allFaqGroups.flatMap((group) => group.items.map((item) => item.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});
