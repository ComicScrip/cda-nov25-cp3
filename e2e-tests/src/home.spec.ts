import { test, expect } from "@playwright/test";
import { clearDB } from "../../backend/src/db";
import { Category } from "../../backend/src/entities/Category";
import { connectDB, disconnectDB } from "./dbHelpers";
import { Article } from "../../backend/src/entities/Article";

test.beforeAll(connectDB);
test.beforeEach(clearDB);
test.afterAll(disconnectDB);

test("can view articles in db", async ({ page }) => {
    const react = Category.create({ name: "React" });
    await react.save();

    const art1 = await Article.create({
        title: "art1",
        body: 'art1 desc',
        category: react,
        mainPictureUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop"
    }).save()

    const art2 = await Article.create({
        title: "art2",
        body: 'art2 desc',
        category: react,
        mainPictureUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop"
    }).save()

    await page.goto('/')
    await expect(page.getByTestId("article-list")).toContainText(art1.title)
    await expect(page.getByTestId("article-list")).toContainText(art2.title)
});