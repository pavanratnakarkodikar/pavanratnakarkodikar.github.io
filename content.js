// ─────────────────────────────────────────────────────────────
//  EDIT YOUR PORTFOLIO HERE
//  Add / remove / reorder items and refresh the page.
//  YouTube: paste just the video ID (the part after youtu.be/).
//  featured: true  → shown as a big row at the top (currently 5).
//  Everything else appears in the "All work" index; give each a type (TVC, Brand film, Promo...).
// ─────────────────────────────────────────────────────────────

window.PORTFOLIO = {
  youtube: [
    { id: "mrFhygFY0ug", title: "Kashi", subtitle: "The City of Light", client: "Documentary trailer",
      tags: ["Documentary trailer", "Edit"], type: "Documentary trailer", featured: true },
    { id: "da3DOjYqVgs", title: "30 Minutes Strategy", subtitle: "ft. Sunil Chhetri", client: "White Gold × BFC",
      tags: ["Brand film", "Sports", "Edit"], featured: true },
    { id: "PzUnxnk6Dio", title: "White Gold × Kerala Blasters FC", subtitle: "White Gold", client: "White Gold",
      tags: ["Brand film", "Sports", "Edit"], featured: true },
    { id: "ieNHyExbpOo", title: "Best Exercise to Release Pledged Gold", subtitle: "White Gold", client: "White Gold",
      tags: ["TVC", "Edit"], featured: true },
    { id: "LYQg1dbE0rc", title: "Path to Glory", subtitle: "Ajna Amit — India's youngest MMA champion", client: "White Gold CSR",
      tags: ["Series", "CSR", "Edit"], type: "Series", featured: true },
    { id: "w7jDm6ndg0E", title: "Firefly Journey", subtitle: "Anand Audio", client: "Anand Audio",
      tags: ["Promo", "Edit"], type: "Promo" },
    { id: "dWlFInODuJA", title: "Firefly Theme Lyrical", client: "Anand Audio", type: "Lyrical" },
    { id: "CS9MJSOZXL8", title: "Gold of Karnataka Ep. 1", client: "White Gold CSR", type: "Series" },
    { id: "7SvRv_55cA0", title: "The Joy of Fatherhood", client: "White Gold CSR", type: "Series" },
    { id: "UOndBAOxrqE", title: "Don't Hold Your Dreams Back", client: "White Gold", type: "TVC" },
    { id: "IX94m5XhA3w", title: "Two Sisters, One Trust", client: "White Gold Money", type: "TVC" },
    { id: "hUTH6EnWEFk", title: "A Wife's Support", client: "White Gold Money", type: "TVC" },
    { id: "sSLqAVcemWY", title: "Back to Glory", client: "White Gold Money", type: "TVC" },
  ],

  // Vertical reels: poster image in /assets, link to the post.
  reels: [
    { poster: "assets/reel-amudham.jpg", title: "The Midnight Therapy", client: "Cafe Amudham",
      note: "For nights when your mind feels heavy — a drive, an honest talk, coffee at 1 am.",
      url: "https://www.instagram.com/reel/DaQWJsnSOkI/" },
    { poster: "assets/reel-goa.jpg", title: "Airport, Drives & Sunsets", client: "Lab Grown Diamonds",
      note: "A beautiful diamond and a beautiful escape to Goa.",
      url: "https://www.instagram.com/reel/DadDALKz2yn/" },
    { poster: "assets/reel-ctr.jpg", title: "Golden Hour", client: "CTR Bangalore",
      note: "The best golden hour in Bangalore is on the plate.",
      url: "https://www.instagram.com/reel/DTu1Sa_k_5C/" },
  ],

  tools: [
    { name: "Premiere Pro", url: "https://www.adobe.com/products/premiere.html" },
    { name: "After Effects", url: "https://www.adobe.com/products/aftereffects.html" },
    { name: "DaVinci Resolve", url: "https://www.blackmagicdesign.com/products/davinciresolve" },
  ],
};
