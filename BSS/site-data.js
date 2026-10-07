/* ==========================================================================
   site-data.js — Single source of truth for all editable content on the
   Baitush Sharaf Rover Scout Group website.
   Loaded by BOTH index.html (via render.js) and admin.html (via admin.js).

   Content layers (porer ta ager take override kore):
     1) defaultSiteContent()            — ei file er default
     2) site-content.json (server-e)    — admin theke "সাইটে প্রকাশ" diye banano file,
                                          jeta hosting folder e upload korle SOB visitor dekhe
     3) localStorage                    — shudhu je browser e admin save korechhe
   ========================================================================== */

const SITE_STORAGE_KEY = "bsrsg_site_content_v1";
const SITE_PUBLISHED_FILE = "site-content.json";

function defaultSiteContent() {
  return {
    /* ---------- Header: title, logo, slider ---------- */
    header: {
      titleBn: "বায়তুশ শরফ আদর্শ কামিল মাদ্রাসা রোভার স্কাউট গ্রুপ, চট্টগ্রাম",
      titleEn: "Baitush Sharaf Adarsha Kamil Madrasah Rover Scout Group, Chittagong",
      logo: "logo.jpg.jpg",
      sliderImages: [
        "bp.1.jpg", "bp.2.jpg", "bp.3.jpg", "bp.4.jpg",
        "bp.5.jpg", "bp.6.jpg", "bp.7.jpg", "bp.8.jpg"
      ]
    },

    /* ---------- Top navigation (simple / dropdown / mega, with nested has-submenu) ---------- */
    nav: [
      { type: "simple", bn: "হোম", en: "Home", link: "#" },

      {
        type: "dropdown", bn: "আমাদের সম্পর্কে", en: "About Us",
        children: [
          { bn: "সাধারণ তথ্য", en: "General Information", link: "a.html" },
          { bn: "সাংগঠনিক তথ্য", en: "Organizational Info", link: "Or.html" },
          { bn: "প্রশাসনিক তথ্য", en: "Administrative Info", link: "ad.html" }
        ]
      },

      {
        type: "mega", bn: "স্কাউটিং", en: "Scouting",
        columns: [
          {
            titleBn: "কাব স্কাউট", titleEn: "Cub Scout",
            items: [
              { bn: "কাব প্রোগ্রাম", en: "Cub Program", link: "https://scouts.gov.bd/pages/static-pages/6922dd1f933eb65569e13981" },
              { bn: "১) সদস্য", en: "1) Membership", link: "https://scouts.gov.bd/pages/files/6922d9d8933eb65569e008a3" },
              { bn: "২) তারা", en: "2) Tara", link: "#" },
              { bn: "২) চাঁদ", en: "2) Chand", link: "https://scouts.gov.bd/pages/files/6922d9ed933eb65569e0119f" },
              { bn: "৩) চাঁদ তারা", en: "3) Chad Tara", link: "#" },
              { bn: "৪) শাপলা কাব অ্যাওয়ার্ড", en: "4) Shapla Cub Award", link: "https://scouts.gov.bd/pages/files/6922dad2933eb65569e06cdf" }
            ]
          },
          {
            titleBn: "স্কাউট", titleEn: "Scout",
            items: [
              { bn: "স্কাউট প্রোগ্রাম", en: "Scout Program", link: "#" },
              { bn: "১) সদস্য", en: "1) Membership", link: "https://scouts.gov.bd/pages/files/6922dbc2933eb65569e0c54b" },
              { bn: "২) স্ট্যান্ডার্ড", en: "2) Standard", link: "https://scouts.gov.bd/pages/files/6922da58933eb65569e03da5" },
              { bn: "৩) প্রোগ্রেস", en: "3) Progress", link: "#" },
              { bn: "৪) সার্ভিস", en: "4) Service", link: "https://scouts.gov.bd/pages/files/6922dacc933eb65569e06b0b" },
              { bn: "৫) প্রেসিডেন্ট'স স্কাউট", en: "5) President's Scout", link: "https://scouts.gov.bd/pages/files/6922d9e5933eb65569e00e12" }
            ]
          },
          {
            titleBn: "রোভার স্কাউট", titleEn: "Rover Scout",
            items: [
              { bn: "রোভার প্রোগ্রাম", en: "Rover Program", link: "#" },
              { bn: "১) সদস্য", en: "1) Membership", link: "#" },
              { bn: "২) প্রশিক্ষণ", en: "2) Training", link: "#" },
              { bn: "৩) সেবা", en: "3) Service", link: "#" },
              { bn: "৪) পিআরএস", en: "4) PRS", link: "#" }
            ]
          },
          {
            titleBn: "এডাল্ট লিডার্স", titleEn: "Adult Leaders",
            subHeaderBn: "কোর্সসমূহ", subHeaderEn: "Courses",
            items: [
              { bn: "১. ওরিয়েন্টেশন", en: "1. Orientation", link: "#" },
              { bn: "২. বেসিক কোর্স", en: "2. Basic Course", link: "#" },
              { bn: "৩. এডভান্স কোর্স", en: "3. Advance Course", link: "#" },
              { bn: "৪. স্কিল কোর্স", en: "4. Skill Course", link: "#" },
              { bn: "৫. উডব্যাজ", en: "5. Woodbadge", link: "#" },
              { bn: "৬. সিএএলটি", en: "6. CALT", link: "#" },
              { bn: "৭. এএলটি", en: "7. ALT", link: "#" },
              { bn: "৮. সিএলটি", en: "8. CLT", link: "#" },
              { bn: "৯. এলটি", en: "9. LT", link: "#" }
            ]
          }
        ]
      },

      {
        type: "dropdown", bn: "সংবাদ ও মিডিয়া", en: "News & Media",
        children: [
          {
            bn: "মিডিয়া", en: "Media",
            children: [
              { bn: "Walk Talk Shoot", en: "Walk Talk Shoot", link: "https://www.facebook.com/profile.php?id=61593251926789" },
              { bn: "Baitush Sharaf News", en: "Baitush Sharaf News", link: "https://www.facebook.com/BaitushSharafNews" }
            ]
          },
          {
            bn: "ওয়েবসাইট", en: "Website",
            children: [
              { bn: "Baitush sharaf Adarsha Kamil Madrasah", en: "Baitush sharaf Adarsha Kamil Madrasah", link: "https://www.bsakm.edu.bd/" },
              { bn: "Baitush Sharaf", en: "Baitush Sharaf", link: "https://baitushsharaf.org/" }
            ]
          },
          { bn: "ছবি", en: "Photos", link: "#" },
          { bn: "ভিডিও", en: "Video", link: "#" }
        ]
      },

      {
        type: "dropdown", bn: "প্রকল্প", en: "Projects",
        children: [
          { bn: "এসডিজি প্রকল্প", en: "SDG Projects", link: "#" },
          { bn: "মেসেঞ্জার অব পিস (MoP)", en: "Messengers of Peace", link: "#" },
          { bn: "পরিবেশ ও বৃক্ষরোপণ", en: "Tree Plantation & Environment", link: "#" },
          { bn: "রক্তদান ও স্বাস্থ্যসেবা", en: "Blood Donation & Health", link: "#" },
          { bn: "দুর্যোগ ব্যবস্থাপনা ও ত্রাণ", en: "Disaster Relief Project", link: "#" },
          { bn: "ক্লিন ও গ্রীন প্রজেক্ট", en: "Clean & Green Project", link: "#" }
        ]
      },

      {
        type: "dropdown", bn: "আবেদন", en: "Apply",
        children: [
          { bn: "গ্রুপ আবেদন", en: "Apply BSRSG", link: "https://bsakamrsg-admission.netlify.app/" },
          { bn: "বিএসআইডি আবেদন", en: "Apply BSID", link: "https://service.scouts.gov.bd/registration" },
          { bn: "স্কাউট আইডি যাচাই", en: "Verification of Scout ID", link: "https://service.scouts.gov.bd/user-verify" }
        ]
      },

      {
        type: "dropdown", bn: "যোগাযোগ ও সেবা", en: "Contact & Service",
        children: [
          { bn: "01836446216", en: "01836446216", link: "#" },
          { bn: "baitushsharafroverscouts@gmail.com", en: "baitushsharafroverscouts@gmail.com", link: "#" },
          { bn: "বায়তুশ শরফ আদর্শ কামিল (অনার্স-মাস্টার্স) মাদ্রাসা রোভার স্কাউট গ্রুপ", en: "বায়তুশ শরফ আদর্শ কামিল (অনার্স-মাস্টার্স) মাদ্রাসা রোভার স্কাউট গ্রুপ", link: "https://www.facebook.com/profile.php?id=61587542846477" }
        ]
      }
    ],

    /* ---------- Event popup (homepage) & Event.html page content ----------
       `enabled` is the on/off switch controlled from the Admin Panel:
       when false, the homepage popup never opens and Event.html shows a
       "no event scheduled" message instead of the event details. */
    eventPopup: {
      enabled: false,
      titleBn: "বার্ষিক স্কাউট ক্যাম্পিং ২০২৬",
      titleEn: "Annual Scout Camping 2026",
      dateRangeBn: "১৫–১৭ অক্টোবর, ২০২৬",
      dateRangeEn: "Oct 15–17, 2026",
      locationBn: "কক্সবাজার সমুদ্র সৈকত",
      locationEn: "Cox's Bazar Sea Beach",
      regDeadlineBn: "নিবন্ধন শেষ: ১০ অক্টোবর",
      regDeadlineEn: "Registration closes: Oct 10",
      popupExcerptBn: "বাইতুশ শরফ রোভার স্কাউট গ্রুপের বার্ষিক ক্যাম্পিং অনুষ্ঠিত হতে যাচ্ছে। সকল সদস্যকে অংশগ্রহণের জন্য আন্তরিকভাবে আমন্ত্রণ জানানো যাচ্ছে। নিবন্ধনের শেষ তারিখ ১০ অক্টোবর।",
      popupExcerptEn: "The annual camping of Baitush Sharaf Rover Scout Group is coming up. All members are warmly invited to take part. Registration closes Oct 10.",
      introBn1: "বাইতুশ শরফ রোভার স্কাউট গ্রুপের বার্ষিক ক্যাম্পিং এই বছর অনুষ্ঠিত হচ্ছে কক্সবাজার সমুদ্র সৈকতে। তিন দিনব্যাপী এই আয়োজনে থাকবে দলগত কার্যক্রম, নেতৃত্ব প্রশিক্ষণ, পরিবেশ সচেতনতামূলক সেশন এবং সাংস্কৃতিক অনুষ্ঠান।",
      introEn1: "This year's annual camping of Baitush Sharaf Rover Scout Group will be held at Cox's Bazar Sea Beach. The three-day event will feature team activities, leadership training, environmental awareness sessions and cultural programs.",
      introBn2: "এসআরএম, এএসআরএম, আরএম এবং সাধারণ সকল রোভার সদস্যকে অংশগ্রহণের জন্য অনুরোধ করা হচ্ছে। প্রয়োজনীয় সরঞ্জাম ও নির্দেশনা নিবন্ধনের পর মেইল/হোয়াটসঅ্যাপ গ্রুপে জানিয়ে দেওয়া হবে।",
      introEn2: "All SRM, ASRM, RM and general rover members are requested to take part. Required gear and instructions will be shared via email/WhatsApp group after registration.",
      schedule: [
        { dayBn: "দিন ১", dayEn: "Day 1", titleBn: "যাত্রা ও ক্যাম্প স্থাপন", titleEn: "Departure & Camp Setup", descBn: "সকাল ৭টায় রওনা, বিকেলে ক্যাম্প স্থাপন ও পরিচিতি পর্ব।", descEn: "Departure at 7 AM, camp setup and introductions in the afternoon." },
        { dayBn: "দিন ২", dayEn: "Day 2", titleBn: "প্রশিক্ষণ ও কার্যক্রম", titleEn: "Training & Activities", descBn: "নেতৃত্ব বিষয়ক সেশন, দলগত গেমস, সন্ধ্যায় ক্যাম্পফায়ার।", descEn: "Leadership sessions, team games, campfire in the evening." },
        { dayBn: "দিন ৩", dayEn: "Day 3", titleBn: "সমাপনী ও প্রত্যাবর্তন", titleEn: "Closing & Return", descBn: "পরিবেশ পরিষ্কার কার্যক্রম, সার্টিফিকেট বিতরণ, দুপুরে ফেরার যাত্রা।", descEn: "Cleanup activity, certificate distribution, return journey at noon." }
      ],
      registerLinkUrl: "#",
      contactLeaderName: "",
      contactPhone: "",
      contactEmail: ""
    },

    /* ---------- Notice marquee ---------- */
    marquee: "বায়তুশ শরফ রোভার স্কাউট গ্রুপের নতুন সদস্য রেজিস্ট্রেশন কার্যক্রম শুরু হয়েছে। বিস্তারিত জানতে যোগাযোগ করুন।",

    /* ---------- PDF notice board ---------- */
    pdfNotices: [
      { titleBn: "বার্ষিক স্কাউট ক্যাম্পের নোটিশ ২০২৬", titleEn: "Annual Scout Camp Notice 2026", file: "notice1.pdf" },
      { titleBn: "বিএসআইডি (BSID) নবায়ন সংক্রান্ত নির্দেশিকা", titleEn: "BSID Renewal Guidelines", file: "notice2.pdf" },
      { titleBn: "রোভার স্কাউট প্রশিক্ষণ কর্মশালা মিটিং", titleEn: "Rover Scout Training Workshop Meeting", file: "notice3.pdf" }
    ],

    /* ---------- Photo gallery ---------- */
    gallery: [
      { img: "gp-1.jpg", captionBn: "হজ ক্যাম্প ২০২৬", captionEn: "Hajj Camp 2025" },
      { img: "gp-2.jpg", captionBn: "হজ ক্যাম্প ২০২৬", captionEn: "Hajj Camp 2025" },
      { img: "gp3.jpg", captionBn: "পুরস্কার গ্রহণ", captionEn: "Collecting The Prize" },
      { img: "gp14.jpg", captionBn: "উপস্থাপনা", captionEn: "Presentation" },
      { img: "gp4.jpg", captionBn: "আইসিটি কোর্স", captionEn: "ICT Course" },
      { img: "gp5.jpg", captionBn: "মীর মাহবুবুর রহমান স্নিগ্ধ", captionEn: "Mir Mahbubur Rahman Snigdho" },
      { img: "gp6.jpg", captionBn: "চট্টগ্রাম জেলা রোভার মুট", captionEn: "Chattogram District Rover Moot" },
      { img: "gp7.jpg", captionBn: "চট্টগ্রাম জেলা রোভার মুট", captionEn: "Chattogram District Rover Moot" },
      { img: "gp8.jpg", captionBn: "চট্টগ্রাম জেলা রোভার মুট", captionEn: "Chattogram District Rover Moot" },
      { img: "gp9.jpg", captionBn: "জুলাই দিবস উদযাপন", captionEn: "July Day celebration 2026" },
      { img: "gp10.jpg", captionBn: "বায়তুশ শরফ আদর্শ কামিল মাদ্রাসা রোভার স্কাউট গ্রুপ এবং বায়তুশ শরফ আদর্শ কামিল মাদ্রাসা স্কাউট ইউনিট , চট্টগ্রাম।", captionEn: "Baitush Sharaf Adarsha Kamil Madrasa Rover Scout Group and Baitush Sharaf Adarsha Kamil Madrasa Scout Unit, Chattogram." },
      { img: "gp11.jpg", captionBn: "", captionEn: "" },
      { img: "gp12.jpg", captionBn: "Guard of Honour", captionEn: "Guard of Honour" },
      { img: "gp13.jpg", captionBn: "পরিষ্কার ও পরিচ্ছন্ন", captionEn: "Clean and tidy" }
    ],

    /* ---------- 2x2 grid boxes ---------- */
    gridBoxes: {
      about: {
        icon: "fa-info-circle",
        titleBn: "আমাদের কথা", titleEn: "About Us",
        items: [
          { bn: "গ্রুপের ইতিহাস", en: "Group History", link: "history.html" },
          { bn: "লক্ষ্য ও উদ্দেশ্য", en: "Mission & Vision", link: "lokkho_oh_oddesso.html" },
          /* ফাইলের আসল নাম amader_orjon.html */
          { bn: "আমাদের অর্জন", en: "Our Achievements", link: "amader_orjon.html" },
          { bn: "নির্বাহী কমিটি", en: "Executive Committee", link: "crew-council.html" }
        ]
      },
      database: {
        icon: "fa-database",
        titleBn: "অনলাইন স্কাউট ডাটাবেজ", titleEn: "Online Scouts Database",
        items: [
          { bn: "সদস্য প্রোফাইল", en: "Member Profile", link: "members.html" },
          { bn: "ইউনিট রেজিস্ট্রি", en: "Unit Registry", link: "unit.html" },
          { bn: "গ্রুপ আবেদন", en: "Group Apply", link: "scout-admission-form.html" },
          { bn: "ইভেন্ট", en: "Event", link: "Event.html" }
        ]
      },
      events: {
        icon: "fa-flag",
        titleBn: "জাতীয় ইভেন্টসমূহ", titleEn: "National Events",
        items: [
          { bn: "জাতীয় রোভার মুট", en: "National Rover Moot", link: "https://scouts.gov.bd" },
          { bn: "জাতীয় কমডেকা", en: "National Jamboree", link: "#" },
          { bn: "স্কাউট সেবা সপ্তাহ", en: "Scout Service Week", link: "#" },
          { bn: "দুর্যোগ ব্যবস্থাপনা ক্যাম্প", en: "Disaster Management Camp", link: "#" }
        ]
      },
      rules: {
        icon: "fa-book",
        titleBn: "আইন, বিধি ও বই", titleEn: "Act/Rules/Policy & Books",
        items: [
          { bn: "স্কাউট আইন ও প্রতিজ্ঞা", en: "Scout Law & Promise", link: "scout.pro.html" },
          { bn: "গ্রুপ নীতিমালা", en: "Group Policy", link: "nitimala.html" },
          { bn: "রোভার হ্যান্ডবুক", en: "Rover Handbook", link: "#" },
          { bn: "প্রশিক্ষণ ম্যানুয়াল", en: "Training Manual", link: "trening_menual.html" }
        ]
      }
    },

    /* ---------- Sidebar profiles ---------- */
    profiles: {
      president: {
        titleBn: "গ্রুপ সভাপতি", titleEn: "Group President",
        nameBn: "আবু সালেহ মুহাম্মদ ছলীমুল্লাহ", nameEn: "Abu Saleh Muhammad Salimullah",
        roleBn: "সভাপতি, বায়তুশ শরফ আদর্শ কামিল (অনার্স-মাস্টার্স) মাদ্রাসা রোভার স্কাউট গ্রুপ, চট্টগ্রাম",
        roleEn: "President, Baitush Sharaf Adarsha Kamil (Honours-Masters) Madrasah Rover Scout Group, Chattogram",
        photo: "pr.jpg.png", mobile: "+৮৮০ ১৮১৯৬৩৬৭২২", email: "principal104395@gmail.com",
        blood: "O+", bsid: "ZL5150"
      },
      rsl: {
        titleBn: "রোভার স্কাউট লিডার", titleEn: "Rover Scout Leader",
        nameBn: "মোহাম্মদ সাইফুউদ্দিন", nameEn: "Mohammad Saifuddin",
        roleBn: "সম্পাদক ও স্কাউট লিডার", roleEn: "Secretary & Scout Leader",
        photo: "rsl.jpg", mobile: "+৮৮০ ১৮১৯৯৪৭৩৮৭", email: "saifuddinbaitushsharaf@gmail.com",
        blood: "O-", bsid: "AB4786"
      },
      srm: {
        titleBn: "সিনিয়র রোভার মেট", titleEn: "Senior Rover Mate",
        nameBn: "সাইফুল ইসলাম ইমন", nameEn: "Saiful Islam Emon",
        roleBn: "সিনিয়র রোভার মেট", roleEn: "Senior Rover Mate",
        photo: "srm.png", mobile: "+৮৮০ ১৮৩৬৪৪৬২১৬", email: "sislamemon5@gmail.com",
        blood: "B+", bsid: "ZD5517"
      },
      asrm: {
        titleBn: "সহকারী সিনিয়র রোভার মেট", titleEn: "Assistant Senior Rover Mate",
        nameBn: "নূর মোহাম্মদ নাঈম ভূঁইয়া", nameEn: "Nour Mohammed Nayem Bhuiyan",
        roleBn: "সহকারী সিনিয়র রোভার মেট", roleEn: "Assistant Senior Rover Mate",
        photo: "asrm.png", mobile: "+৮৮০ ১৮৩৩৮৪৬৮৯৫", email: "nayem@gmail.com",
        blood: "B+", bsid: "ZK0428"
      }
    },

    /* ---------- Event calendar ---------- */
    calendar: {
      monthYear: "সেপ্টেম্বর ২০২৬",
      events: [
        { date: "১০ সেপ:", text: "গ্রুপের সাপ্তাহিক মিটিং" },
        { date: "১৫ সেপ:", text: "রক্তদান কর্মসূচি" },
        { date: "২৫ সেপ:", text: "বার্ষিক স্কাউট ওটিটি" }
      ]
    },

    /* ---------- Address & Map ---------- */
    address: "Baitush Sharaf Complex, D.T. Road, Dhanialapara, Doublemooring, Chittagong, 4100.",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3690.1342676831035!2d91.8105!3d22.3486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDIwJzebNS4wIk4gOTHCsDQ4JzM3LjgiRQ!5e0!3m2!1sen!2sbd!4v1600000000000!5m2!1sen!2sbd",

    /* ---------- গুরুত্বপূর্ণ লিংক (Event-I কার্ড) ---------- */
    importantLinks: {
      titleBn: "ইভেন্ট-I", titleEn: "Event-I",
      headerBn: "গুরুত্বপূর্ণ", headerEn: "Important",
      items: [
        { bn: "Scouts For SDGS", en: "Scouts For SDGS", link: "https://sdgs.scout.org/" },
        { bn: "Messengers-Of-Peace", en: "Messengers-Of-Peace", link: "https://www.scout.org/messengers-of-peace" },
        { bn: "Safe From Harm-1", en: "Safe From Harm-1", link: "https://learn.scout.org/resource/sfh-1-safe-harm-essential-learnings" },
        { bn: "Safe From Harm-2", en: "Safe From Harm-2", link: "https://learn.scout.org/resource/sfh-2-safe-harm-advanced-learning-wosm-volunteer-and-staff" }
      ]
    },

    /* ---------- Footer ---------- */
    footer: {
      addressBn: "বায়তুশ শরফ কমপ্লেক্স, ডিটি রোড, ধনিয়ালাপাড়া, ডাবলমুরিং, চট্টগ্রাম, 4100।",
      tagline: "স্কাউটিংয়ের মাধ্যমে চরিত্র গঠন ও সমাজ সেবায় আমরা প্রতিশ্রুতিবদ্ধ।",
      taglineEn: "Committed to character building and social service through Scouting.",
      email: "baitushsharafroverscouts@gmail.com",
      phone: "01836446216",
      copyrightText: "© 2026 Baitush Sharaf Rover Scout Group. All Rights Reserved.",
      quickLinks: [
        { bn: "বায়তুশ শরফ আদর্শ কামিল মাদ্রাসা", en: "Baitush Sharaf Adarsha Kamil Madrasah", link: "https://www.bsakm.edu.bd/" },
        { bn: "বায়তুশ শরফ", en: "Baitush Sharaf", link: "https://baitushsharaf.org/" },
        { bn: "বাংলাদেশ স্কাউটস", en: "Bangladesh Scouts", link: "https://scouts.gov.bd/" },
        { bn: "বিশ্ব স্কাউট সংস্থা", en: "WOSM", link: "https://www.scout.org/" },
        { bn: "Scouts For SDGS", en: "Scouts For SDGS", link: "https://sdgs.scout.org/" },
        { bn: "Messengers-Of-Peace", en: "Messengers-Of-Peace", link: "https://www.scout.org/messengers-of-peace" },
        { bn: "Safe From Harm-1", en: "Safe From Harm-1", link: "https://learn.scout.org/resource/sfh-1-safe-harm-essential-learnings" },
        { bn: "Safe From Harm-2", en: "Safe From Harm-2", link: "https://learn.scout.org/resource/sfh-2-safe-harm-advanced-learning-wosm-volunteer-and-staff" },
        { bn: "গোপনীয়তা নীতি", en: "Privacy Policy", link: "#" }
      ],
      social: {
        facebook: "https://www.facebook.com/profile.php?id=61587542846477",
        instagram: "https://www.instagram.com/bsakmroverscout?igsi=MXR1YnBxYzFhMmQ1bw==",
        whatsapp: "#",
        linkedin: "#",
        youtube: "#",
        twitter: "#"
      }
    },

    /* ---------- Unit page (unit.html): registry cards + events log ---------- */
    unit: {
      pageTitleBn: "ইউনিট রেজিস্ট্রি ও ইভেন্ট",
      headerTitleBn: "বায়তুশ শরফ আদর্শ কামিল মাদ্রাসা রোভার স্কাউট গ্রুপ",
      nationalRegistry: {
        regNo: "২৬৫২",
        org: "বাংলাদেশ স্কাউটস",
        groupName: "বায়তুশ শরফ আদর্শ কামিল মাদ্রাসা রোভার স্কাউট গ্রুপ",
        status: "সক্রিয় (Active)"
      },
      districtRegistry: {
        regNo: "১০৯",
        districtRover: "চট্টগ্রাম জেলা রোভার",
        region: "রোভার অঞ্চল",
        location: "চট্টগ্রাম, বাংলাদেশ"
      },
      events: [
        { desc: "বার্ষিক তাঁবুবাস ও দীক্ষা ক্যাম্প ২০২৪", date: "২০২৪", place: "গ্রুপ প্রাঙ্গণ" },
        { desc: "চট্টগ্রাম বিভাগীয় কোর্স ফর রোভার মেট -২০২৪", date: "২০২৪", place: "চট্টগ্রাম বিভাগ" },
        { desc: "'তথ্য মেলা ২০২৫' ১ম স্থান: মুহাম্মদ আবু বকর (আলিম)", date: "১৫ ও ১৬ জানুয়ারি ২০২৫", place: "সনাক-টিআইবি, জেলা শিল্পকলা একাডেমি, চট্টগ্রাম" },
        { desc: "৭ম জাতীয় কমডেকা-তে তাঁবুকলা প্রতিযোগিতায় প্রথম স্থান অর্জন", date: "২০২৫", place: "৭ম জাতীয় কমডেকা" },
        { desc: "১ম স্পিরিচুয়াল ডেভেলপমেন্ট শীর্ষক ওয়ার্কশপ ২০২৫", date: "২০ মার্চ ২০২৫", place: "গ্রুপ প্রাঙ্গণ" },
        { desc: "হজ্ব ক্যাম্প ২০২৫", date: "২০২৫", place: "হজ্ব ক্যাম্প" },
        { desc: "সিনিয়র রোভার মেট ওয়ার্কশপ", date: "৩০-৩১ মে, ২০২৫", place: "প্রাইমারি টিচার্স ট্রেনিং ইন্সটিটিউট, কক্সবাজার" },
        { desc: "বিশ্ব পরিবেশ দিবস ২০২৫", date: "২৫ জুন ২০২৫ (বুধবার)", place: "জেলা শিল্পকলা একাডেমি, চট্টগ্রাম" },
        { desc: "লগবই প্রস্তুতকরণ ও পিআরএস অ্যাওয়ার্ড অর্জনের কৌশল নির্ধারণ ওয়ার্কশপ", date: "২০২৫", place: "বাংলাদেশ স্কাউটস, চট্টগ্রাম জেলা রোভার" },
        { desc: "জুলাইয়ের গান, চলচ্চিত্র প্রদর্শনী ও বিশেষ ড্রোন শো (দ্বিতীয় পর্ব)", date: "১৬ জুলাই ২০২৫", place: "চট্টগ্রাম জেলা স্টেডিয়াম" },
        { desc: "জুলাই স্মরণে প্রতীকী ম্যারাথন ও নির্ধারিত বক্তৃতা প্রতিযোগিতায় ১ম: সাইফুল ইসলাম", date: "২৬ জুলাই ২০২৫", place: "জেলা প্রশাসন ও চট্টগ্রাম জেলা রোভার" },
        { desc: "চট্টগ্রাম বিভাগ ২৪ এর রঙে গ্রাফিতি ও চিত্রাংকন প্রতিযোগিতা ২০২৫", date: "২০২৫", place: "চট্টগ্রাম বিভাগ" },
        { desc: "আইসিটি দক্ষতা অর্জন কোর্স", date: "২৯ আগস্ট, ২০২৫", place: "সরকারি সিটি কলেজ, চট্টগ্রাম" },
        { desc: "৩২তম ও ৩৩তম কোর্স ফর রোভার মেট ২০২৫", date: "১-৪ মে ২০২৫", place: "চট্টগ্রাম জেলা রোভার" },
        { desc: "৪১তম পবিত্র মিলাদুন্নবী উদযাপন উপলক্ষে তামাদ্দুনিক প্রতিযোগিতা ও সাংস্কৃতিক অনুষ্ঠান", date: "২০২৫", place: "বায়তুশ শরফ" },
        { desc: "চট্টগ্রাম বিভাগীয় সিনিয়র রোভার মেট ও সমাজ উন্নয়ন অ্যাওয়ার্ড ওয়ার্কশপ", date: "২৭/০৯/২০২৫", place: "রাঙ্গামাটি পার্বত্য জেলা রোভার" },
        { desc: "68th JOTA-JOTI 29th", date: "১৭-১৯ অক্টোবর ২০২৫", place: "অনলাইন/রেডিও" },
        { desc: "চট্টগ্রাম বিভাগীয় কোর্স ফর রোভার মেট -২০২৫", date: "২৪-২৭ অক্টোবর ২০২৫", place: "চট্টগ্রাম বিভাগ" },
        { desc: "৫২৭ তম স্কাউট ইউনিট লিডার বেসিক কোর্স", date: "০৭-১১ অক্টোবর ২০২৫", place: "জাতীয় স্কাউট প্রশিক্ষণ কেন্দ্র, মৌচাক, গাজীপুর" },
        { desc: "টাইফয়েড টিকা ক্যাম্পেইন ২০২৫", date: "৮ই নভেম্বর ২০২৫", place: "মাদ্রাসা প্রাঙ্গণ" },
        { desc: "১৯ তম চট্টগ্রাম জেলা রোভার মুট ২০২৫", date: "২০-২৪ ডিসেম্বর ২০২৫", place: "চট্টগ্রাম বিশ্ববিদ্যালয়" },
        { desc: "জাতীয় শিক্ষা সপ্তাহ-২০২৬: বিভাগীয় পর্যায়ে শ্রেষ্ঠ রোভার গ্রুপ নির্বাচন", date: "২০২৬", place: "চট্টগ্রাম বিভাগ (১১টি জেলা)" },
        { desc: "প্রতিভা অন্বেষণ ২০২৬", date: "১৭ই জানুয়ারি ২০২৬", place: "গ্রুপ প্রাঙ্গণ" },
        { desc: "ওরিয়েন্টেশন প্রোগ্রাম-২০২৬", date: "১/২/২০২৬", place: "গ্রুপ প্রাঙ্গণ" },
        { desc: "বিভাগীয় প্রতিভা অন্বেষণ প্রতিযোগিতা ও ৭টি ক্রু-মিটিং", date: "৭/২/২০২৬ (মিটিং: ৫-২৫ ফেব)", place: "বিভাগীয় রোভার" },
        { desc: "২য় স্পিরিচুয়াল ডেভেলপমেন্ট ওয়ার্কশপ ও পথচারীদের মাঝে ইফতার বিতরণ", date: "২ ও ৬ মার্চ ২০২৬", place: "দেওয়ানহাট মোড় (বায়তুশ শরফ আনজুমনে নওজোয়ান)" },
        { desc: "নিয়মিত প্যাক, ট্রুপ ও ক্রু মিটিং পরিচালনাকারী ইউনিট লিডার পুরস্কার (মোহাম্মদ সাইফুদ্দিন)", date: "০৮ মার্চ ২০২৬", place: "বাংলাদেশ স্কাউটস" },
        { desc: "মহান স্বাধীনতা ও জাতীয় দিবস ২০২৬", date: "২৬/৩/২০২৬", place: "মাদ্রাসা ও জেলা প্রশাসন" },
        { desc: "১৯তম রোভার অ্যাডভেঞ্চার ক্যাম্প ২০২৬", date: "২০২৬", place: "অ্যাডভেঞ্চার ক্যাম্প সাইট" },
        { desc: "বাংলা নববর্ষ ১৪৩৩-২০২৬ উদযাপন", date: "১৪/৪/২০২৬", place: "গ্রুপ প্রাঙ্গণ" },
        { desc: "বিভাগীয় পর্যায়ের কেরাতে ১ম স্থান অর্জনকারী: রোভার তাহমিদুল হাসান", date: "২০২৬", place: "চট্টগ্রাম বিভাগ" },
        { desc: "আঞ্চলিক ইয়ুথ ফোরাম ২০২৬", date: "১৫-১৬ মে, ২০২৬", place: "বাহাদুরপুর রোভার স্কাউট প্রশিক্ষণ কেন্দ্র, গাজীপুর" },
        { desc: "সুবর্ণজয়ন্তী রোভার মুট ডিসপ্লে পারফর্মার ও জেলা রোভার মুট স্বেচ্ছাসেবক সংবর্ধনা", date: "২২শে মে ২০২৬", place: "চট্টগ্রাম জেলা রোভার" },
        { desc: "জাতীয় বিজ্ঞান মেলায় অংশগ্রহণ -২০২৬", date: "৭-৮ জুন ২০২৬", place: "বিজ্ঞান ও প্রযুক্তি মন্ত্রণালয়" },
        { desc: "সেইফ ফ্রম হার্ম (Safe from Harm) সার্টিফিকেশন কোর্স", date: "১৯ জুন, ২০২৬", place: "সরকারি হাজী মুহাম্মদ মহসিন কলেজ, চট্টগ্রাম" },
        { desc: "বায়তুশ শরফ আদর্শ কামিল মাদরাসা রোভার স্কাউট গ্রুপের ৫ম দীক্ষা অনুষ্ঠান", date: "২০/৬/২০২৬", place: "মাদ্রাসা প্রাঙ্গণ" },
        { desc: "আরবি বিশ্ববিদ্যালয়ের প্রো-ভিসির আগমন উপলক্ষে গার্ড অফ অনার প্রদান", date: "১২ জুলাই ২০২৬", place: "মাদ্রাসা প্রাঙ্গণ" },
        { desc: "চট্টগ্রামের বাঁশখালীতে ত্রাণ সামগ্রী বিতরণ ২০২৬", date: "১৩ই জুলাই ২০২৬", place: "বাঁশখালী, চট্টগ্রাম" },
        { desc: "জুলাই শহীদ দিবস উদযাপন ২০২৬", date: "১৬ জুলাই ২০২৬", place: "চট্টগ্রাম" },
        { desc: "জেলা প্রশাসক কর্তৃক আয়োজিত পরিচ্ছন্নতা অভিযান", date: "২৬শে জুলাই ২০২৬", place: "জেলা প্রশাসন, চট্টগ্রাম" },
        { desc: "মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড চট্টগ্রাম অঞ্চলের পরিচালকের বিদায় সংবর্ধনা", date: "২০২৬", place: "শিক্ষা বোর্ড, চট্টগ্রাম" },
        { desc: "ঈদে মিলাদুন্নাবী (সা.) উপলক্ষে তামাদ্দুনিক প্রতিযোগিতা ও সাংস্কৃতিক অনুষ্ঠানে অংশগ্রহণ", date: "২০২৬", place: "বায়তুশ শরফ আনজুমনে ইত্তেহাদ বাংলাদেশ ট্রাস্ট" }
      ]
    },

    /* ---------- Achievements page (amader_orjon.html) ----------
       নতুন অর্জন সবার উপরে বসান; ক্রমিক নম্বর পেজ নিজে বসায়। */
    achievements: {
      pageHeadingBn: "আমাদের সাফল্য ও অর্জনসমূহ",
      pageSubBn: "সেবা, শৃঙ্খলা ও দক্ষতার গৌরবময় ইতিহাস",
      sectionTitleBn: "গ্রুপের অর্জনের তালিকা",
      sectionIntroBn: "প্রতিষ্ঠালগ্ন থেকে বাংলাদেশ স্কাউটস ও জাতীয় পর্যায়ে আমাদের গ্রুপের সাফল্য এবং রোভারদের অর্জিত সম্মাননাসমূহ নিচে তুলে ধরা হলো:",
      items: [
        { year: "০৮ মার্চ ২০২৬ খ্রি", title: "নিয়মিত প্যাক, ট্রুপ ও ক্রু মিটিং পরিচালনাকারী ইউনিট লিডারের পুরস্কার", level: "জাতীয় পর্যায়", details: "রোভার স্কাউট লিডার মোহাম্মদ সাইফুদ্দিন" },
        { year: "২০২৬", title: "জাতীয় প্রতিভা অন্বেষণ ২০২৬", level: "বিভাগীয় পর্যায়ের কেরাতে ১ম স্থান অর্জন", details: "রোভার তাহমিদুল হাসান, চট্টগ্রাম বিভাগ, চট্টগ্রাম জেলা রোভার, আয়োজক: রোভার অঞ্চল" },
        { year: "২০২৬", title: "জাতীয় শিক্ষা সপ্তাহ-২০২৬", level: "বিভাগীয় পর্যায়ে শ্রেষ্ঠ রোভার গ্রুপ নির্বাচন", details: "চট্টগ্রাম বিভাগ (১১টি জেলা)" },
        { year: "২০২৫", title: "জুলাই স্মরণে নির্ধারিত বক্তৃতা প্রতিযোগিতায়", level: "প্রথম স্থান অর্জন", details: "সাইফুল ইসলাম, আয়োজক: চট্টগ্রাম জেলা রোভার" },
        { year: "২০২৫", title: "৭ম জাতীয় কমডেকা-তে তাঁবুকলা প্রতিযোগিতায়", level: "জাতীয় পর্যায়, প্রথম স্থান অর্জন", details: "৭ম জাতীয় কমডেকা" },
        { year: "১৫ ও ১৬ জানুয়ারি ২০২৫", title: "তথ্য মেলা ২০২৫", level: "১ম স্থান", details: "মুহাম্মদ আবু বকর, সনাক-টিআইবি, জেলা শিল্পকলা একাডেমি, চট্টগ্রাম" }
      ]
    },

    /* ---------- Members page (সদস্য প্রোফাইল) ---------- */
    members: {
      pageHeadingBn: "সকল সদস্যের প্রোফাইল ও তালিকা",
      pageSubBn: "সেবা, শৃঙ্খলা ও দক্ষতার গৌরবময় পথচলা",
      groupNameBn: "বায়তুশ শরফ রোভার স্কাউট গ্রুপ",
      srm: [
        { name: "Saiful Islam", cls: "Honors 1st", roll: "-", mobile: "01835666438", date: "01-09-2024" }
      ],
      asrm: [
        { name: "Nur Muhammad Nayem", cls: "Alim 2nd", roll: "-", mobile: "880", date: "01-09-25" }
      ],
      rm: [
        { name: "abu bokkor", cls: "-", roll: "-", mobile: "-", date: "-" }
      ],
      rover: []
    },

    /* ---------- Executive Committee page (crew-council.html) ---------- */
    executiveCommittee: {
      crewCouncil: [
        { photo: "", avatar: "RM", name: "", roleBn: "সভাপতি", roleEn: "President", bsid: "", joinDate: "" },
        { photo: "", avatar: "VP", name: "", roleBn: "সহ-সভাপতি", roleEn: "Vice President", bsid: "", joinDate: "" },
        { photo: "", avatar: "GS", name: "", roleBn: "সাধারণ সম্পাদক", roleEn: "General Secretary", bsid: "", joinDate: "" },
        { photo: "", avatar: "JS", name: "", roleBn: "যুগ্ম সাধারণ সম্পাদক", roleEn: "Joint Secretary", bsid: "", joinDate: "" },
        { photo: "", avatar: "TR", name: "", roleBn: "কোষাধ্যক্ষ", roleEn: "Treasurer", bsid: "", joinDate: "" },
        { photo: "", avatar: "OS", name: "", roleBn: "সাংগঠনিক সম্পাদক", roleEn: "Organizing Secretary", bsid: "", joinDate: "" },
        { photo: "", avatar: "EM", name: "", roleBn: "কার্যনির্বাহী সদস্য", roleEn: "Executive Member", bsid: "", joinDate: "" }
      ],
      rover: {
        salamBn: "আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহি ওয়াবারকাতুহু",
        salamEn: "Assalamu Alaikum Wa Rahmatullahi Wa Barakatuh",
        orgNameBn: "বায়তুশ শরফ আদর্শ কামিল মাদ্রাসা রোভার স্কাউট গ্রুপ",
        orgNameEn: "Baitush Sharaf Adarsha Kamil Madrasah Rover Scout Group",
        councilNameBn: "ক্রু কাউন্সিল",
        councilNameEn: "Crew Council",
        members: [
          { photo: "", avatar: "নূ", name: "নূর মোহাম্মদ নাঈম", roleBn: "সভাপতি", roleEn: "President", bsid: "", joinDate: "" },
          { photo: "", avatar: "আ", name: "আরশাদ উল্লাহ", roleBn: "সহ-সভাপতি", roleEn: "Vice President", bsid: "", joinDate: "" },
          { photo: "", avatar: "ম", name: "মোঃ মহিবুল্লাহ", roleBn: "সাধারণ সম্পাদক ও যোগাযোগ সম্পাদক", roleEn: "General Secretary & Communication Secretary", bsid: "", joinDate: "" },
          { photo: "", avatar: "আ", name: "আমিমুল এহসান চৌধুরী", roleBn: "যুগ্ম সাধারণ সম্পাদক", roleEn: "Joint General Secretary", bsid: "", joinDate: "" },
          { photo: "", avatar: "ফ", name: "মোঃ ফাহাদ", roleBn: "মিডিয়া সম্পাদক", roleEn: "Media Secretary", bsid: "", joinDate: "" },
          { photo: "", avatar: "হা", name: "হাফেজ মোঃ হাসিবুর রহমান তানিম", roleBn: "সাংস্কৃতিক সম্পাদক", roleEn: "Cultural Secretary", bsid: "", joinDate: "" },
          { photo: "", avatar: "আ", name: "আবির আল মাহমুদ", roleBn: "অফিস সম্পাদক", roleEn: "Office Secretary", bsid: "", joinDate: "" },
          { photo: "", avatar: "আ", name: "আনিসুর রহমান", roleBn: "ট্রেনিং সম্পাদক", roleEn: "Training Secretary", bsid: "", joinDate: "" },
          { photo: "", avatar: "শু", name: "হাফেজ মোঃ শুয়াইব", roleBn: "প্রচার সম্পাদক", roleEn: "Publicity Secretary", bsid: "", joinDate: "" },
          { photo: "", avatar: "আ", name: "আব্দুর রহিম তামিম", roleBn: "বহিঃযোগাযোগ সম্পাদক", roleEn: "External Communication Secretary", bsid: "", joinDate: "" },
          { photo: "", avatar: "সা", name: "সাইফুর রহমান", roleBn: "স্বাস্থ্য সম্পাদক", roleEn: "Health Secretary", bsid: "", joinDate: "" },
          { photo: "", avatar: "হা", name: "হাবিবুর রহমান হামজা", roleBn: "অর্থ সম্পাদক", roleEn: "Finance Secretary", bsid: "", joinDate: "" },
          { photo: "", avatar: "ন", name: "নঈম উদ্দিন", roleBn: "সমাজ সেবা সম্পাদক", roleEn: "Social Service Secretary", bsid: "", joinDate: "" },
          { photo: "", avatar: "কা", name: "কামরুল ইসলাম ফাহিম", roleBn: "ক্রীড়া সম্পাদক", roleEn: "Sports Secretary", bsid: "", joinDate: "" },
          { photo: "", avatar: "ই", name: "ইরফানুল হক তামিম", roleBn: "তথ্য ও প্রযুক্তি সম্পাদক", roleEn: "IT Secretary", bsid: "", joinDate: "" },
          { photo: "", avatar: "মে", name: "মেহেদী হাসান", roleBn: "মানবাধিকার ও সচেতনতা সম্পাদক", roleEn: "Human Rights & Awareness Secretary", bsid: "", joinDate: "" },
          { photo: "", avatar: "মো", name: "মোহাম্মদ অলিউল্লাহ সামি", roleBn: "পরিবেশ ও জলবায়ু সম্পাদক", roleEn: "Environment & Climate Secretary", bsid: "", joinDate: "" },
          { photo: "", avatar: "মা", name: "মাহমুদুল হাসান", roleBn: "উদ্যোক্তা ও ক্যারিয়ার সম্পাদক", roleEn: "Entrepreneurship & Career Secretary", bsid: "", joinDate: "" }
        ]
      }
    }
  };
}

