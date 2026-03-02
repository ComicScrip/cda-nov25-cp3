import Layout from "@/components/Layout";
import RecentArticles from "@/components/RecentArticles";

export default function Home() {
  return (
    <Layout pageTitle="Home">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-8">Latest Posts</h1>
        <RecentArticles />
      </div>
    </Layout>
  );
}
