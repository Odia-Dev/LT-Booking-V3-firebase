import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArrowLeft, BookOpen, Calendar, Clock, Share2, ChevronRight, Sparkles } from "lucide-react";

interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  author: string;
  authorTitle: string;
  readTime: string;
  category: string;
  heroImg: string;
  content: { heading?: string; body: string; img?: string }[];
  tags: string[];
  relatedSlugs: string[];
}

const BLOG_POSTS: Record<string, BlogPost> = {
  "toyota-hybrid-maintenance": {
    slug: "toyota-hybrid-maintenance",
    title: "Caring for Your Self-Charging Hybrid",
    subtitle: "Understanding the simple steps to maximize the life of your Toyota Hybrid battery and powertrain.",
    date: "July 01, 2026",
    author: "Laxmi Toyota Service Team",
    authorTitle: "Certified Toyota Technicians",
    readTime: "5 min read",
    category: "Maintenance",
    heroImg: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200",
    content: [
      {
        heading: "Why Toyota Hybrids Are Different",
        body: "Toyota's self-charging hybrid technology is a marvel of engineering. Unlike plug-in hybrids, the battery in a Hyryder or Innova Hycross charges itself through regenerative braking and the petrol engine — meaning you never need to plug in. However, understanding the system helps you get the best out of it.",
      },
      {
        heading: "Battery Care Essentials",
        body: "The high-voltage Nickel-Metal Hydride (NiMH) or Lithium-ion battery in Toyota hybrids is designed to last the vehicle's lifetime under normal usage. Toyota's battery management system (BMS) keeps the state of charge between 40% and 80% to maximize longevity. There is no special 'battery charging' needed on your part.",
        img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800",
      },
      {
        heading: "Scheduled Service Intervals",
        body: "For Toyota hybrids in Indian conditions, we recommend oil change every 10,000 km or 6 months, whichever is earlier. The brake pads last significantly longer on hybrids thanks to regenerative braking doing most of the deceleration work. Brake fluid should still be changed every 2 years as per Toyota guidelines.",
      },
      {
        heading: "Driving Tips to Maximize Efficiency",
        body: "Use 'EV Mode' at low speeds in city traffic when the battery is adequately charged. Anticipate stops early so the regenerative braking system can recapture more energy. Pre-cool or pre-heat the cabin while the engine is running (not in traffic) to reduce load on the system while moving.",
      },
      {
        heading: "When to Visit a Service Center",
        body: "If you see the 'Ready' light not appearing on startup, any amber or red warning triangle on the instrument cluster, or experience unusual engine behaviour at idle — visit your nearest Laxmi Toyota service center immediately. Hybrid systems are robust but should only be serviced by Toyota-certified technicians.",
      },
    ],
    tags: ["Hybrid", "Maintenance", "Service Tips", "Battery Care", "Hyryder"],
    relatedSlugs: ["top-suvs-for-odisha", "why-book-online-advantage"],
  },
  "top-suvs-for-odisha": {
    slug: "top-suvs-for-odisha",
    title: "Top Toyota SUVs for Odisha Roads",
    subtitle: "A comparison guide between Taisor, Hyryder, and Fortuner to decide which segment fits your family best.",
    date: "June 25, 2026",
    author: "Laxmi Toyota Sales Team",
    authorTitle: "Vehicle Advisors, South Odisha",
    readTime: "7 min read",
    category: "Buying Guide",
    heroImg: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200",
    content: [
      {
        heading: "Understanding the Road Conditions in Odisha",
        body: "Odisha's road network spans excellent national highways like NH-16 and NH-26 to narrower state roads in districts like Koraput and Kalahandi. The right SUV depends heavily on your primary usage — city commuting, highway cruising, or mixed driving across varied terrain.",
      },
      {
        heading: "Toyota Taisor — The Urban Warrior",
        body: "The Taisor's 1.0L Turbo Boosterjet engine produces 100 PS of punchy power ideal for city stop-start traffic in Brahmapur or Berhampur. Its compact dimensions make parking effortless while the elevated stance handles speed breakers with ease. Best for: Urban families, first-time SUV buyers.",
        img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
      },
      {
        heading: "Urban Cruiser Hyryder — The Smart Family SUV",
        body: "The Hyryder's self-charging hybrid technology delivers exceptional fuel efficiency of 27.97 km/l in highway runs — critical for Odisha's long intercity stretches. The AWD variant handles unsealed roads in tribal district areas confidently. Best for: Families driving 1,500+ km/month, government officials.",
      },
      {
        heading: "Toyota Fortuner — The Ultimate Statement",
        body: "For South Odisha's business class and large families requiring absolute road presence, the Fortuner's 2.7L petrol or 2.8L diesel delivers commanding performance. The Fortuner is also a status symbol at Brahmapur's city events and is highly sought after for government and contractor use. Best for: Business owners, large families, prestige buyers.",
      },
      {
        heading: "Our Recommendation",
        body: "Budget ₹8-12 Lakh → Taisor. Budget ₹12-18 Lakh → Hyryder Hybrid for running cost savings. Budget ₹35 Lakh+ → Fortuner with no compromise. Visit any of our 8 showrooms across South Odisha for a personalized test drive comparison.",
      },
    ],
    tags: ["SUV", "Comparison", "Buying Guide", "Fortuner", "Hyryder", "Taisor", "Odisha"],
    relatedSlugs: ["toyota-hybrid-maintenance", "why-book-online-advantage"],
  },
  "why-book-online-advantage": {
    slug: "why-book-online-advantage",
    title: "The Self-Serve Booking Advantage",
    subtitle: "How booking your Toyota online guarantees priority delivery ranks and invoice bonus claims.",
    date: "June 18, 2026",
    author: "Laxmi Toyota Digital Team",
    authorTitle: "Customer Experience, Laxmi Toyota",
    readTime: "4 min read",
    category: "Announcements",
    heroImg: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1200",
    content: [
      {
        heading: "Why We Built an Online Booking System",
        body: "Laxmi Toyota's online booking platform was built to give every customer — whether in Brahmapur city or rural Rayagada — equal access to vehicle allocation without the need to visit a showroom. Your slot in our delivery queue is secured from the moment your booking deposit is processed.",
      },
      {
        heading: "Priority Allocation Guarantee",
        body: "When you book online with a deposit payment, your name is logged with a timestamp into our allocation database. This means customers who book earlier receive their vehicles earlier — even during high-demand periods for popular models like the Hyryder and Innova Hycross.",
        img: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=800",
      },
      {
        heading: "The ₹5,000 Online Exclusive Bonus",
        body: "Customers who book online receive an exclusive ₹5,000 discount applied directly to their final invoice at the time of vehicle delivery. This benefit is only applicable for bookings made through laxmitoyota.co.in and cannot be claimed retrospectively for walk-in bookings.",
      },
      {
        heading: "Secure Payment Gateway",
        body: "Your booking deposit is processed through Razorpay — India's most trusted payment infrastructure — with bank-grade encryption. Your deposit is fully refundable prior to vehicle invoicing if you choose to cancel or change your model selection.",
      },
      {
        heading: "How to Book in 3 Steps",
        body: "Step 1: Browse our vehicle lineup and select your preferred model and variant. Step 2: Sign in with your Google account for identity verification. Step 3: Complete the booking form and authorize your deposit payment — done! You'll receive a booking reference number and our team will call within 24 hours.",
      },
    ],
    tags: ["Online Booking", "Priority Delivery", "Offer", "Digital", "Razorpay"],
    relatedSlugs: ["top-suvs-for-odisha", "toyota-hybrid-maintenance"],
  },
};

