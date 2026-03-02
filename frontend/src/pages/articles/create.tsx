import { useRouter } from "next/router";
import { type FormEvent, useState } from "react";
import Layout from "@/components/Layout";
import { useCreateArticleMutation, useGetCategoriesQuery } from "@/graphql/generated/schema";

export default function CreateArticle() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mainPictureUrl, setMainPictureUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [formError, setFormError] = useState("");

  const { data: categoriesData, loading: categoriesLoading } = useGetCategoriesQuery();
  const [createArticle, { loading: creating }] = useCreateArticleMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!title.trim() || !body.trim()) {
      setFormError("Title and body are required");
      return;
    }

    if (!categoryId) {
      setFormError("Please select a category");
      return;
    }

    if (!mainPictureUrl.trim()) {
      setFormError("Main picture URL is required");
      return;
    }

    try {
      const result = await createArticle({
        variables: {
          data: {
            title: title.trim(),
            body: body.trim(),
            mainPictureUrl: mainPictureUrl.trim(),
            category: { id: Number(categoryId) },
          },
        },
      });

      if (result.data?.createArticle) {
        router.push(`/articles/${result.data.createArticle.id}`);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create article");
    }
  };

  return (
    <Layout pageTitle="Create Article">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-100">Create New Article</h1>

        {formError && (
          <div className="alert alert-error mb-6">
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label" htmlFor="title">
              <span className="label-text font-semibold text-gray-200">Title *</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter article title"
              className="input input-bordered w-full bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-500"
              required
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="category">
              <span className="label-text font-semibold text-gray-200">Category *</span>
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="select select-bordered w-full bg-gray-800 border-gray-600 text-gray-100"
              required
              disabled={categoriesLoading}
            >
              <option value="">Select a category</option>
              {categoriesData?.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label" htmlFor="mainPictureUrl">
              <span className="label-text font-semibold text-gray-200">Main Picture URL *</span>
            </label>
            <input
              id="mainPictureUrl"
              type="url"
              value={mainPictureUrl}
              onChange={(e) => setMainPictureUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="input input-bordered w-full bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-500"
              required
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="body">
              <span className="label-text font-semibold text-gray-200">Body *</span>
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your article content here..."
              className="textarea textarea-bordered w-full min-h-[300px] bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-500"
              required
            />
          </div>

          <div className="pt-4">
            <button type="submit" className="btn btn-primary w-full btn-lg" disabled={creating}>
              {creating ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Creating...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
