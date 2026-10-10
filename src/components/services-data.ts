import {
  Globe, TrendingUp, BarChart3, Wrench, Smartphone, Code2, Brain, Database,
  Cloud, ShieldCheck, Palette, Bot, type LucideIcon,
} from "lucide-react";

export type Service = { icon: LucideIcon; title: string; text: string; points: string[] };

export const services: Service[] = [
  { icon: Globe, title: "Website Development", text: "Fast, modern, mobile-friendly websites and online stores built to turn visitors into customers.", points: ["Business & corporate sites", "E-commerce stores", "Landing pages", "React / Next.js web apps"] },
  { icon: Smartphone, title: "Mobile App Development", text: "Android and iOS apps that put your business in your customers' pocket.", points: ["Android & iOS apps", "Flutter / React Native", "App Store publishing", "Booking & delivery apps"] },
  { icon: Code2, title: "Custom Software", text: "Tailor-made software that automates your daily work and saves hours every week.", points: ["ERP & CRM systems", "Billing & inventory software", "School & hospital management", "Java, Python, .NET, PHP"] },
  { icon: Brain, title: "Data Science & AI / ML", text: "Turn your data into predictions and smarter decisions with machine learning.", points: ["Sales & demand forecasting", "Customer segmentation", "Recommendation systems", "Python, Pandas, TensorFlow"] },
  { icon: BarChart3, title: "Data Analytics & BI", text: "Clear dashboards and reports that show what is working and what to fix.", points: ["Power BI & Tableau dashboards", "Excel & SQL reporting", "Google Analytics setup", "Monthly growth reports"] },
  { icon: Bot, title: "AI Chatbots & Automation", text: "AI assistants and workflows that answer customers and handle tasks 24/7.", points: ["Website & WhatsApp chatbots", "Workflow automation", "AI content tools", "Process automation (RPA)"] },
  { icon: TrendingUp, title: "Digital Marketing", text: "Get found and get chosen with SEO, social media and paid ads that bring real leads.", points: ["SEO & local SEO", "Google & Meta ads", "Social media management", "Content & email marketing"] },
  { icon: Palette, title: "UI / UX & Branding", text: "Beautiful, easy-to-use designs and a brand identity customers remember.", points: ["Logo & brand identity", "UI/UX design in Figma", "Prototypes & wireframes", "Social media creatives"] },
  { icon: Database, title: "Database Solutions", text: "Secure, well-structured databases that keep your business data safe and fast.", points: ["MySQL, PostgreSQL, MongoDB", "Database design", "Data migration", "Performance tuning"] },
  { icon: Cloud, title: "Cloud & DevOps", text: "Move to the cloud and deploy reliably with modern infrastructure.", points: ["AWS, Azure, Google Cloud", "Server setup & hosting", "CI/CD pipelines", "Docker & scaling"] },
  { icon: ShieldCheck, title: "Cyber Security", text: "Protect your website, data and customers from online threats.", points: ["Security audits", "SSL & firewall setup", "Backup & recovery", "Vulnerability testing"] },
  { icon: Wrench, title: "IT Support & Maintenance", text: "We keep your systems secure, updated and running smoothly so you can focus on business.", points: ["Hosting & domains", "Speed optimization", "Bug fixes & updates", "Annual maintenance plans"] },
];
