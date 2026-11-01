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
  // top: true  → shown in the "1M+ views" group, with its view count on the poster.
  reels: [
    { poster: "assets/reel-ullas-somevaada.jpg", title: "The Ullas Melody", client: "Ullas Agarbathi · SomeVaada",
      note: "The story behind the iconic melody, told by its creator, Praveen Godkhindi.",
      url: "https://www.instagram.com/reel/DEzlrnMS0eE/", views: "3.5M", top: true },
    { poster: "assets/reel-ullas-yogiraj.jpg", title: "Arun Yogiraj", client: "Ullas Agarbathi · SomeVaada",
      note: "The sculptor of Ayodhya's Ram Lalla idol on setbacks and perseverance.",
      url: "https://www.instagram.com/reel/C_zyEmKvSHe/", views: "1.2M", top: true },
    { poster: "assets/reel-ullas-dharmendra.jpg", title: "Dharmendra", client: "Ullas Agarbathi · SomeVaada",
      note: "A career across the globe, and a love for Kannada that brought him home.",
      url: "https://www.instagram.com/reel/DAybkdGSm93/", views: "1.2M", top: true },
    { poster: "assets/reel-vrl-ayudhapooja.jpg", title: "Ayudhapooja", client: "Vijayanand Travels × Ullas",
      note: "A fleet of travel giants, given the purest and most fragrant welcome.",
      url: "https://www.instagram.com/reel/DA-McIxPMU8/", views: "1.1M", top: true },

    { poster: "assets/reel-amudham.jpg", title: "The Midnight Therapy", client: "Cafe Amudham",
      note: "For nights when your mind feels heavy — a drive, an honest talk, coffee at 1 am.",
      url: "https://www.instagram.com/reel/DaQWJsnSOkI/" },
    { poster: "assets/reel-diamonds.jpg", title: "Diamonds That Take You Places", client: "Lab Grown Diamonds",
      note: "A beautiful diamond and a beautiful escape to Goa.",
      url: "https://www.instagram.com/reel/DadDALKz2yn/" },
    { poster: "assets/reel-gocolors-linen.jpg", title: "Indian Summer", client: "Go Colors",
      note: "No rules. Just linen, lace, and wherever the board takes her.",
      url: "https://www.instagram.com/reel/DXRnkZXk5e2/" },
    { poster: "assets/reel-ctr-sunsets.jpg", title: "Airport, Drives & Sunsets", client: "CTR Bangalore",
      note: "The best golden hour in Bangalore is on the plate.",
      url: "https://www.instagram.com/reel/DTu1Sa_k_5C/", views: "16.7K" },
    { poster: "assets/reel-ctr-radio.jpg", title: "World Radio Day", client: "CTR Bangalore",
      note: "For the Radio Museum's Uday Kalaburgi, and every radio lover.",
      url: "https://www.instagram.com/reel/DUrmjaxE_rF/", views: "25.2K" },
    { poster: "assets/reel-ctr-mist.jpg", title: "Raagalahari in the Mist", client: "CTR Bangalore",
      note: "Malleshwaram, wrapped in winter mist.",
      url: "https://www.instagram.com/reel/DQ0XVSTEwkV/", views: "136K" },
    { poster: "assets/reel-unico-update.jpg", title: "First Update of the Year", client: "Unico Creative Studios",
      note: "The studio's opening reel for 2026.",
      url: "https://www.instagram.com/reel/DTZxgNakx6Z/" },
    { poster: "assets/reel-ullas-flute.jpg", title: "The Flute Maestro", client: "Ullas Agarbathi · SomeVaada",
      note: "Praveen Godkhindi on an instrument that is his whole self.",
      url: "https://www.instagram.com/reel/DEuWDhivl-U/", views: "791K" },
  ],

  tools: [
    { name: "Premiere Pro", url: "https://www.adobe.com/products/premiere.html" },
    { name: "After Effects", url: "https://www.adobe.com/products/aftereffects.html" },
    { name: "DaVinci Resolve", url: "https://www.blackmagicdesign.com/products/davinciresolve" },
  ],
};
