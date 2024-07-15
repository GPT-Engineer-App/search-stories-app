import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const fetchTopStories = async () => {
  const response = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  );
  const storyIds = await response.json();
  const top100Ids = storyIds.slice(0, 100);

  const storyPromises = top100Ids.map((id) =>
    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((res) =>
      res.json()
    )
  );

  return Promise.all(storyPromises);
};

const StoryItem = ({ story }) => (
  <div className="border p-4 mb-4 rounded-md">
    <h2 className="text-xl font-semibold mb-2">{story.title}</h2>
    <p className="text-sm text-gray-500 mb-2">Upvotes: {story.score}</p>
    <a
      href={story.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 hover:underline"
    >
      Read more
    </a>
  </div>
);

const SkeletonStory = () => (
  <div className="border p-4 mb-4 rounded-md">
    <Skeleton className="h-6 w-3/4 mb-2" />
    <Skeleton className="h-4 w-1/4 mb-2" />
    <Skeleton className="h-4 w-1/6" />
  </div>
);

const HackerNewsTopStories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: stories, isLoading, error } = useQuery({
    queryKey: ["topStories"],
    queryFn: fetchTopStories,
  });

  const filteredStories = stories?.filter((story) =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return <div>Error fetching stories: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Hacker News Top Stories</h1>
      <Input
        type="text"
        placeholder="Search stories..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-6"
      />
      {isLoading ? (
        Array(10)
          .fill()
          .map((_, index) => <SkeletonStory key={index} />)
      ) : (
        filteredStories?.map((story) => (
          <StoryItem key={story.id} story={story} />
        ))
      )}
    </div>
  );
};

export default HackerNewsTopStories;