import Link from "next/link";
import { useGetArticlesQuery } from "@/graphql/generated/schema";

export default function RecentArticles() {
  const { data, loading, error } = useGetArticlesQuery({
    variables: { limit: 5 },
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Error loading articles: {error.message}</span>
      </div>
    );
  }

  const articles = data?.articles || [];

  return (
    <section>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        data-testid="article-list"
      >
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.id}`}
            className="card bg-gray-800 shadow-lg hover:shadow-xl transition-shadow border border-gray-700 cursor-pointer"
          >
            {article.mainPictureUrl && (
              <figure>
                {/** biome-ignore lint/performance/noImgElement: images may come from unknown domains */}
                <img src={article.mainPictureUrl} alt="" className="w-full h-32 object-cover" />
              </figure>
            )}
            <div className="card-body p-4">
              <h2 className="card-title text-base text-gray-100">{article.title}</h2>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <Link
          href="/articles/create"
          className="btn btn-primary btn-lg px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          Write a new article
        </Link>
      </div>
    </section>
  );
}
