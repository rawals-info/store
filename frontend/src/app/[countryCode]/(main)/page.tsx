import { Metadata } from "next";
import { Suspense } from "react"
import HomepageSkeleton from "@modules/skeletons/templates/homepage-skeleton"
import HomepageDataWrapper from "@modules/home/components/homepage-data-wrapper"

export const metadata: Metadata = {
  title: "Taj Petha | Authentic Agra Sweets",
  description: "Discover the finest authentic Agra pethas crafted with traditional recipes.",
};

interface HomeProps {
  params: {
    countryCode: string;
  };
}

export default async function Home({ params }: HomeProps) {
  const { countryCode } = await params;
  
  return (
    <Suspense fallback={<HomepageSkeleton />}> 
      <HomepageDataWrapper countryCode={countryCode} />
    </Suspense>
  );
} 