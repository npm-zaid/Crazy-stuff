import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const tabs = ["All articles", "Culture", "Expertise", "Inspiration", "Our work"];

const blogData = [
{ id: 1, title: "Why your website is your most undervalued brand asset", category: "Expertise", bg: "bg-gradient-to-r from-pink-300 to-purple-300", image: "/placeholder1.png" },
{ id: 2, title: "Branding inspiration: design trends for 2026", category: "Inspiration", bg: "bg-gradient-to-r from-purple-200 to-pink-200", image: "/placeholder2.png" },
{ id: 3, title: "What your 2026 website brief should include", category: "Expertise", bg: "bg-gradient-to-r from-pink-200 to-purple-200", image: "/placeholder3.png" },
{ id: 4, title: "How culture shapes modern digital presence", category: "Culture", bg: "bg-gradient-to-r from-blue-200 to-purple-200", image: "/placeholder4.png" },
{ id: 5, title: "Creative workflow inspiration for 2026 brands", category: "Inspiration", bg: "bg-gradient-to-r from-yellow-200 to-pink-200", image: "/placeholder5.png" },
{ id: 6, title: "Expert insights on high-impact web animations", category: "Expertise", bg: "bg-gradient-to-r from-pink-100 to-purple-100", image: "/placeholder6.png" },
{ id: 7, title: "Why storytelling matters in digital culture", category: "Culture", bg: "bg-gradient-to-r from-green-200 to-blue-200", image: "/placeholder7.png" },
{ id: 8, title: "Our work: behind the scenes of iconic projects", category: "Our work", bg: "bg-gradient-to-r from-purple-300 to-pink-300", image: "/placeholder8.png" },
{ id: 9, title: "Design thinking for next-gen branding", category: "Expertise", bg: "bg-gradient-to-r from-orange-200 to-pink-200", image: "/placeholder9.png" },
{ id: 10, title: "Creative inspiration: visual trends for 2025-2026", category: "Inspiration", bg: "bg-gradient-to-r from-pink-200 to-blue-200", image: "/placeholder10.png" },
{ id: 11, title: "Culture spotlight: how brands influence society", category: "Culture", bg: "bg-gradient-to-r from-blue-100 to-purple-200", image: "/placeholder11.png" },
{ id: 12, title: "Our work: award-winning campaign breakdown", category: "Our work", bg: "bg-gradient-to-r from-purple-200 to-yellow-200", image: "/placeholder12.png" },
{ id: 13, title: "Expert guide to scalable design systems", category: "Expertise", bg: "bg-gradient-to-r from-teal-200 to-purple-200", image: "/placeholder13.png" },
{ id: 14, title: "Inspiration gallery: bold concepts for creatives", category: "Inspiration", bg: "bg-gradient-to-r from-red-200 to-purple-200", image: "/placeholder14.png" },
{ id: 15, title: "Our work: transforming brands with modern UI", category: "Our work", bg: "bg-gradient-to-r from-purple-100 to-pink-100", image: "/placeholder15.png" },
];

export default function BlogList() {
  const [activeTab, setActiveTab] = useState("All articles");
  const containerRef = useRef(null);

  useEffect(() => {
    const items = containerRef.current.querySelectorAll(".blog-card");
    gsap.from(items, {
      opacity: 0,
      filter:'blur(20px)',
      y: 40,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power3.out',
    });
  }, [activeTab]);

  const filteredBlogs =
    activeTab === "All articles"
      ? blogData
      : blogData.filter((b) => b.category === activeTab);

  return (
    <div className="min-h-screen px-8 py-16 ">
      <div className="flex gap-4 mb-12 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full border text-lg font-medium transition-all duration-300 ${
              activeTab === tab
                ? "bg-black text-white"
                : "border-black text-black hover:bg-black hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredBlogs.map((blog) => (
          <div key={blog.id} className="blog-card cursor-pointer">
            <div className={`rounded-2xl h-56 mb-4 ${blog.bg}`}></div>
            <p className="text-xl font-semibold leading-tight">{blog.title}</p>
            <span className="inline-block mt-3 px-4 py-1 bg-black text-white rounded-full text-sm">
              {blog.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
