import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "@/components/Layout";
import {
  GetArticlesDocument,
  useDeleteArticleMutation,
  useGetArticleQuery,
} from "@/graphql/generated/schema";

export default function ArticleDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data, loading, error } = useGetArticleQuery({
    variables: { id: Number(id) },
    skip: !id,
  });

  const [deleteArticle, { loading: deleting }] = useDeleteArticleMutation({
    refetchQueries: [{ query: GetArticlesDocument, variables: { limit: 5 } }],
    awaitRefetchQueries: true,
  });

  const handleDelete = async () => {
    try {
      const result = await deleteArticle({
        variables: { id: Number(id) },
      });
      if (result.data?.deleteArticle) {
        router.push("/");
      } else {
        setShowDeleteModal(false);
      }
    } catch (err) {
      console.error("Failed to delete article:", err);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <Layout pageTitle="Loading...">
        <div className="flex justify-center items-center min-h-[400px]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout pageTitle="Error">
        <div className="alert alert-error max-w-2xl mx-auto mt-8">
          <span>Error loading article: {error.message}</span>
        </div>
      </Layout>
    );
  }

  if (!data?.article) {
    return (
      <Layout pageTitle="Not Found">
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">Article Not Found</h1>
          <p className="text-gray-400 mb-8">The article you are looking for does not exist.</p>
          <Link href="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </Layout>
    );
  }

  const article = data.article;

  return (
    <Layout pageTitle={article.title}>
      <article className="max-w-4xl mx-auto py-8 px-4">
        {article.category && (
          <div className="mb-4">
            <span className="badge badge-primary badge-lg">{article.category.name}</span>
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-100">{article.title}</h1>

        <div className="flex items-center gap-4 text-gray-400 mb-8">
          <span>Published on {new Date(article.createdAt).toLocaleDateString()}</span>
          {article.createdAt !== article.updatedAt && (
            <span>• Updated on {new Date(article.updatedAt).toLocaleDateString()}</span>
          )}
        </div>

        {article.mainPictureUrl && (
          <figure className="mb-8">
            {/** biome-ignore lint/performance/noImgElement: images may come from unknown domains */}
            <img
              src={article.mainPictureUrl}
              alt=""
              className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-2xl"
            />
          </figure>
        )}

        <div className="prose prose-lg max-w-none prose-invert">
          <p className="text-lg leading-relaxed whitespace-pre-wrap text-gray-300">
            {article.body}
          </p>
        </div>

        <div className="flex justify-end mt-12">
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="btn btn-error btn-sm"
            disabled={deleting}
          >
            {deleting ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Deleting...
              </>
            ) : (
              "Delete Article"
            )}
          </button>
        </div>
      </article>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-100">Delete Article</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete &quot;{article.title}&quot;? This action cannot be
              undone.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-ghost"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="btn btn-error"
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
