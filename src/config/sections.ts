import { 
  User, 
  Layout, 
  Briefcase, 
  Users, 
  Mail,
  Image as ImageIcon
} from "lucide-react";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Portfolio } from "@/components/Portfolio";
import { Experience } from "@/components/Experience";
import { Clients } from "@/components/Clients";
import { Contact } from "@/components/Contact";

export const SECTIONS = [
  { id: "about", title: "About Me", icon: User, component: About, color: "from-orange-400 to-orange-500", subtext: "Bio" },
  { id: "portfolio", title: "My Work", icon: ImageIcon, component: Portfolio, color: "from-blue-500 to-indigo-600", subtext: "78%" },
  { id: "services", title: "Services", icon: Layout, component: Services, color: "from-purple-500 to-fuchsia-600", subtext: "Pro" },
  { id: "experience", title: "Experience", icon: Briefcase, component: Experience, color: "from-emerald-500 to-teal-600", subtext: "Hist" },
  { id: "clients", title: "Clients", icon: Users, component: Clients, color: "from-pink-500 to-rose-600", subtext: "Love" },
  { id: "contact", title: "Contact", icon: Mail, component: Contact, color: "from-red-500 to-orange-600", subtext: "Now" },
];