/* ---------- site-content.json (published file) reader ----------
   Sync XHR use kora hoyeche jate unit.html / members.html ityadi onno page-er
   kono bodol chhara-i (shudhu site-data.js load kore) published content pay.
   File na thakle (404) ba file:// theke khulle chupchap default-e fere. */
let _publishedCache;
function loadPublishedContent() {
  if (_publishedCache !== undefined) return _publishedCache;
  _publishedCache = null;
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", SITE_PUBLISHED_FILE + "?v=" + Date.now(), false);
    xhr.overrideMimeType("application/json");
    xhr.send(null);
    if ((xhr.status === 200 || xhr.status === 0) && xhr.responseText) {
      const data = JSON.parse(xhr.responseText);
      if (data && typeof data === "object") _publishedCache = data;
    }
  } catch (e) { /* file nei / offline: default use hobe */ }
  return _publishedCache;
}

function mergeContent(base, extra) {
  if (!extra) return base;
  const merged = Object.assign({}, base, extra);
  // eventPopup nested object, tai alada merge
  merged.eventPopup = Object.assign({}, base.eventPopup, extra.eventPopup || {});
  return merged;
}

function loadSiteContent() {
  let content = defaultSiteContent();
  content = mergeContent(content, loadPublishedContent());
  try {
    const raw = localStorage.getItem(SITE_STORAGE_KEY);
    if (raw) content = mergeContent(content, JSON.parse(raw));
  } catch (e) {
    console.warn("site-data: could not read saved content, using defaults", e);
  }
  return content;
}

function saveSiteContent(content) {
  localStorage.setItem(SITE_STORAGE_KEY, JSON.stringify(content));
}

function resetSiteContent() {
  localStorage.removeItem(SITE_STORAGE_KEY);
}