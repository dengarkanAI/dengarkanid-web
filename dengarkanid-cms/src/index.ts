import type { Core } from '@strapi/strapi';

const data = [
    {l:'A',t:'Alert / Notifikasi',e:'Alert',c:'listening',d:'Pemberitahuan otomatis yang dikirimkan saat platform mendeteksi penyebutan merek, kata kunci, atau topik tertentu di berbagai saluran digital. Memungkinkan tim merespons dengan cepat.',r:['Mention','Keyword Tracking','Real-Time Monitoring']},
    {l:'A',t:'Analisis Kompetitif',e:'Competitive Analysis',c:'strategy',d:'Proses membandingkan performa, penyebutan, dan persepsi merek Anda dengan kompetitor di media sosial dan kanal digital lainnya untuk menemukan peluang dan ancaman.',r:['Share of Voice','Benchmarking','Brand Intelligence']},
    {l:'A',t:'Analisis Sentimen',e:'Sentiment Analysis',c:'sentiment',d:'Teknik AI/NLP yang mengklasifikasikan teks (komentar, ulasan, posting) menjadi kategori positif, negatif, atau netral untuk memahami opini publik terhadap merek.',r:['NLP','Tone of Voice','Brand Sentiment']},
    {l:'A',t:'API (Application Programming Interface)',e:'API',c:'analytics',d:'Antarmuka yang memungkinkan platform listening tools mengambil data langsung dari platform media sosial seperti Twitter/X, Instagram, dan Facebook untuk dianalisis.',r:['Data Feed','Real-Time Monitoring']},
    {l:'A',t:'Audiens',e:'Audience',c:'social',d:'Kelompok pengguna yang berinteraksi dengan atau mengikuti akun media sosial atau konten suatu merek. Analisis audiens membantu memahami demografi dan perilaku pelanggan.',r:['Segmentasi','Reach','Engagement']},
    {l:'B',t:'Benchmarking',e:'Benchmarking',c:'strategy',d:'Proses menetapkan tolok ukur performa berdasarkan data historis atau data industri untuk mengevaluasi apakah strategi media sosial berjalan lebih baik atau lebih buruk dari ekspektasi.',r:['KPI','Share of Voice','Analisis Kompetitif']},
    {l:'B',t:'Brand Ambassador',e:'Brand Ambassador',c:'strategy',d:'Individu yang secara konsisten merepresentasikan dan mempromosikan merek, baik secara formal (kontrak) maupun organik, melalui konten dan percakapan digital mereka.',r:['Influencer','User Generated Content']},
    {l:'B',t:'Brand Intelligence',e:'Brand Intelligence',c:'listening',d:'Kumpulan data dan wawasan yang dikumpulkan tentang persepsi publik terhadap merek, yang digunakan untuk pengambilan keputusan strategis berbasis data.',r:['Analisis Kompetitif','Analisis Sentimen','Social Listening']},
    {l:'B',t:'Brand Monitoring',e:'Brand Monitoring',c:'listening',d:'Proses berkelanjutan memantau penyebutan merek di semua kanal digital — media sosial, forum, berita, blog — untuk memahami bagaimana publik membicarakan merek Anda.',r:['Social Listening','Mention','Alert']},
    {l:'B',t:'Brand Sentiment',e:'Brand Sentiment',c:'sentiment',d:'Gambaran keseluruhan perasaan atau opini publik terhadap suatu merek, diukur dari analisis sentimen pada semua penyebutan merek di berbagai platform digital.',r:['Analisis Sentimen','Net Promoter Score','Online Reputation']},
    {l:'B',t:'Buzz',e:'Buzz',c:'social',d:'Jumlah dan volume percakapan yang sedang berlangsung di media sosial dan internet tentang merek, produk, kampanye, atau topik tertentu dalam periode waktu tertentu.',r:['Volume Mention','Tren Topik','Viral Content']},
    {l:'C',t:'Channel',e:'Channel',c:'social',d:'Platform atau medium tempat konten dan percakapan terjadi, seperti Instagram, X (Twitter), TikTok, LinkedIn, YouTube, forum, atau berita online.',r:['Feed Sosial','API']},
    {l:'C',t:'Conversation Analytics',e:'Conversation Analytics',c:'analytics',d:'Analisis mendalam terhadap percakapan yang terjadi di media sosial untuk menemukan pola, tren, dan topik yang paling relevan dengan merek atau industri.',r:['Social Listening','Tren Topik']},
    {l:'C',t:'Crisis Management',e:'Crisis Management',c:'strategy',d:'Strategi dan tindakan yang dilakukan untuk mengidentifikasi, merespons, dan memitigasi krisis reputasi merek yang muncul di media sosial atau media online lainnya secara cepat.',r:['Alert','Brand Monitoring','Online Reputation']},
    {l:'C',t:'Customer Experience (CX)',e:'Customer Experience',c:'strategy',d:'Keseluruhan persepsi dan perasaan pelanggan terhadap merek berdasarkan semua interaksi yang mereka miliki, dari pra-pembelian hingga layanan purna jual.',r:['Net Promoter Score','Voice of Customer','Brand Sentiment']},
    {l:'D',t:'Dashboard',e:'Dashboard',c:'analytics',d:'Tampilan visual terpusat yang menampilkan metrik, grafik, dan data penting secara real-time, memungkinkan pengguna memantau performa merek dengan mudah dalam satu layar.',r:['KPI','Data Visualisasi','Reporting']},
    {l:'D',t:'Data Visualisasi',e:'Data Visualization',c:'analytics',d:'Representasi grafis dari data — berupa grafik, diagram, word cloud, atau peta — untuk memudahkan pemahaman tren, pola, dan anomali dalam data listening.',r:['Dashboard','Reporting','Insight']},
    {l:'D',t:'Deep Listening',e:'Deep Listening',c:'listening',d:'Pendekatan social listening yang lebih mendalam, melampaui penghitungan mention, untuk memahami konteks, emosi, dan motivasi di balik percakapan konsumen.',r:['Social Listening','Analisis Sentimen','Conversation Analytics']},
    {l:'D',t:'Demografi Audiens',e:'Audience Demographics',c:'analytics',d:'Data karakteristik statistik dari audiens yang membicarakan merek Anda, mencakup usia, jenis kelamin, lokasi, bahasa, dan minat mereka.',r:['Audiens','Segmentasi','Profil Konsumen']},
    {l:'E',t:'Earned Media',e:'Earned Media',c:'strategy',d:'Penyebutan, ulasan, atau liputan yang diperoleh organik tanpa biaya berbayar — melalui pemberitaan, share sukarela, atau word-of-mouth dari konsumen dan media.',r:['Paid Media','User Generated Content']},
    {l:'E',t:'Engagement',e:'Engagement',c:'metrics',d:'Jumlah total interaksi (like, komentar, share, retweet, save) yang diterima suatu konten. Menunjukkan seberapa aktif audiens terlibat dengan konten merek.',r:['Engagement Rate','Reach','Impression']},
    {l:'E',t:'Engagement Rate',e:'Engagement Rate',c:'metrics',d:'Persentase audiens yang berinteraksi dengan konten dibandingkan total reach atau follower. Rumus: (Total Engagement / Reach) × 100%. Indikator kualitas konten.',r:['Engagement','Reach','Follower']},
    {l:'F',t:'Feed Sosial',e:'Social Feed',c:'social',d:'Aliran konten real-time dari platform media sosial yang dikumpulkan oleh platform listening untuk dianalisis, mencakup postingan, komentar, dan interaksi publik.',r:['API','Real-Time Monitoring']},
    {l:'F',t:'Filter Konten',e:'Content Filter',c:'listening',d:'Fitur yang memungkinkan pengguna menyaring data berdasarkan kriteria seperti kata kunci, sentimen, platform, tanggal, atau lokasi untuk fokus pada insight yang relevan.',r:['Keyword Tracking','Mention']},
    {l:'F',t:'Follower',e:'Follower',c:'metrics',d:'Pengguna yang memilih untuk mengikuti akun media sosial suatu merek dan menerima pembaruan konten. Jumlah follower sering digunakan sebagai indikator popularitas.',r:['Engagement Rate','Reach','Audiens']},
    {l:'H',t:'Hashtag',e:'Hashtag',c:'social',d:'Kata atau frasa yang diawali simbol # yang digunakan untuk mengelompokkan konten bertema serupa di media sosial, memudahkan pencarian dan pemantauan topik tertentu.',r:['Keyword Tracking','Tren Topik']},
    {l:'H',t:'Historical Data',e:'Historical Data',c:'analytics',d:'Data percakapan dan penyebutan dari masa lalu yang digunakan untuk analisis tren jangka panjang, benchmarking, dan pembandingan performa dari waktu ke waktu.',r:['Benchmarking','Reporting']},
    {l:'I',t:'Impression',e:'Impression',c:'metrics',d:'Jumlah total berapa kali konten atau penyebutan merek ditampilkan kepada pengguna, terlepas dari apakah mereka benar mengkliknya atau berinteraksi dengannya.',r:['Reach','Engagement']},
    {l:'I',t:'Influencer',e:'Influencer',c:'social',d:'Individu dengan jumlah pengikut signifikan dan tingkat kepercayaan tinggi di media sosial, yang opini dan kontennya dapat mempengaruhi keputusan atau persepsi audiens terhadap merek.',r:['KOL','Reach','Engagement Rate']},
    {l:'I',t:'Insight',e:'Insight',c:'analytics',d:'Pemahaman mendalam yang dapat ditindaklanjuti (actionable) dari analisis data, membantu merek membuat keputusan strategis berdasarkan bukti nyata dari percakapan konsumen.',r:['Data Visualisasi','Brand Intelligence']},
    {l:'K',t:'Key Opinion Leader (KOL)',e:'Key Opinion Leader',c:'social',d:'Tokoh berpengaruh di bidang tertentu yang pendapatnya sangat dihargai komunitas — berbeda dari influencer umum karena biasanya berbasis keahlian spesifik.',r:['Influencer','Brand Ambassador','Reach']},
    {l:'K',t:'Keyword Tracking',e:'Keyword Tracking',c:'listening',d:'Pemantauan kata kunci atau frasa spesifik di seluruh platform digital untuk melacak percakapan, tren, dan penyebutan yang relevan dengan merek atau industri.',r:['Mention','Filter Konten']},
    {l:'K',t:'KPI (Key Performance Indicator)',e:'KPI',c:'metrics',d:'Metrik terukur yang digunakan untuk mengevaluasi keberhasilan strategi social media dan listening, seperti jumlah mention, engagement rate, share of voice, atau sentiment score.',r:['Benchmarking','Dashboard','Reporting']},
    {l:'M',t:'Media Monitoring',e:'Media Monitoring',c:'listening',d:'Pemantauan sistematis terhadap pemberitaan di media online, media cetak digital, dan siaran berita untuk melacak penyebutan merek, produk, atau isu tertentu.',r:['Brand Monitoring','Social Listening','Alert']},
    {l:'M',t:'Mention',e:'Mention',c:'listening',d:'Setiap penyebutan nama merek, produk, atau kata kunci terkait di media sosial, forum, berita, atau platform digital lainnya — baik yang menandai akun (@) maupun tidak.',r:['Brand Monitoring','Keyword Tracking','Volume Mention']}
];

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      // 1. Set Permissions for Glosarium and Testimonial
      const role = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' }
      });
      if (role) {
        const requiredActions = [
          'api::glosarium.glosarium.find', 
          'api::glosarium.glosarium.findOne',
          'api::testimonial.testimonial.find',
          'api::testimonial.testimonial.findOne',
          'api::lead.lead.create',
          'api::faq.faq.find',
          'api::faq.faq.findOne',
          'api::blog.blog.find',
          'api::blog.blog.findOne',
          'api::homepage.homepage.find',
          'api::feature-section.feature-section.find',
          'api::feature-section.feature-section.findOne'
        ];
        
        const existingPermissions = await strapi.db.query('plugin::users-permissions.permission').findMany({
          where: { role: role.id, action: { $in: requiredActions } }
        });
        const existingActions = existingPermissions.map(p => p.action);
        
        for (const action of requiredActions) {
          if (!existingActions.includes(action)) {
            await strapi.db.query('plugin::users-permissions.permission').create({
              data: { action: action, role: role.id }
            });
            console.log(`[BOOTSTRAP] Granted ${action} to public role`);
          }
        }
      }

      // 2. Migrate Glosarium Data if empty
      const glosariumCount = await strapi.db.query('api::glosarium.glosarium').count();
      if (glosariumCount === 0) {
        console.log(`[BOOTSTRAP] Migrating ${data.length} glossary terms...`);
        for (const item of data) {
          await strapi.documents('api::glosarium.glosarium').create({
            data: {
              term: item.t,
              englishTerm: item.e,
              category: item.c as any,
              definition: item.d,
              relatedTerms: item.r ? item.r.join(',') : '',
            },
            status: 'published'
          });
        }
      }

      // 3. Migrate Testimonials Data if empty
      const testiCount = await strapi.db.query('api::testimonial.testimonial').count();
      if (testiCount === 0) {
        const initialTestimonials = [
          { quote: "I've tried countless tea brands, but nothing compares to the freshness and aroma of this one. Every sip feels like a warm hug! My mornings are incomplete without it.", name: "Olivia Richardson", role: "Marketing Director", cardColor: "red", row: "top" },
          { quote: "As a tea lover, I appreciate the rich flavors and organic ingredients. The chamomile blend has become my go-to for relaxation after a long day!", name: "Sophia Mitchell", role: "CEO, Tech Startup", cardColor: "orange", row: "top" },
          { quote: "I never knew tea could taste this good! The flavors are so pure and soothing. Plus, the packaging is beautiful - perfect for gifting too!", name: "Aisha Khan", role: "Public Relations Head", cardColor: "yellow", row: "top" },
          { quote: "The variety of blends is amazing! Whether I need a morning energy boost or a calming bedtime tea, this brand has it all. Highly recommend!", name: "Emily Sanders", role: "Brand Manager", cardColor: "blue", row: "bottom" },
          { quote: "This tea has changed my daily routine for the better! The detox blend helps me feel refreshed and energized. Love the natural ingredients!", name: "Priya Deshmukh", role: "Digital Strategist", cardColor: "purple", row: "bottom" },
          { quote: "I'm obsessed with the matcha! It's so smooth and gives me the perfect energy without any jitters. A must-try for all tea lovers!", name: "Mia Lawrence", role: "Social Media Manager", cardColor: "green", row: "bottom" },
        ];
        
        console.log(`[BOOTSTRAP] Migrating ${initialTestimonials.length} testimonials...`);
        for (const item of initialTestimonials) {
          await strapi.documents('api::testimonial.testimonial').create({
            data: {
              quote: item.quote,
              name: item.name,
              role: item.role,
              cardColor: item.cardColor as any,
              row: item.row as any,
              isActive: true
            },
            status: 'published'
          });
        }
      }

      // 4.5 Migrate Feature Sections Data
      const featureSectionCount = await strapi.db.query('api::feature-section.feature-section').count();
      if (featureSectionCount === 0) {
        const featureSections = [
          {
            title: "THE EARS",
            tagline: "Hear Every Conversation That Matters",
            categoryIdentifier: "ears",
            carouselItems: [
              { subtitle: "Multi-Channel Data Crawling", description: "Collect data seamlessly across various digital platforms in real-time." },
              { subtitle: "Hashtag tracking & Trending", description: "Monitor hashtags and identify emerging trends as they happen." }
            ]
          },
          {
            title: "THE BRAIN",
            tagline: "Analyze With Unmatched Precision",
            categoryIdentifier: "brain",
            carouselItems: [
              { subtitle: "Automated Sentiment Analysis", description: "Automatically analyze and categorize audience sentiment." },
              { subtitle: "Advanced Query Management", description: "Use powerful boolean operators to filter exactly what you need." },
              { subtitle: "Volume & Trend Analytics", description: "Visualize data volumes and track historical trends easily." },
              { subtitle: "Account & Influencer Identification", description: "Discover key accounts and influencers driving the conversation." },
              { subtitle: "Word Cloud & Topic Mapping", description: "Understand the most discussed topics at a glance." },
              { subtitle: "Comparison brand project", description: "Compare your brand's performance against competitors directly." }
            ]
          },
          {
            title: "THE SHIELD",
            tagline: "Protect Your Brand Reputation",
            categoryIdentifier: "shield",
            carouselItems: [
              { subtitle: "Real-Time Alert System", description: "Get notified instantly about critical brand mentions or PR crises." }
            ]
          },
          {
            title: "THE MOUTH",
            tagline: "Speak Volumes With Insights",
            categoryIdentifier: "mouth",
            carouselItems: [
              { subtitle: "Reporting & Exporting", description: "Generate comprehensive reports and export data for your team." }
            ]
          },
          {
            title: "THE EYES",
            tagline: "See Beyond The Text",
            categoryIdentifier: "eyes",
            carouselItems: [
              { subtitle: "Visual Content Recognition", description: "Analyze images and logos to see where your brand appears visually." },
              { subtitle: "Video Content Analysis", description: "Extract insights and sentiment directly from video content." },
              { subtitle: "Multimodal Synthesis", description: "Combine text and visual data for a unified brand intelligence report." },
              { subtitle: "Visual Sentiment Insights", description: "Understand the emotion conveyed in images shared by your audience." }
            ]
          }
        ];
        
        console.log(`[BOOTSTRAP] Migrating ${featureSections.length} feature sections...`);
        for (const section of featureSections) {
          await strapi.documents('api::feature-section.feature-section').create({
            data: section,
            status: 'published'
          });
        }
      }

      // 5. Migrate FAQs Data if empty
      const faqCount = await strapi.db.query('api::faq.faq').count();
      if (faqCount === 0) {
        const initialFaqs = [
          { question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
          { question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
          { question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." }
        ];
        console.log(`[BOOTSTRAP] Migrating ${initialFaqs.length} faqs...`);
        for (const item of initialFaqs) {
          await strapi.documents('api::faq.faq').create({
            data: item,
            status: 'published'
          });
        }
      }

      // 6. Migrate Blogs Data if empty
      const blogCount = await strapi.db.query('api::blog.blog').count();
      if (blogCount === 0) {
        const initialBlogs = [
          { title: "Step by step to conduct usability testing", slug: "step-by-step", excerpt: "Examining how fintech is promoting access to financial services for underserved populations.", content: "Content here...", authorName: "Andrea william", date: "2023-01-21", layoutStyle: "horizontal" },
          { title: "Minimal workspace for inspirations", slug: "minimal-workspace", excerpt: "Minimal workspace for inspirations", content: "Content here...", authorName: "Harsh Patel", date: "2023-02-21", layoutStyle: "vertical_purple" },
          { title: "Morning routine to boost your mood", slug: "morning-routine", excerpt: "Morning routine to boost your mood", content: "Content here...", authorName: "John Doe", date: "2023-03-21", layoutStyle: "vertical" },
          { title: "5 tips to increase your productivity", slug: "5-tips", excerpt: "5 tips to increase your productivity", content: "Content here...", authorName: "Jane Smith", date: "2023-04-21", layoutStyle: "vertical" }
        ];
        console.log(`[BOOTSTRAP] Migrating ${initialBlogs.length} blogs...`);
        for (const item of initialBlogs) {
          await strapi.documents('api::blog.blog').create({
            data: item,
            status: 'published'
          });
        }
      }
      // 7. Migrate Homepage Data if empty
      const homepageData = await strapi.db.query('api::homepage.homepage').findOne({});
      if (!homepageData || !homepageData.heroTagline) {
        console.log(`[BOOTSTRAP] Migrating Homepage default data...`);
        const defaultHomeData = {
          heroTagline: "AI SOCIAL LISTENING TOOL",
          heroUSP1: "Discover Customer Insights.",
          heroUSP2: "Analyze Trends Faster.",
          heroUSP3: "Monitor Brand Health.",
          aboutUsTagline: "Dengarkan Yang tak Terucapkan",
          aboutUsDescription: "Data tanpa konteks budaya hanyalah tumpukan angka. Kami memberi Anda kebenaran yang jujur, untuk #DengarkanDulu"
        };
        
        if (homepageData) {
          await strapi.db.query('api::homepage.homepage').update({
            where: { id: homepageData.id },
            data: defaultHomeData
          });
        } else {
          await strapi.documents('api::homepage.homepage').create({
            data: defaultHomeData,
            status: 'published'
          });
        }
      }
    } catch (err) {
      console.log('[BOOTSTRAP] Error in bootstrap:', err);
    }
  },
};
