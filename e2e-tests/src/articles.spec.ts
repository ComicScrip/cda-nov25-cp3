import { test, expect } from "@playwright/test";
import { clearDB } from "../../backend/src/db";
import { Category } from "../../backend/src/entities/Category";
import { Article } from "../../backend/src/entities/Article";
import { connectDB, disconnectDB } from "./dbHelpers";

test.beforeAll(connectDB);
test.beforeEach(clearDB);
test.afterAll(disconnectDB);

const PICTURE_URL =
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop";

// ---------------------------------------------------------------------------
// Homepage – 5 derniers articles
// ---------------------------------------------------------------------------
test.describe("Homepage", () => {
    test("affiche au plus 5 articles avec titre et image", async ({ page }) => {
        const cat = await Category.create({ name: "Tech" }).save();

        for (let i = 1; i <= 6; i++) {
            await Article.create({
                title: `Article ${i}`,
                body: `Contenu de l'article ${i}`,
                category: cat,
                mainPictureUrl: PICTURE_URL,
            }).save();
        }

        await page.goto("/");

        const list = page.getByTestId("article-list");
        await expect(list).toBeVisible();

        // Exactly 5 cards must be visible (limit=5 on the homepage query)
        const cards = list.locator(".card");
        await expect(cards).toHaveCount(5);

        // Each card shows a title (h2) and an image
        for (let i = 0; i < 5; i++) {
            await expect(cards.nth(i).locator("h2")).toBeVisible();
            await expect(cards.nth(i).locator("img")).toBeVisible();
        }
    });

    test("affiche le titre de chaque article sur la page d'accueil", async ({ page }) => {
        const cat = await Category.create({ name: "JS" }).save();

        const art1 = await Article.create({
            title: "Premiers pas avec TypeScript",
            body: "Contenu",
            category: cat,
            mainPictureUrl: PICTURE_URL,
        }).save();

        const art2 = await Article.create({
            title: "Maîtriser React Hooks",
            body: "Contenu",
            category: cat,
            mainPictureUrl: PICTURE_URL,
        }).save();

        await page.goto("/");

        const list = page.getByTestId("article-list");
        await expect(list).toContainText(art1.title);
        await expect(list).toContainText(art2.title);
    });
});

// ---------------------------------------------------------------------------
// Page détails d'un article
// ---------------------------------------------------------------------------
test.describe("Page détails d'un article", () => {
    test("affiche toutes les informations de l'article", async ({ page }) => {
        const cat = await Category.create({ name: "GraphQL" }).save();

        const art = await Article.create({
            title: "Introduction à GraphQL",
            body: "GraphQL est un langage de requête pour les APIs.",
            category: cat,
            mainPictureUrl: PICTURE_URL,
        }).save();

        await page.goto(`/articles/${art.id}`);

        // Titre
        await expect(page.getByRole("heading", { name: art.title })).toBeVisible();

        // Catégorie (badge)
        await expect(page.locator(".badge").getByText(cat.name, { exact: true })).toBeVisible();

        // Image principale
        await expect(page.locator("img")).toBeVisible();

        // Corps de l'article
        await expect(page.getByText(art.body)).toBeVisible();

        // Date de création
        const createdDate = new Date(art.createdAt).toLocaleDateString();
        await expect(page.getByText(createdDate, { exact: false })).toBeVisible();
    });
});

// ---------------------------------------------------------------------------
// Création d'un article
// ---------------------------------------------------------------------------
test.describe("Création d'un article", () => {
    test("crée un article et redirige vers sa page détails", async ({ page }) => {
        await Category.create({ name: "DevOps" }).save();

        await page.goto("/articles/create");

        // Remplir le formulaire
        await page.locator("#title").fill("Docker pour les débutants");
        await page.locator("#mainPictureUrl").fill(PICTURE_URL);
        await page.locator("#body").fill("Docker est un outil de conteneurisation.");

        // Attendre que le select ne soit plus disabled, puis sélectionner
        const categorySelect = page.locator("#category");
        await expect(categorySelect).not.toBeDisabled({ timeout: 10000 });
        await categorySelect.selectOption({ label: "DevOps" });
        // Vérifier que la valeur est bien prise en compte par React
        await expect(categorySelect).toHaveValue(/\d+/);

        // Soumettre
        await page.getByRole("button", { name: "Save" }).click();

        // Vérifier la redirection vers la page détails
        await expect(page).toHaveURL(/\/articles\/\d+/, { timeout: 15000 });

        // Vérifier que le titre du nouvel article est affiché
        await expect(page.getByRole("heading", { name: "Docker pour les débutants" })).toBeVisible();
    });
});

