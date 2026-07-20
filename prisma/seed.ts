import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

const services = [
  {
    slug: "punesim-ne-germani",
    title: "Punësim në Gjermani",
    shortDescription:
      "Lidhje me punëdhënës të verifikuar në sektorë ku kërkohen profile si juaji.",
    icon: "Briefcase",
    description:
      "Ne ju ndihmojmë të gjeni punë të përshtatshme në Gjermani duke punuar me partnerë të besueshëm. Procesi është i strukturuar, transparent dhe i fokusuar te rezultati — jo premtime boshe.",
    benefits: JSON.stringify([
      "Akses në punëdhënës të verifikuar në Gjermani",
      "Përputhje e profilit tuaj me pozicionet e hapura",
      "Mbështetje gjatë negociatave fillestare",
      "Informim i qartë për kushtet e punës",
    ]),
    timeline: JSON.stringify([
      { title: "Vlerësim i profilit", duration: "1–3 ditë" },
      { title: "Përputhje me pozicionet", duration: "1–4 javë" },
      { title: "Intervista dhe oferta", duration: "Varësisht nga sektori" },
    ]),
    requirements: JSON.stringify([
      "Pasaportë e vlefshme",
      "Kualifikime ose eksperiencë relevante",
      "Gjuhë gjermane ose anglishte (sipas pozicionit)",
      "Dokumentacion i pastër dhe i verifikueshëm",
    ]),
    faqs: JSON.stringify([
      {
        q: "A garantoni punësim?",
        a: "Jo. Ne ofrojmë ndërmjetësim profesional dhe asistencë; vendimi final i punësimit i takon punëdhënësit.",
      },
    ]),
    order: 1,
  },
  {
    slug: "pergatitje-per-interviste",
    title: "Përgatitje për Intervistë",
    shortDescription:
      "Simulime, feedback dhe strategji për intervista me punëdhënës gjermanë.",
    icon: "MessageSquare",
    description:
      "Intervistat në Gjermani kanë standarde të qarta. Ne ju përgatisim me simulime, pyetje tipike dhe këshilla praktike që rrisin besimin tuaj para takimit.",
    benefits: JSON.stringify([
      "Simulim interviste sipas sektorit",
      "Feedback i detajuar mbi përgjigjet",
      "Këshilla për etiketën profesionale gjermane",
      "Përgatitje për intervista online dhe në zyrë",
    ]),
    timeline: JSON.stringify([
      { title: "Analizë e pozicionit", duration: "1 ditë" },
      { title: "Seanca përgatitore", duration: "1–2 seanca" },
    ]),
    requirements: JSON.stringify([
      "Përshkrim i pozicionit ose ftesë interviste",
      "CV e përditësuar",
    ]),
    faqs: JSON.stringify([]),
    order: 2,
  },
  {
    slug: "cv-sipas-standardeve-gjermane",
    title: "CV sipas Standardeve Gjermane",
    shortDescription:
      "Curriculum Vitae profesional në formatin që presin punëdhënësit gjermanë.",
    icon: "FileText",
    description:
      "Një CV e mirë hap dyert. Ne e strukturojmë profilin tuaj sipas pritshmërive gjermane: qartësi, kronologji, fokus te kompetencat dhe pa informacion të panevojshëm.",
    benefits: JSON.stringify([
      "Format profesional (Lebenslauf)",
      "Përkthim dhe adaptim terminologjik",
      "Optimizim për ATS dhe rekrutues",
      "Rishikim deri në versionin final",
    ]),
    timeline: JSON.stringify([
      { title: "Mbledhje e të dhënave", duration: "1–2 ditë" },
      { title: "Draft dhe korrigjime", duration: "2–5 ditë" },
    ]),
    requirements: JSON.stringify([
      "Histori e punës dhe arsimimit",
      "Certifikata dhe referenca (nëse disponohen)",
    ]),
    faqs: JSON.stringify([
      {
        q: "A përgatitni CV?",
        a: "Po, ofrojmë shërbim të dedikuar CV sipas standardeve gjermane.",
      },
    ]),
    order: 3,
  },
  {
    slug: "aplikime-te-synuara",
    title: "Aplikime të Synuara",
    shortDescription:
      "Aplikime të fokusuara te pozicionet që përputhen me profilin tuaj.",
    icon: "Target",
    description:
      "Në vend që të dërgoni aplikime të përgjithshme, ne ndihmojmë me aplikime të synuara — më pak zhurmë, më shumë mundësi reale.",
    benefits: JSON.stringify([
      "Seleksion i pozicioneve relevante",
      "Letër motivimi e personalizuar",
      "Ndjekje e statusit të aplikimeve",
    ]),
    timeline: JSON.stringify([
      { title: "Definim i strategjisë", duration: "2–3 ditë" },
      { title: "Dërgim aplikimesh", duration: "Varësisht nga tregu" },
    ]),
    requirements: JSON.stringify(["CV e përditësuar", "Preferenca gjeografike dhe sektori"]),
    faqs: JSON.stringify([]),
    order: 4,
  },
  {
    slug: "rishikim-kontrate",
    title: "Rishikim Kontrate",
    shortDescription:
      "Kuptoni kushtet e kontratës së punës para nënshkrimit.",
    icon: "Scale",
    description:
      "Kontrata gjermane mund të jenë të detajuara. Ne ju ndihmojmë të kuptoni pikat kryesore: pagën, orarin, provën, pushimet dhe detyrimet — që të vendosni me informacion të plotë.",
    benefits: JSON.stringify([
      "Shpjegim i klauzolave kryesore",
      "Identifikim i pikave që kërkojnë sqarim",
      "Këshilla për negociata të arsyeshme",
    ]),
    timeline: JSON.stringify([{ title: "Analizë kontrate", duration: "2–5 ditë pune" }]),
    requirements: JSON.stringify(["Draft ose version final i kontratës"]),
    faqs: JSON.stringify([
      {
        q: "A ndihmoni me kontratën?",
        a: "Po, ofrojmë rishikim dhe sqarim të kontratës së punës (jo zëvendësim i këshilltarit ligjor).",
      },
    ]),
    order: 5,
  },
  {
    slug: "procesimi-i-vizes",
    title: "Procesimi i Vizës",
    shortDescription:
      "Udhëzim hap pas hapi për vizë pune dhe dokumentacionin përkatës.",
    icon: "Stamp",
    description:
      "Procesi i vizës kërkon saktësi. Ne ju udhëheqim në përgatitjen e dosjes, takimet dhe afatet — duke respektuar kërkesat e autoriteteve gjermane dhe ambasadave.",
    benefits: JSON.stringify([
      "Checklist personalizuar dokumentesh",
      "Kontroll para dorëzimit",
      "Informim për afatet dhe hapët zyrtarë",
    ]),
    timeline: JSON.stringify([
      { title: "Përgatitje dosje", duration: "1–3 javë" },
      { title: "Procedura zyrtare", duration: "Varësisht nga ambasada" },
    ]),
    requirements: JSON.stringify([
      "Kontratë pune ose ofertë binding",
      "Pasaportë dhe forma zyrtare",
      "Sigurim shëndetësor dhe dëshmi financiare (sipas rastit)",
    ]),
    faqs: JSON.stringify([
      {
        q: "A garantoni vizën?",
        a: "Jo. Vendimi për vizën i takon autoriteteve kompetente; ne sigurojmë përgatitje profesionale të dosjes.",
      },
      {
        q: "A ndihmoni për vizë pune?",
        a: "Po, ofrojmë asistencë të plotë për procesin e vizës së punës.",
      },
    ]),
    order: 6,
  },
  {
    slug: "pergatitja-e-dokumenteve",
    title: "Përgatitja e Dokumenteve",
    shortDescription:
      "Organizim, përkthim dhe verifikim i dokumenteve për aplikim dhe punësim.",
    icon: "FolderOpen",
    description:
      "Dokumentet e gabuara ose të paplota vonesojnë procesin. Ne ju ndihmojmë të mblidhni, përktheni dhe strukturoni dosjen sipas kërkesave zyrtare.",
    benefits: JSON.stringify([
      "Listë e qartë e dokumenteve",
      "Koordinim përkthimesh të certifikuara",
      "Kontroll final para dorëzimit",
    ]),
    timeline: JSON.stringify([{ title: "Mbledhje dhe verifikim", duration: "1–4 javë" }]),
    requirements: JSON.stringify(["Lista e dokumenteve sipas llojit të vizës"]),
    faqs: JSON.stringify([
      {
        q: "Çfarë dokumentesh më duhen?",
        a: "Varet nga shtetësia dhe lloji i vizës; pas konsultimit ju dërgojmë checklist të personalizuar.",
      },
    ]),
    order: 7,
  },
  {
    slug: "leje-qendrimi",
    title: "Leje Qëndrimi",
    shortDescription:
      "Asistencë për leje qëndrimi (Aufenthaltstitel) pas mbërritjes në Gjermani.",
    icon: "Home",
    description:
      "Pas mbërritjes, hapat zyrtarë vazhdojnë. Ne ju orientojmë për termine, forma dhe afate që lidhen me lejen e qëndrimit dhe regjistrimin lokal.",
    benefits: JSON.stringify([
      "Udhëzime për Behörde dhe Termine",
      "Përgatitje dokumentesh për zyra lokale",
      "Mbështetje informuese pas mbërritjes",
    ]),
    timeline: JSON.stringify([
      { title: "Registrim dhe termine", duration: "Sipas qytetit" },
    ]),
    requirements: JSON.stringify(["Vizë ose leje hyrjeje", "Kontratë banimi", "Pasaportë"]),
    faqs: JSON.stringify([]),
    order: 8,
  },
  {
    slug: "ndjekja-e-aplikimit",
    title: "Ndjekja e Aplikimit",
    shortDescription:
      "Monitorim i statusit të aplikimeve për punë dhe vizë deri në përfundim.",
    icon: "Activity",
    description:
      "Mbetemi në kontakt gjatë procesit — ju informojmë për hapat e ardhshëm dhe çdo kërkesë shtesë nga punëdhënësi ose autoritetet.",
    benefits: JSON.stringify([
      "Komunikim i rregullt",
      "Kujtesë për afate",
      "Koordinim me palët e treta",
    ]),
    timeline: JSON.stringify([{ title: "Gjatë gjithë procesit", duration: "Deri në vendim final" }]),
    requirements: JSON.stringify(["Autorizim për ndjekje me palët përkatëse"]),
    faqs: JSON.stringify([]),
    order: 9,
  },
  {
    slug: "konsultime-individuale",
    title: "Konsultime Individuale",
    shortDescription:
      "Sesione one-on-one për planin tuaj personal të relokimit në Gjermani.",
    icon: "Users",
    description:
      "Çdo rast është unik. Në konsultim analizojmë situatën tuaj, opsionet realiste dhe hapat e parë — pa presion dhe me transparencë të plotë.",
    benefits: JSON.stringify([
      "Plan i personalizuar",
      "Përgjigje të drejtpërdrejta për pyetjet tuaja",
      "Kosto e qartë para fillimit",
    ]),
    timeline: JSON.stringify([{ title: "Seancë fillestare", duration: "45–60 minuta" }]),
    requirements: JSON.stringify(["Informacion bazë për profilin dhe qëllimin"]),
    faqs: JSON.stringify([
      {
        q: "Si rezervoj konsultim?",
        a: "Përmes formularit të kontaktit, telefonit, WhatsApp ose chatbot-it tonë «Rezervo».",
      },
      {
        q: "Sa kushton konsultimi?",
        a: "Tarifat komunikohen gjatë rezervimit; konsultimi fillestar ka çmim të qartë pa kosto të fshehura.",
      },
    ]),
    order: 10,
  },
];

