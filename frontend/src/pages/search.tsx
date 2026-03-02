import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { useGetArticlesQuery } from "@/graphql/generated/schema";

export default function SearchResults() {
  const router = useRouter();
  const { q } = router.query;
  const searchQuery = typeof q === "string" ? q : "";

  const { data, loading, error } = useGetArticlesQuery({
    variables: searchQuery ? { title: searchQuery } : undefined,
    skip: !searchQuery,
  });

  if (!searchQuery) {
    return (
      <Layout pageTitle="Search">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4 text-gray-100">Search Articles</h1>
          <p className="text-gray-400">Enter a search term to find articles.</p>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout pageTitle="Search Results">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4 text-gray-100">Search Results</h1>
          <div className="flex justify-center items-center min-h-[200px]">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout pageTitle="Search Results">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4 text-gray-100">Search Results</h1>
          <div className="alert alert-error">
            <span>Error loading search results: {error.message}</span>
          </div>
        </div>
      </Layout>
    );
  }

  const articles = data?.articles || [];

  return (
    <Layout pageTitle="Search Results">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4 text-gray-100">
          Search Results for &quot;{searchQuery}&quot;
        </h1>
        <p className="text-gray-400 mb-6">
          {articles.length} article{articles.length !== 1 ? "s" : ""} found
        </p>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No articles found matching your search.</p>
            <Link href="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="card bg-gray-800 shadow-lg hover:shadow-xl transition-shadow border border-gray-700 cursor-pointer"
              >
                {article.mainPictureUrl && (
                  <figure>
                    <img
                      src={article.mainPictureUrl}
                      alt=""
                      className="w-full h-32 object-cover"
                    />
                  </figure>
                )}
                <div className="card-body p-4">
                  <h2 className="card-title text-base text-gray-100">{article.title}</h2>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
