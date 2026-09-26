export type Brand = {
  slug: string;
  name: string;
  sector: string;
  year?: string;
  line: string;
  headline: string;
  intro: string;
  idea: string;
  ideaBody: string;
  accent: string;
  paper: string;
  ink: string;
  type: string;
  typeBody: string;
  colours: { name: string; hex: string; ink: string }[];
  images: { key: string; caption: string; alt: string }[];
  scope: string[];
};

export const brands: Brand[] = [
  {
    slug: "our-market", name: "Our Market", sector: "Retail & community", year: "2026",
    line: "Rare finds. A shared feeling.", headline: "You are\nin on it.",
    intro: "A sister-led Lagos bazaar bringing fashion, fabric, home finds, and people together. The identity gives that open, social experience a recognisable voice and a structure that can grow with every edition.",
    idea: "Built from the stall.",
    ideaBody: "A canopy, an opening, and the letter M come together in the Stall M. The wordmark leads; the compact icon carries the place into smaller spaces. An OM emblem adds another register for badges and collaborations. Across the system, the same idea holds: discovery should feel open to everyone.",
    accent: "#3257D6", paper: "#F3E6D0", ink: "#201C18",
    type: "Character meets clarity.", typeBody: "Bricolage Grotesque gives the headlines their personality. Manrope keeps dates, directions, prices, and everyday information easy to read. A repeatable edition system makes each market feel related, without looking identical.",
    colours: [{name:"Bazaar Blue",hex:"#3257D6",ink:"#FFFFFF"},{name:"Find Orange",hex:"#F06536",ink:"#201C18"},{name:"Stall Green",hex:"#207B58",ink:"#FFFFFF"},{name:"Sun Yellow",hex:"#F1B83D",ink:"#201C18"},{name:"Market Cream",hex:"#F3E6D0",ink:"#201C18"}],
    images: [{key:"tote",caption:"A little of the market, carried home.",alt:"Our Market wordmark on a canvas tote carried by a person in a red top"},{key:"tote-back",caption:"A second side to the same story.",alt:"Geometric Our Market graphic in green, blue, orange and yellow on the reverse of a tote"},{key:"social",caption:"The next edition, in your pocket.",alt:"Our Market Saturday Finds campaign displayed on a phone"},{key:"stall",caption:"One identity, from the first invitation to the stall.",alt:"Our Market canopy and stall signage application"}],
    scope: ["Visual identity", "Logo system", "Colour & typography", "Brand voice", "Edition system", "Application direction"],
  },
  {
    slug:"beams-by-edo",name:"Beams By Edo",sector:"Sportswear & lifestyle",year:"2024",
    line:"Made for movement. Rooted in joy.",headline:"Good energy.\nIn every step.",
    intro:"Beams By Edo is a Nigerian sportswear brand with a focus on socks and a belief in love, humanity, originality, and community. Its identity brings those values into a bold, playful visual language that works on the product as well as around it.",
    idea:"A small mark. A lot of personality.",ideaBody:"The expressive BBE identity moves between a circular badge and a compact symbol. Repeated curves and angled shapes carry that character into patterns, while the simpler mark stays legible on a sock, a label, or a small piece of packaging.",
    accent:"#01624E",paper:"#F7F9EC",ink:"#123B31",
    type:"Big type. Bright spirit.",typeBody:"Impact brings a strong, condensed voice to headlines. Futura gives the supporting information a quieter geometric rhythm. Deep green grounds the palette, with yellow and orange bringing warmth and movement.",
    colours:[{name:"Growth",hex:"#01624E",ink:"#FFFFFF"},{name:"Uber Beam",hex:"#FFB52A",ink:"#123B31"},{name:"Bubblin Pop",hex:"#F84525",ink:"#171711"},{name:"Faded Mist",hex:"#F7F9EC",ink:"#123B31"}],
    images:[{key:"sock",caption:"The smallest signature is still a signature.",alt:"White athletic sock with the green Beams By Edo symbol"},{key:"pack",caption:"The product and its first impression.",alt:"Beams By Edo sock packaging with a yellow product label"},{key:"bag",caption:"Colour and pattern carry the identity beyond the product.",alt:"Dark shopping bag with yellow graphics and the BBE circular badge"}],
    scope:["Visual identity","Logo variations","Colour & typography","Graphic patterns","Packaging direction"],
  },
  {
    slug:"damsel-b-design",name:"Damsel B Design",sector:"Bespoke fashion",
    line:"Excellence, in every detail.",headline:"Not just made.\nMade for you.",
    intro:"Damsel B Design creates bespoke clothing for men and women. Its identity pairs the personal character of tailoring with a composed visual system, giving individual detail a place in everything from the mark to the packaging.",
    idea:"The craft is in the mark.",ideaBody:"Needle, thread, and button details give the symbol a direct connection to making clothes. A finely drawn wordmark balances that expressive detail. Circular accents and light grids extend the identity across stationery and packaging.",
    accent:"#C333CC",paper:"#F5F5DC",ink:"#29212C",
    type:"A tailored balance.",typeBody:"Kugile brings fine, distinctive forms to headings, with Nokio supporting the everyday copy. Purple and cream set the tone, while blue and darker neutrals give the system room to vary across applications.",
    colours:[{name:"Purple",hex:"#C333CC",ink:"#191219"},{name:"Cream",hex:"#F5F5DC",ink:"#29212C"},{name:"Blue",hex:"#3345CC",ink:"#FFFFFF"},{name:"Charcoal",hex:"#212121",ink:"#FFFFFF"}],
    images:[{key:"stationery",caption:"A considered impression, down to the paper.",alt:"Damsel B Design branded stationery on cream and grey paper"},{key:"cards",caption:"A compact expression of the whole identity.",alt:"Damsel B Design business cards with fine typography and purple curves"},{key:"campaign",caption:"The promise, expressed through personal style.",alt:"Fashion advertising mockup featuring a woman in red and the line Not Just Made Made For You"},{key:"campaign-two",caption:"One promise. Different expressions.",alt:"Damsel B Design fashion poster mockup featuring a second tailored outfit"}],
    scope:["Visual identity","Wordmark & symbol","Colour & typography","Graphic elements","Packaging & campaign direction"],
  },
  {
    slug:"beam-tech",name:"Beam Tech",sector:"Technology & repair",year:"2023",
    line:"A brighter outlook on fixing things.",headline:"Unfixable?\nThink again.",
    intro:"Beam Tech's promise is a solution to the unsolvable. The identity puts a confident, approachable face on device repair, with a distinctive symbol and a colour system that stays recognisable across everyday touchpoints.",
    idea:"A recognisable signal.",ideaBody:"A rounded vertical form, a dot, and a curved body give the Beam Tech symbol its character. The rounded shape becomes a recurring graphic element, connecting a small device icon to larger applications such as signage and vehicle graphics.",
    accent:"#2878F7",paper:"#EDF3FC",ink:"#142238",
    type:"Technical, with a human side.",typeBody:"Proxon brings a futuristic quality to display text. Gilroy provides the clean supporting voice. Beam Blue anchors the identity, with green accents bringing contrast to the predominantly blue, white, and black applications.",
    colours:[{name:"Beam Blue",hex:"#2878F7",ink:"#101A29"},{name:"Dot Green",hex:"#1AEA40",ink:"#142238"},{name:"Sleek Black",hex:"#000000",ink:"#FFFFFF"},{name:"Neutral White",hex:"#FFFFFF",ink:"#142238"}],
    images:[{key:"watches",caption:"Recognition at the smallest scale.",alt:"Beam Tech symbol applied to two smartwatch faces"},{key:"shirt",caption:"An identity the team can wear.",alt:"Blue Beam Tech branded shirt with green graphic accents"},{key:"stationery",caption:"The same visual language, across the essentials.",alt:"Collection of Beam Tech branded stationery and digital applications"},{key:"sign",caption:"A clear presence on the street.",alt:"Beam Tech exterior storefront signage mockup"}],
    scope:["Visual identity","Logo system","Colour & typography","Graphic language","Print & digital applications"],
  },
  {
    slug:"glaciers",name:"Glaciers",sector:"Consumer technology",
    line:"Cool tech. A clear identity.",headline:"Cool tech.\nHot deals.",
    intro:"Glaciers is a phone and gadget retailer in Ibadan, Nigeria, built around accessible prices and personalised service. Its identity gives that straightforward proposition a consistent presence, from a shopping bag to outdoor advertising.",
    idea:"Clarity, with a cool edge.",ideaBody:"A custom wordmark is the central identifier. Angular shapes and a repeating linear pattern build a wider visual language around it. Deep and bright blues give the brand a consistent signature across retail and communication materials.",
    accent:"#101782",paper:"#EDF0F5",ink:"#131A34",
    type:"Simple. Clear. Recognisable.",typeBody:"Red Hat supports the distinctive wordmark with a straightforward, readable voice. Two blues do most of the work, with white, black, and slate adding contrast for information and larger compositions.",
    colours:[{name:"Deep Blue",hex:"#101782",ink:"#FFFFFF"},{name:"Bright Blue",hex:"#0260BE",ink:"#FFFFFF"},{name:"Slate",hex:"#232F40",ink:"#FFFFFF"},{name:"White",hex:"#FFFFFF",ink:"#131A34"}],
    images:[{key:"cards",caption:"The identity at hand.",alt:"Blue and white Glaciers business card mockups"},{key:"sign",caption:"A quieter expression in a physical space.",alt:"Glaciers dimensional wordmark on an office wall"},{key:"campaign",caption:"Built to be seen in the everyday city.",alt:"Glaciers billboard mockup on a busy Nigerian street"},{key:"street",caption:"The same signature, another point of contact.",alt:"Glaciers roadside advertising mockup"}],
    scope:["Visual identity","Custom wordmark","Colour & typography","Shapes & patterns","Retail & advertising applications"],
  },
];

/** Gallery alt text for each brand's cover picture (also seeded into Sanity). */
const HERO_ALTS: Record<string, string> = {
  "our-market": "market entrance and signage",
  "beams-by-edo": "sportswear packaging",
  "damsel-b-design": "bespoke fashion packaging",
  "beam-tech": "vehicle livery",
  glaciers: "shopping bag",
};
export const brandHeroAlt = (b: Brand) => `${b.name} ${HERO_ALTS[b.slug] ?? "brand identity"} mockup`;

export const BRAND_DEFAULT_FACTS = { design: "Olamide Irojah", credit: "Lightening Growth Consulting", discipline: "Brand identity" };