async function main() {
  await prisma.appointment.deleteMany();
  await prisma.knowledgeEntry.deleteMany();
  await prisma.knowledgeDocument.deleteMany();
  await prisma.jobOpening.deleteMany();
  await prisma.processStep.deleteMany();
  await prisma.whyUsItem.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.service.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.adminUser.deleteMany();

  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "WestbalAdmin2026!",
    12,
  );

  await prisma.adminUser.create({
    data: {
      email: process.env.ADMIN_EMAIL || "admin@westbalconsulting.com",
      passwordHash,
    },
  });

  await prisma.siteSettings.create({
    data: {
      heroHeadline: "Relokim profesional në Gjermani, me proces të qartë dhe mbështetje reale.",
      heroSubtitle:
        "Westbal Consulting udhëheq shqiptarët drejt punësimit, vizës dhe lejes së qëndrimit — me transparencë, komunikim të shpejtë dhe partnerë të verifikuar në Gjermani.",
      heroImage: "/images/hero-berlin.png",
      aboutTitle: "Pse të na zgjidhni?",
      aboutBody:
        "Ne nuk shesim ëndrra — ofrojmë udhëzim profesional. Çdo hap është i shpjeguar: nga konsultimi fillestar deri te fillimi i punës në Gjermani. Komunikim i drejtpërdrejtë, proces i dokumentuar dhe asistencë personale gjatë gjithë rrugëtimit tuaj.",
      aboutImage:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      seoTitle: "Westbal Consulting | Punësim dhe Vizë në Gjermani",
      seoDescription:
        "Konsultim premium për shqiptarët që duan të punojnë dhe jetojnë në Gjermani. Punësim, vizë, dokumentacion dhe leje qëndrimi me ekip të specializuar.",
      ogImage: "/images/hero-berlin.png",
    },
  });

  for (const s of services) {
    await prisma.service.create({ data: s });
  }

  const faqs = [
    {
      question: "Sa zgjat procesi?",
      answer:
        "Kohëzgjatja varet nga sektori, dokumentacioni dhe kalendarët zyrtarë. Në konsultim ju japim afat realist sipas rastit tuaj — zakonisht nga disa javë deri në disa muaj.",
      order: 1,
    },
    {
      question: "Çfarë dokumentesh duhen?",
      answer:
        "Lista ndryshon sipas vizës dhe profilit. Tipikisht: pasaportë, kualifikime, CV, kontratë ose ofertë pune, sigurim dhe forma zyrtare. Pas konsultimit merrni checklist të personalizuar.",
      order: 2,
    },
    {
      question: "Sa kushton?",
      answer:
        "Tarifat varen nga shërbimet e zgjedhura. Çmimet komunikohen paraprakisht, pa kosto të fshehura. Konsultimi fillestar ka çmim të qartë.",
      order: 3,
    },
    {
      question: "A garantoni vizën?",
      answer:
        "Jo. Vendimi i vizës i takon autoriteteve kompetente. Ne sigurojmë përgatitje profesionale dhe të saktë të dosjes suaj.",
      order: 4,
    },
    {
      question: "A ndihmoni me kontratën?",
      answer:
        "Po — rishikojmë dhe shpjegojmë kushtet kryesore të kontratës së punës që të vendosni me informacion të plotë.",
      order: 5,
    },
    {
      question: "A mund të aplikoj pa eksperiencë?",
      answer:
        "Po, për disa sektorë ka pozicione fillestare ose trajnime. Vlerësimi bëhet në konsultim sipas kualifikimeve tuaja.",
      order: 6,
    },
    {
      question: "A mund të aplikoj nga Kosova apo Shqipëria?",
      answer:
        "Po. Ne punojmë me kandidatë nga Kosova, Shqipëria dhe diaspora, sipas kërkesave të vizës dhe punëdhënësit.",
      order: 7,
    },
  ];

  for (const f of faqs) {
    await prisma.fAQ.create({ data: f });
  }

  const testimonials = [
    {
      name: "Arben K.",
      country: "Kosovë → München",
      text: "Procesi ishte i qartë nga dita e parë. Mora punë në sektorin e logjistikës dhe ndihma me dokumentet na kursen muaj pune.",
      rating: 5,
      photo:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
      order: 1,
    },
    {
      name: "Elira M.",
      country: "Shqipëri → Berlin",
      text: "Westbal më përgatiti për intervistën dhe më ndihmoi me CV-në sipas standardit gjerman. Komunikimi ishte i shpejtë dhe profesional.",
      rating: 5,
      photo:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      order: 2,
    },
    {
      name: "Driton S.",
      country: "Kosovë → Hamburg",
      text: "Asistencë e vërtetë, jo premtime boshe. Ekipi na udhëhoqi deri te leja e qëndrimit pas mbërritjes.",
      rating: 5,
      photo:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
      order: 3,
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  const partners = [
    { name: "Nordwerk GmbH", logoUrl: "/partners/partner-1.svg", order: 1 },
    { name: "Rhein Logistics", logoUrl: "/partners/partner-2.svg", order: 2 },
    { name: "Alpen Care", logoUrl: "/partners/partner-3.svg", order: 3 },
    { name: "Berlin Tech Staff", logoUrl: "/partners/partner-4.svg", order: 4 },
    { name: "Hanover Industrie", logoUrl: "/partners/partner-5.svg", order: 5 },
    { name: "Munich Services", logoUrl: "/partners/partner-6.svg", order: 6 },
  ];

  for (const p of partners) {
    await prisma.partner.create({ data: p });
  }

  const whyUs = [
    {
      title: "Proces transparent",
      description: "Çdo hap dhe kosto shpjegohen paraprakisht — pa surpriza.",
      icon: "Eye",
      order: 1,
    },
    {
      title: "Punëdhënës të verifikuar",
      description: "Partnerë në Gjermani me profile të kontrolluara.",
      icon: "ShieldCheck",
      order: 2,
    },
    {
      title: "Asistencë personale",
      description: "Një kontakt i dedikuar gjatë gjithë rrugëtimit.",
      icon: "HeartHandshake",
      order: 3,
    },
    {
      title: "Mbështetje e vazhdueshme",
      description: "Para dhe pas mbërritjes në Gjermani.",
      icon: "LifeBuoy",
      order: 4,
    },
    {
      title: "Eksperiencë",
      description: "Vite pune me raste reale relokimi dhe vizash.",
      icon: "Award",
      order: 5,
    },
    {
      title: "Komunikim i shpejtë",
      description: "Përgjigje në telefon, email dhe WhatsApp.",
      icon: "Zap",
      order: 6,
    },
  ];

  for (const w of whyUs) {
    await prisma.whyUsItem.create({ data: w });
  }

  const steps = [
    {
      step: 1,
      title: "Konsultim",
      description: "Vlerësim i profilit dhe plan i qartë i hapave.",
    },
    {
      step: 2,
      title: "Përgatitja e Dokumenteve",
      description: "Checklist, përkthime dhe kontroll dosjeje.",
    },
    {
      step: 3,
      title: "Gjetja e Punës",
      description: "Përputhje me punëdhënës dhe intervista.",
    },
    {
      step: 4,
      title: "Aplikimi për Vizë",
      description: "Dosje e saktë dhe koordinim me autoritetet.",
    },
    {
      step: 5,
      title: "Leja e Qëndrimit",
      description: "Orientim për hapat pas mbërritjes.",
    },
    {
      step: 6,
      title: "Fillimi i Punës në Gjermani",
      description: "Mbështetje deri në integrimin fillestar.",
    },
  ];

  for (const st of steps) {
    await prisma.processStep.create({ data: st });
  }

  const knowledge = [
    {
      question: "Si funksionon procesi?",
      answer:
        "Fillon me konsultim, vazhdon me dokumentacion dhe punësim, pastaj vizë dhe leje qëndrimi. Secili hap ju shpjegohet paraprakisht.",
      keywords: "proces,hapa,rrugëtim",
    },
    {
      question: "Sa zgjat procesi?",
      answer:
        "Zakonisht disa javë deri në disa muaj, varësisht nga sektori dhe dokumentacioni. Afati realist jepet në konsultim.",
      keywords: "kohë,afat,sa zgjat",
    },
    {
      question: "Çfarë dokumentesh më duhen?",
      answer:
        "Pasaportë, kualifikime, CV dhe dokumente sipas llojit të vizës. Lista e plotë dërgohet pas konsultimit.",
      keywords: "dokumente,dokumentacion,checklist",
    },
    {
      question: "Si rezervoj konsultim?",
      answer:
        "Klikoni «Rezervo Konsultim», plotësoni formularin, na telefononi ose shkruani «Rezervo» në chatbot.",
      keywords: "rezervim,takim,konsultim,termin",
    },
    {
      question: "A ndihmoni për vizë pune?",
      answer: "Po, ofrojmë asistencë të plotë për përgatitjen dhe procesin e vizës së punës.",
      keywords: "vizë,pune,visa",
    },
    {
      question: "A ndihmoni me CV?",
      answer: "Po, përgatitim CV sipas standardeve gjermane (Lebenslauf).",
      keywords: "cv,lebenslauf,resume",
    },
    {
      question: "Ku ndodhet zyra?",
      answer: "Zyra jonë ndodhet në Prishtinë, Kosovë. Adresa dhe harta janë në seksionin Kontakt.",
      keywords: "adresë,zyra,vendndodhje",
    },
    {
      question: "Si mund t'ju kontaktoj?",
      answer:
        "Telefon, email, WhatsApp ose formulari i kontaktit në faqe. Të dhënat janë në fund të faqes dhe në chatbot.",
      keywords: "kontakt,telefon,email",
    },
    {
      question: "A mund të aplikoj nga Kosova?",
      answer: "Po, punojmë me kandidatë nga Kosova sipas kërkesave të vizës.",
      keywords: "kosovë,kosova",
    },
    {
      question: "A mund të aplikoj nga Shqipëria?",
      answer: "Po, punojmë me kandidatë nga Shqipëria.",
      keywords: "shqipëri,shqiperi",
    },
    {
      question: "A ndihmoni edhe pas mbërritjes në Gjermani?",
      answer:
        "Po, ofrojmë orientim për leje qëndrimi dhe hapat administrativë fillestare pas mbërritjes.",
      keywords: "pas mbërritjes,gjermani,mbërritje",
    },
    {
      question: "A garantoni punësim?",
      answer:
        "Jo. Ne ofrojmë ndërmjetësim dhe asistencë profesionale; vendimi i punësimit i takon punëdhënësit.",
      keywords: "garanti,punësim",
    },
    {
      question: "A garantoni vizën?",
      answer:
        "Jo. Vendimi për vizën i takon autoriteteve; ne përgatisim dosjen profesionalisht.",
      keywords: "garanti,vizë",
    },
    {
      question: "Sa kushton konsultimi?",
      answer:
        "Tarifat komunikohen gjatë rezervimit, me çmim të qartë për konsultimin fillestar pa kosto të fshehura.",
      keywords: "kosto,çmim,sa kushton",
    },
  ];

  for (const k of knowledge) {
    await prisma.knowledgeEntry.create({ data: k });
  }

  await prisma.jobOpening.create({
    data: {
      title: "Magazinier / Logjistikë",
      location: "Hamburg, Gjermani",
      description: "Pozicion me kontratë të plotë, mbështetje për relokim.",
      requirements: "Eksperiencë bazë, gjermanisht A2+, dokumentacion i rregullt.",
      published: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
