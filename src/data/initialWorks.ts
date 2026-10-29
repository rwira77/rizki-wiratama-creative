import aNewLight from "@/assets/eventporto/a-new-light.png";
import cutMeyriska from "@/assets/eventporto/cut-meyriska.png";
import donnaMiniTrunkShow from "@/assets/eventporto/donna-mini-trunk-show.png";
import ecoTrip from "@/assets/eventporto/eco-trip.png";
import exclusiveRevealDays from "@/assets/eventporto/exclusive-reveal-days.png";
import fashionShowTitiDJ from "@/assets/eventporto/fashion-show-titi-dj.png";
import fashionShowYuniShara from "@/assets/eventporto/fashion-show-yuni-shara.png";
import ivanGunawan from "@/assets/eventporto/ivan-gunawan.png";

const workBranding = "https://images.unsplash.com/photo-1541462608141-ad4d60da3e8a?q=80&w=2670&auto=format&fit=crop";
const workEvent = "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2612&auto=format&fit=crop";

export interface ContentBlock {
  id: string | number;
  type: "image" | "text" | "grid";
  title?: string;
  content?: string;
  urls?: string[];
  columns?: number;
  mobileView?: string;
}

export interface Work {
  id: string;
  title: string;
  cat: string;
  img: string;
  problem: string;
  result: string;
  year: string;
  hasDetail: boolean;
  block_gap?: number;
  grid_gap?: number;
  content_blocks?: ContentBlock[];
}

