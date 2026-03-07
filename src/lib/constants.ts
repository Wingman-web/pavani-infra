export const STATS = [
  { label: "Years of Experience", value: 29, suffix: "+", icon: "expertise" },
  { label: "Happy Families", value: 15000, suffix: "+", icon: "families" },
  { label: "Completed Projects", value: 50, suffix: "+", icon: "building" },
  { label: "Sq.ft Delivered", value: 10, suffix: "M+", icon: "area" },
] as const;

export const CITIES = [
  {
    name: "Hyderabad",
    image:
      "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2FPavani_Felicity_ea55966d27.jpg&w=2048&q=75",
    description: "The City of Pearls",
  },
  {
    name: "Bangalore",
    image:
      "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2FMIRABILIA_ddb7ad0906.jpg&w=2048&q=75",
    description: "India's Silicon Valley",
  },
  {
    name: "Chennai",
    image:
      "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2FPavani_Northstar_97a57a504e.jpg&w=2048&q=75",
    description: "Gateway to the South",
  },
  {
    name: "Vijayawada",
    image:
      "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2FPavani_Solitaire_aaa5e8c629.jpg&w=2048&q=75",
    description: "The Business Capital",
  },
  {
    name: "Nellore",
    image:
      "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2FPavani_Vista_f5574ad651.png&w=2048&q=75",
    description: "The Rice City",
  },
] as const;

export const PROJECTS = [
  {
    name: "Pavani Solitaire",
    area: "1.5 Acres",
    location: "Ganguru, Vijayawada",
    image:
      "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2FPavani_Solitaire_aaa5e8c629.jpg&w=1080&q=75",
    slug: "pavani-solitaire",
    type: "Premium Apartments",
  },
  {
    name: "Pavani Felicity",
    area: "2.5 Acres",
    location: "Nizampet, Hyderabad",
    image:
      "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2FPavani_Felicity_ea55966d27.jpg&w=1080&q=75",
    slug: "pavani-felicity",
    type: "Luxury Living",
  },
  {
    name: "Pavani Mirabilia",
    area: "15 Acres",
    location: "Whitefield, Bangalore",
    image:
      "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2FMIRABILIA_ddb7ad0906.jpg&w=1080&q=75",
    slug: "pavani-mirabilia",
    type: "Township",
  },
  {
    name: "Pavani Northstar",
    area: "1.67 Acres",
    location: "Korattur, Chennai",
    image:
      "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2FPavani_Northstar_97a57a504e.jpg&w=1080&q=75",
    slug: "pavani-northstar",
    type: "Premium Residences",
  },
] as const;

export const TESTIMONIALS = [
  {
    name: "Mr. Shubham & Mrs. Manisha",
    quote:
      "We recently had a walkthrough of a similar flat in Pavani Mirabilia, and we're excited about the possession. The quality of construction and attention to detail exceeded our expectations.",
    project: "Pavani Mirabilia",
    image:
      "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2F1_d1e6da4868.png&w=640&q=75",
    videoId: "grJC3waRpI0",
  },
  {
    name: "Mr. Nabarun & Mrs. Mananta",
    quote:
      "I learned about Pavani Sarovar from a friend who owns a flat in Phase 1. I recently booked a 3BHK in Phase 2, and I'm thrilled with the value and quality we're getting.",
    project: "Pavani Sarovar",
    image:
      "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2F7_853aae9c2f.png&w=640&q=75",
    videoId: "Qp-hOzl6zaE",
  },
  {
    name: "Mr. Prashanth & Mrs. Gowri",
    quote:
      "Purchasing our flat at the start of the project was a breeze. We recently visited the site and were delighted with the visible progress and premium quality of construction.",
    project: "Pavani Infra",
    image:
      "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2F2_14a63265ff.png&w=640&q=75",
    videoId: "A956lPlIOYM",
  },
  {
    name: "Mr. Yatendra & Shivangi",
    quote:
      "Wow! Pavani Sarovar is the perfect choice for anyone seeking a pleasant, eco-friendly environment and a quality, luxurious living experience.",
    project: "Pavani Sarovar",
    image:
      "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2F6_3b3fc05a10.png&w=640&q=75",
    videoId: "gCVOwAG3zIA",
  },
  {
    name: "Mr. Pallav & Mrs. Anshu",
    quote:
      "Visiting the site gave us confidence that we'll receive our flat on time. The quality of construction is exceptional, and the team has been incredibly supportive.",
    project: "Pavani Infra",
    image:
      "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2F4_79f8de6a6f.png&w=640&q=75",
    videoId: "g5i9VJZOu7I",
  },
] as const;

export const BLOGS = [
  {
    date: "28 Jan",
    title:
      "Family Living in South Indian Cities: Pavani Infra's Best Residential Projects",
    slug: "family-living-in-south-indian-cities",
    image:
      "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2FFamily_Living_in_South_Indian_Cities_Pavani_Infra_s_Best_Residential_Projects_860fb136cb.jpeg&w=1080&q=75",
  },
  {
    date: "28 Jan",
    title:
      "Space & Comfort Redefined: A Closer Look at Pavani Felicity's 3 BHK Layouts",
    slug: "space-and-comfort-redefined",
    image:
      "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2FSpace_and_Comfort_Redefined_A_Closer_Look_at_Pavani_Felicity_s_3_BHK_Layouts_48a3c53449.jpeg&w=1080&q=75",
  },
  {
    date: "28 Jan",
    title:
      "Why Nizampet Is Becoming One of Hyderabad's Most Desired Residential Hubs",
    slug: "why-nizampet-is-becoming-desired",
    image:
      "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2FWhy_Nizampet_Is_Becoming_One_of_Hyderabad_s_Most_Desired_Residential_Hubs_fc165764c1.jpeg&w=1080&q=75",
  },
  {
    date: "29 Dec",
    title:
      "The Rise of Premium Living in Vijayawada: Pavani Solitaire Leading the Way",
    slug: "rise-of-premium-living-vijayawada",
    image:
      "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2FYour_paragraph_text_3_118c5c56ff.png&w=2048&q=75",
  },
  {
    date: "29 Dec",
    title:
      "Ready-to-Move Luxury: Understanding the Benefits of Choosing Pavani Solitaire",
    slug: "ready-to-move-luxury-solitaire",
    image:
      "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2FYour_paragraph_text_2_27adb71ffb.png&w=2048&q=75",
  },
  {
    date: "29 Dec",
    title: "First-Time Homebuyer Guide: What to Look for When Choosing a Home",
    slug: "first-time-homebuyer-guide",
    image:
      "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2FYour_paragraph_text_1_180fa13c86.png&w=2048&q=75",
  },
] as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/" },
  { label: "Projects", href: "/" },
  { label: "Blogs", href: "/" },
  { label: "Career", href: "/" },
  { label: "Contact", href: "/" },
] as const;

export const CONTACT_INFO = {
  phone: "080-470-93910",
  email: "enquiries@pavaniinfra.com",
  offices: {
    bangalore: "1st Cross Rd, Green Garden Layout, Bangalore - 560037",
    hyderabad: "4th Floor, Road No.36, Jubilee Hills, Hyderabad - 500 033",
  },
  social: {
    instagram: "https://www.instagram.com/pavaniinfra.official",
    facebook: "https://www.facebook.com/pavaniinfra",
    youtube: "https://www.youtube.com/@Pavani-Infra",
    linkedin: "https://www.linkedin.com/company/pavaniinfra/",
  },
} as const;

export const EASINGS = {
  smooth: "power3.out",
  dramatic: "power4.inOut",
  textReveal: "power3.out",
  maskReveal: "power3.inOut",
} as const;