const ALL_POSTS = Object.values(BLOG_POSTS);

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];
  if (!post) return { title: "Article Not Found | Laxmi Toyota" };
  return {
    title: `${post.title} | Laxmi Toyota Newsroom`,
    description: post.subtitle,
    keywords: post.tags.join(", "),
  };
}

export async function generateStaticParams() {
  return Object.keys(BLOG_POSTS).map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];

  if (!post) notFound();

  const related = post.relatedSlugs
    .map((s) => BLOG_POSTS[s])
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Promo Banner */}
      <div className="bg-[#EB0A1E] text-white py-3 px-4 text-center text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 fill-white" />
        ⚡ ONLINE EXCLUSIVE: Book your Toyota online today &amp; get ₹5,000 instant invoice discount!
      </div>

      {/* Hero */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.heroImg}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-4xl mx-auto">
          <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-white bg-[#EB0A1E] px-3 py-1 rounded mb-3">
            {post.category}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {post.title}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-8">
          <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/blog" className="hover:text-slate-700 transition-colors">Newsroom</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-600 truncate max-w-[200px]">{post.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
          {/* Main Content */}
          <article>
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-xs text-slate-500 font-semibold">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#EB0A1E]" />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#EB0A1E]" />
                {post.readTime}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                By {post.author}
              </span>
            </div>

            <p className="text-base text-slate-500 leading-relaxed mb-8 font-medium italic border-l-4 border-[#EB0A1E] pl-4">
              {post.subtitle}
            </p>

            {/* Article Body */}
            <div className="prose prose-slate max-w-none space-y-8">
              {post.content.map((section, i) => (
                <div key={i} className="space-y-4">
                  {section.heading && (
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                      {section.heading}
                    </h2>
                  )}
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {section.body}
                  </p>
                  {section.img && (
                    <div className="rounded-2xl overflow-hidden shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={section.img}
                        alt={section.heading || post.title}
                        className="w-full h-56 object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-10 pt-6 border-t border-slate-200">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Tags</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="mt-6 flex items-center gap-3">
              <Share2 className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Share this article</span>
            </div>

            {/* Back */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 mt-10 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-[#EB0A1E] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Newsroom
            </Link>
          </article>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Author Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <div className="h-14 w-14 bg-[#EB0A1E]/10 rounded-full flex items-center justify-center text-[#EB0A1E] font-black text-xl mb-4">
                LT
              </div>
              <p className="font-black text-slate-900 text-sm">{post.author}</p>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">{post.authorTitle}</p>
            </div>

            {/* CTA */}
            <div className="bg-slate-950 text-white rounded-2xl p-6 space-y-4">
              <p className="text-[10px] font-bold tracking-widest uppercase text-[#EB0A1E]">Ready to Drive?</p>
              <p className="text-sm font-bold leading-snug">Book your Toyota online and unlock ₹5,000 off your invoice.</p>
              <Link
                href="/vehicles"
                className="block text-center bg-[#EB0A1E] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-colors"
              >
                Explore Vehicles
              </Link>
            </div>

            {/* Related Articles */}
            {related.length > 0 && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Related Articles</p>
                <div className="space-y-4">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/blog/${r.slug}`}
                      className="block group"
                    >
                      <div className="h-28 rounded-xl overflow-hidden mb-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={r.heroImg}
                          alt={r.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-[#EB0A1E] transition-colors leading-snug">
                        {r.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{r.readTime} · {r.date}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* All Posts Link */}
            <div className="text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EB0A1E] hover:underline uppercase tracking-wider"
              >
                View All Articles <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