// ---------------------------------------------------------------------------
// Suppression d'un article (avec confirmation)
// ---------------------------------------------------------------------------
test.describe("Suppression d'un article", () => {
    test("affiche un modal de confirmation avant de supprimer", async ({ page }) => {
        const cat = await Category.create({ name: "Node" }).save();
        const art = await Article.create({
            title: "Article à supprimer",
            body: "Contenu.",
            category: cat,
            mainPictureUrl: PICTURE_URL,
        }).save();

        await page.goto(`/articles/${art.id}`);

        // Cliquer sur « Delete Article »
        await page.click("button:has-text('Delete Article')");

        // Le modal doit apparaître
        await expect(page.getByRole("heading", { name: "Delete Article" })).toBeVisible();
        await expect(page.getByText(/Are you sure/i)).toBeVisible();
    });

    test("confirmer la suppression redirige vers l'accueil", async ({ page }) => {
        const cat = await Category.create({ name: "Python" }).save();
        const art = await Article.create({
            title: "Article à effacer",
            body: "Contenu.",
            category: cat,
            mainPictureUrl: PICTURE_URL,
        }).save();

        await page.goto(`/articles/${art.id}`);

        // Ouvrir le modal
        await page.click("button:has-text('Delete Article')");
        await expect(page.getByRole("heading", { name: "Delete Article" })).toBeVisible();

        // Confirmer la suppression (bouton « Delete » dans le modal)
        await page.locator(".modal, [class*='fixed']").getByRole("button", { name: "Delete" }).click();

        // Redirection vers l'accueil
        await expect(page).toHaveURL("/");

        // L'article ne doit plus apparaître
        await expect(page.getByTestId("article-list")).not.toContainText(art.title);
    });
});

// ---------------------------------------------------------------------------
// Recherche d'articles par titre
// ---------------------------------------------------------------------------
test.describe("Recherche d'articles", () => {
    test("retourne les articles correspondant à la recherche", async ({ page }) => {
        const cat = await Category.create({ name: "Framework" }).save();

        await Article.create({
            title: "Introduction à Vue.js",
            body: "Vue est progressif.",
            category: cat,
            mainPictureUrl: PICTURE_URL,
        }).save();

        await Article.create({
            title: "Découvrir Angular",
            body: "Angular est complet.",
            category: cat,
            mainPictureUrl: PICTURE_URL,
        }).save();

        // Recherche via la barre de recherche du header
        await page.goto("/");
        await page.fill('input[aria-label="Search articles"]', "Vue");
        await page.press('input[aria-label="Search articles"]', "Enter");

        await expect(page).toHaveURL(/\/search\?q=Vue/i);
        await expect(page.getByText("Introduction à Vue.js")).toBeVisible();
        await expect(page.getByText("Découvrir Angular")).not.toBeVisible();
    });

    test("affiche un message quand aucun article ne correspond", async ({ page }) => {
        const cat = await Category.create({ name: "Misc" }).save();

        await Article.create({
            title: "Un article quelconque",
            body: "Contenu.",
            category: cat,
            mainPictureUrl: PICTURE_URL,
        }).save();

        await page.goto("/search?q=TermeInexistant");

        await expect(page.getByText(/No articles found/i)).toBeVisible();
    });

    test("la recherche est insensible à la casse", async ({ page }) => {
        const cat = await Category.create({ name: "Test" }).save();

        await Article.create({
            title: "Webpack Configuration",
            body: "Contenu.",
            category: cat,
            mainPictureUrl: PICTURE_URL,
        }).save();

        await page.goto("/search?q=webpack");

        await expect(page.getByText("Webpack Configuration")).toBeVisible();
    });
});
