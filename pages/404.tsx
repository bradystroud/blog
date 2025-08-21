import { Hero } from "../components/blocks/hero";
import { Layout } from "../components/layout";
import AIBlog from "../components/ai-blog";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function FourOhFour() {
  const router = useRouter();
  const [isBlogPath, setIsBlogPath] = useState<boolean>(false);
  const [blogTitle, setBlogTitle] = useState<string>("");

  useEffect(() => {
    // Check if the current path looks like a blog post
    const path = router.asPath;
    const blogMatch = path.match(/^\/blogs\/(.+)$/);

    if (blogMatch) {
      setIsBlogPath(true);
      setBlogTitle(blogMatch[1]);
    }
  }, [router.asPath]);

  // If this is a blog path that doesn't exist, render AI blog instead of 404
  if (isBlogPath && blogTitle) {
    return <AIBlog title={blogTitle} globalData={null} />;
  }

  // Regular 404 page for non-blog paths
  return (
    <Layout>
      <Hero
        data={{
          color: "default",
          headline: "404 – Page Not Found",
          text: "Oops! It seems there's nothing here, how embarrassing.",
          actions: [
            {
              label: "Return Home",
              type: "button",
              icon: true,
              link: "/",
            },
          ],
        }}
        parentField=""
      />
    </Layout>
  );
}