export const initialWorks: Work[] = [
  // Campaign & Event Works
  {
    id: "donna-mini-trunk-show",
    title: "Donna Mini Trunk Show & Styling Session with Okky Asokawati",
    cat: "Campaign & Event",
    img: donnaMiniTrunkShow,
    problem: "Strengthening brand relevance & loyalty for Eid collection launch",
    result: "+100% Sales Boost during campaign period, 1.2M+ Social Media Impressions, +200% Engagement Rate",
    year: "2025",
    hasDetail: true,
    block_gap: 60,
    content_blocks: [
      {
        id: "donna-trunk-img",
        type: "image",
        content: donnaMiniTrunkShow,
      },
      {
        id: "donna-trunk-about",
        type: "text",
        title: "About Event",
        content: "Donna Mini Trunk Show & Personal Branding, Styling Session with Okky Asokawati. This event marked the launch of Donna Privé's latest collection for the Eid season, featuring Mrs. Okky Asokawati, a renowned fashion expert, who hosted a styling session and personal branding workshop exclusively for Donna Privé's loyal customers.",
      },
      {
        id: "donna-trunk-result",
        type: "text",
        title: "Result & Impact",
        content: "The event successfully strengthened the bond between the brand and its loyal audience, ensuring Donna Privé remained relevant and top-of-mind. It boosted sales by 100% during the campaign period and significantly increased online exposure, generating over 1.2M social media impressions, a 200% engagement rate increase, and a remarkable uplift in overall brand awareness.",
      },
    ],
  },
  {
    id: "exclusive-reveal-days",
    title: "Donna Privé Exclusive Reveal Days",
    cat: "Campaign & Event",
    img: exclusiveRevealDays,
    problem: "Creating urgency, exclusivity, and driving explosive store revenue surge",
    result: "Rp300M in Daily Sales (+2,900% to +5,900% increase versus typical daily store revenue)",
    year: "2025",
    hasDetail: true,
    block_gap: 60,
    content_blocks: [
      {
        id: "reveal-days-img",
        type: "image",
        content: exclusiveRevealDays,
      },
      {
        id: "reveal-days-about",
        type: "text",
        title: "About the Campaign",
        content: "Donna Privé Exclusive Reveal Days, a 3-day special event held at Donna Privé Duta Mall Banjarmasin. The event featured daily product launches of limited collections available for only one day, special discounts of up to 50%, exclusive giveaways for the first 15 buyers each day, and a grand raffle with prizes ranging from e-bikes to home appliances and shopping vouchers. The event was designed to create urgency, exclusivity, and strengthen customer loyalty by combining fashion with rewarding shopping experiences.",
      },
      {
        id: "reveal-days-result",
        type: "text",
        title: "Result & Impact",
        content: "Within just three days, the Exclusive Reveal Days delivered record-breaking performance, reaching Rp300M in daily sales. This represents a +2,900% to +5,900% increase versus typical daily store revenue. Beyond revenue, the event amplified customer excitement and loyalty, reinforcing Donna Privé's positioning as a premium, high-demand brand.",
      },
    ],
  },
  {
    id: "cut-meyriska-donna-prive",
    title: "Cut Meyriska x Donna Privé Collaboration Campaign",
    cat: "Campaign & Event",
    img: cutMeyriska,
    problem: "Expanding brand reach through high-profile star collaboration and national KOL amplification",
    result: "Viral nationwide exposure, massive KOL engagement & best-selling product launch",
    year: "2025",
    hasDetail: true,
    block_gap: 60,
    content_blocks: [
      {
        id: "cut-meyriska-img",
        type: "image",
        content: cutMeyriska,
      },
      {
        id: "cut-meyriska-about",
        type: "text",
        title: "About the Campaign",
        content: "The Donna Privé x Cut Meyriska Collaboration Campaign was a milestone project that combined product innovation with star power. Together with Cut Meyriska, a well-known Indonesian actress and influencer, Donna Privé launched an exclusive collaborative collection designed to reflect her personal style while aligning with the brand's premium identity. To amplify the campaign, a high-profile product launch event was organized, attended by numerous national-scale KOLs and influencers through Cut Meyriska's network. This strategy not only created buzz but also positioned Donna Privé within a wider audience segment.",
      },
      {
        id: "cut-meyriska-result",
        type: "text",
        title: "Result & Impact",
        content: "The collaboration generated significant impact both in sales and brand visibility. The launch event attracted massive media attention and created viral exposure on social media through national KOLs, reaching audiences far beyond Donna Privé's existing customer base. The collaborative products quickly became best-sellers, driving a remarkable uplift in sales during the launch period. Most importantly, the campaign reinforced Donna Privé's brand relevance in the fashion industry, while successfully engaging new loyal customers through the influence of Cut Meyriska's strong personal branding and community.",
      },
    ],
  },
  {
    id: "fashion-show-titi-dj",
    title: "Donna Privé Annual Fashion Show with Titi DJ",
    cat: "Campaign & Event",
    img: fashionShowTitiDJ,
    problem: "Elevating brand prestige and celebrating elegance on the runway",
    result: "Elevated brand equity, wide national media buzz & deepened customer emotional connection",
    year: "2025",
    hasDetail: true,
    block_gap: 60,
    content_blocks: [
      {
        id: "titi-dj-img",
        type: "image",
        content: fashionShowTitiDJ,
      },
      {
        id: "titi-dj-about",
        type: "text",
        title: "About the Campaign",
        content: "The Donna Privé Annual Fashion Show with Titi DJ was a signature brand event designed to showcase the latest collection in a glamorous and memorable way. By featuring Titi DJ, a legendary Indonesian diva, the show not only highlighted Donna Privé's commitment to fashion and elegance but also created an aspirational lifestyle moment for the audience. The event was crafted to strengthen Donna Privé's positioning as a premium fashion brand while fostering a deeper sense of belonging and loyalty among its community.",
      },
      {
        id: "titi-dj-result",
        type: "text",
        title: "Result & Impact",
        content: "The fashion show successfully elevated Donna Privé's brand image and created a lasting impression on both loyal customers and new audiences. The collaboration with Titi DJ brought significant media exposure and social media buzz, expanding brand awareness beyond the core market. More importantly, the event fostered stronger emotional connections with loyal customers, cultivating a dedicated community that continues to support and engage with the brand long after the event.",
      },
    ],
  },
  {
    id: "grand-opening-donna-makassar",
    title: "Grand Opening Donna Privé Makassar with Ivan Gunawan",
    cat: "Campaign & Event",
    img: ivanGunawan,
    problem: "Establishing market presence and foot traffic for new city store expansion",
    result: "Record opening-day sales, surged store traffic & nationwide media coverage",
    year: "2025",
    hasDetail: true,
    block_gap: 60,
    content_blocks: [
      {
        id: "ivan-gunawan-img",
        type: "image",
        content: ivanGunawan,
      },
      {
        id: "ivan-gunawan-about",
        type: "text",
        title: "About the Campaign",
        content: "The Grand Opening of Donna Privé Makassar was a landmark expansion event, celebrating the brand's growth into a new city. To mark the occasion, Donna Privé invited Ivan Gunawan, one of Indonesia's most prominent fashion figures and TV personalities, as the guest star. His presence brought prestige and credibility, while also creating a strong attraction for both loyal customers and new audiences in Makassar. The event combined product showcases, meet-and-greet moments, and special opening promotions to ensure a memorable brand experience.",
      },
      {
        id: "ivan-gunawan-result",
        type: "text",
        title: "Result & Impact",
        content: "The grand opening generated tremendous excitement and positioned Donna Privé as a premium fashion brand in Makassar from day one. The presence of Ivan Gunawan attracted significant media coverage and social media exposure, boosting brand awareness regionally and nationally. Store traffic surged during the launch, with sales exceeding expectations on opening day. Beyond immediate commercial success, the event also laid a strong foundation for building a loyal customer community in Makassar, ensuring sustainable growth for the new store.",
      },
    ],
  },
  {
    id: "fashion-show-yuni-shara",
    title: "Donna Privé Annual Fashion Show with Yuni Shara",
    cat: "Campaign & Event",
    img: fashionShowYuniShara,
    problem: "Creating an aspirational runway experience and brand equity elevation",
    result: "Extensive media & social buzz, reinforced brand prestige & lasting emotional impact",
    year: "2025",
    hasDetail: true,
    block_gap: 60,
    content_blocks: [
      {
        id: "yuni-shara-img",
        type: "image",
        content: fashionShowYuniShara,
      },
      {
        id: "yuni-shara-about",
        type: "text",
        title: "About the Campaign",
        content: "The Donna Privé Annual Fashion Show with Yuni Shara was a celebration of elegance, artistry, and brand identity. By featuring Yuni Shara, an iconic Indonesian singer known for her timeless charm, the event brought together fashion and performance in a unique way. The fashion show served as a platform to unveil Donna Privé's newest collection while reinforcing its positioning as a premium and aspirational fashion brand. Beyond the runway, the event was designed to nurture deeper relationships with loyal customers and to inspire a wider audience through an unforgettable fashion experience.",
      },
      {
        id: "yuni-shara-result",
        type: "text",
        title: "Result & Impact",
        content: "The event successfully strengthened Donna Privé's brand equity, leaving a strong emotional impression on both loyal customers and first-time attendees. With Yuni Shara's presence, the fashion show generated extensive media and social media buzz, expanding awareness and enhancing the brand's prestige. More importantly, the event reinforced community-building efforts, fostering a loyal audience that associates Donna Privé not only with fashion, but also with cultural relevance and lifestyle aspiration.",
      },
    ],
  },
  {
    id: "a-new-light-lantern-festival",
    title: "A New Light 1.000 Lantern Festival Risalo Beach",
    cat: "Campaign & Event",
    img: aNewLight,
    problem: "Positioning Pantai Risalo as a premier tourism & cultural destination in South Kalimantan",
    result: "Sold-out event tickets, trending regional topic & strong economic empowerment for local residents",
    year: "2025",
    hasDetail: true,
    block_gap: 60,
    content_blocks: [
      {
        id: "lantern-festival-img",
        type: "image",
        content: aNewLight,
      },
      {
        id: "lantern-festival-about",
        type: "text",
        title: "About the Campaign",
        content: "The Festival 1.000 Lentera Tahun Baru – A New Light at Pantai Risalo was created as a unique cultural and tourism experience to celebrate the New Year in Kotabaru, South Kalimantan. As the first and largest water lantern festival in Kalimantan, the event featured sea lantern releases, live music, camping, games, and breathtaking sunrise and sunset views. More than just a celebration, the festival was designed to attract tourists, strengthen the positioning of Pantai Risalo as a destination, and create sustainable benefits for the local community. With strong support from the village, the event also highlighted the spirit of collaboration between tourism development and community empowerment.",
      },
      {
        id: "lantern-festival-result",
        type: "text",
        title: "Result & Impact",
        content: "The festival successfully brought massive attention to Pantai Risalo, drawing both local and regional tourists. Ticket sales exceeded expectations, with limited seats sold out quickly, proving the high level of public enthusiasm. On social media, the event generated strong engagement and became a trending local topic, boosting the visibility of Kotabaru as a travel destination. Beyond the numbers, the event provided tangible economic impact for surrounding communities, from homestays and food stalls to local vendors, ensuring that tourism growth directly benefited residents. The success of this festival established Pantai Risalo not only as a beautiful natural destination but also as a cultural hub capable of hosting large-scale, memorable experiences.",
      },
    ],
  },
  {
    id: "eco-trip-pantai-risalo",
    title: "Putik Bersih x Pantai Risalo Eco Trip Supported by Kahf",
    cat: "Campaign & Event",
    img: ecoTrip,
    problem: "Promoting coastal environmental awareness & community empowerment through sustainable action",
    result: "Hundreds of active participants, community eco-workshops & leading eco-destination status",
    year: "2025",
    hasDetail: true,
    block_gap: 60,
    content_blocks: [
      {
        id: "eco-trip-img",
        type: "image",
        content: ecoTrip,
      },
      {
        id: "eco-trip-about",
        type: "text",
        title: "About the Campaign",
        content: "Pantai Risalo, in collaboration with the community Putik Bersih and the brand Kahf, hosted an Eco Trip series as part of its commitment to sustainability and environmental awareness. The program featured a Beach Clean Up to preserve the coastal environment, an Eco Kokedama Workshop to educate participants about eco-friendly practices, and Reuse: Sharing Clothes Worth Wearing to support local communities. This initiative not only emphasized environmental preservation but also fostered community empowerment through meaningful collaboration.",
      },
      {
        id: "eco-trip-result",
        type: "text",
        title: "Result & Impact",
        content: "The event successfully engaged hundreds of participants, including volunteers, visitors, and local residents. Dozens of bags of waste were collected from the beach, hundreds of reusable clothes were distributed to those in need, and many enthusiastic participants joined the Eco Kokedama Workshop. This program significantly boosted awareness among visitors about the importance of sustainability, strengthened Pantai Risalo's relationship with the community, and positioned the destination as a leading eco-conscious tourism spot in South Kalimantan.",
      },
    ],
  },

  // Existing Branding Works
  {
    id: "remlint-identity",
    title: "Remlint Visual Identity",
    cat: "Branding",
    img: workBranding,
    problem: "Outdated legacy perception",
    result: "+45% Modern brand recognition and digital engagement",
    year: "2024",
    hasDetail: true,
  },
  {
    id: "soiree-activation",
    title: "Soirée Activation",
    cat: "Branding",
    img: workEvent,
    problem: "Unmemorable launch event",
    result: "Engaged 500+ exclusive guests with high media shareability",
    year: "2024",
    hasDetail: false,
  },
];
