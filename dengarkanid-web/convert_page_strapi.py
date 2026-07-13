import sys

def modify_page():
    with open("src/app/page.tsx", "r") as f:
        content = f.read()

    # 1. Add imports
    if "STRAPI_API_URL" not in content:
        content = content.replace(
            "import Footer from \"@/components/layout/Footer\";",
            "import Footer from \"@/components/layout/Footer\";\nimport { STRAPI_API_URL, getStrapiImageUrl } from \"@/utils/strapi\";"
        )
    
    # 2. Add state inside Home()
    if "const [heroData" not in content:
        state_code = """
  const [heroData, setHeroData] = useState<any>(null);
  const [homeData, setHomeData] = useState<any>(null);
  const [featuresData, setFeaturesData] = useState<any[]>([]);
  const [faqsData, setFaqsData] = useState<any[]>([]);
  const [blogsData, setBlogsData] = useState<any[]>([]);
"""
        content = content.replace("export default function Home() {", "export default function Home() {\n" + state_code)

    # 3. Add fetch logic in useEffect
    if "fetchStrapiContent" not in content:
        fetch_code = """
  useEffect(() => {
    async function fetchStrapiContent() {
      try {
        const fetchOpts = { headers: {} };
        const heroRes = await fetch(`${STRAPI_API_URL}/hero?populate=*`, fetchOpts);
        if (heroRes.ok) setHeroData((await heroRes.json()).data);

        const homeRes = await fetch(`${STRAPI_API_URL}/homepage?populate=*`, fetchOpts);
        if (homeRes.ok) setHomeData((await homeRes.json()).data);

        const featuresRes = await fetch(`${STRAPI_API_URL}/features`, fetchOpts);
        if (featuresRes.ok) setFeaturesData((await featuresRes.json()).data);

        const faqRes = await fetch(`${STRAPI_API_URL}/faqs`, fetchOpts);
        if (faqRes.ok) setFaqsData((await faqRes.json()).data);

        const blogRes = await fetch(`${STRAPI_API_URL}/blogs?populate=*`, fetchOpts);
        if (blogRes.ok) setBlogsData((await blogRes.json()).data);
      } catch (err) {
        console.error("Failed to fetch from Strapi", err);
      }
    }
    fetchStrapiContent();
  }, []);
"""
        content = content.replace("  useEffect(() => {", fetch_code + "\n  useEffect(() => {")
    
    # 4. Replace JSX elements
    # Hero Title & Desc
    content = content.replace(
        "<h1>Unlock <br/> The Power <br/> of Data</h1>",
        "<h1 dangerouslySetInnerHTML={{ __html: heroData?.title || 'Unlock <br/> The Power <br/> of Data' }}></h1>"
    )
    content = content.replace(
        "<p>Pahami audiens Anda dan optimalkan strategi dengan mendengarkan insight langsung dari social media.</p>",
        "<p dangerouslySetInnerHTML={{ __html: heroData?.description || 'Pahami audiens Anda dan optimalkan strategi dengan mendengarkan insight langsung dari social media.' }}></p>"
    )
    
    # Hero Image
    content = content.replace(
        'src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1200 600\'%3E%3C/svg%3E"',
        'src={heroData?.image ? getStrapiImageUrl(heroData.image) : "data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1200 600\'%3E%3C/svg%3E"}'
    )

    # Features (3 sections)
    content = content.replace(
        "<h2>Temukan Tren Tersembunyi di Balik Ribuan Data</h2>",
        "<h2 dangerouslySetInnerHTML={{ __html: homeData?.feature1Title || 'Temukan Tren Tersembunyi di Balik Ribuan Data' }}></h2>"
    )
    content = content.replace(
        "Dengarkan ID membantu Anda menyelami lautan data media sosial untuk menemukan tren berharga yang sering terlewatkan. Dengan analisis sentimen dan pengenalan pola tingkat lanjut, Anda dapat memahami apa yang sebenarnya diinginkan audiens.",
        "{homeData?.feature1Desc || 'Dengarkan ID membantu Anda menyelami lautan data media sosial untuk menemukan tren berharga yang sering terlewatkan. Dengan analisis sentimen dan pengenalan pola tingkat lanjut, Anda dapat memahami apa yang sebenarnya diinginkan audiens.'}"
    )

    content = content.replace(
        "<h2>Pahami Opini Publik Secara Real-Time</h2>",
        "<h2 dangerouslySetInnerHTML={{ __html: homeData?.feature2Title || 'Pahami Opini Publik Secara Real-Time' }}></h2>"
    )
    content = content.replace(
        "Ketahui reaksi audiens terhadap produk atau kampanye Anda seketika. Kami memantau percakapan dari berbagai platform untuk memberikan laporan sentimen real-time, memungkinkan Anda untuk bertindak cepat dan tepat.",
        "{homeData?.feature2Desc || 'Ketahui reaksi audiens terhadap produk atau kampanye Anda seketika. Kami memantau percakapan dari berbagai platform untuk memberikan laporan sentimen real-time, memungkinkan Anda untuk bertindak cepat dan tepat.'}"
    )

    content = content.replace(
        "<h2>Ambil Keputusan Bisnis Lebih Percaya Diri</h2>",
        "<h2 dangerouslySetInnerHTML={{ __html: homeData?.feature3Title || 'Ambil Keputusan Bisnis Lebih Percaya Diri' }}></h2>"
    )
    content = content.replace(
        "Jangan menebak-nebak strategi Anda. Dengarkan ID menyajikan laporan komprehensif dengan metrik kunci yang relevan dengan industri Anda, memberikan fondasi data yang kuat untuk setiap keputusan bisnis.",
        "{homeData?.feature3Desc || 'Jangan menebak-nebak strategi Anda. Dengarkan ID menyajikan laporan komprehensif dengan metrik kunci yang relevan dengan industri Anda, memberikan fondasi data yang kuat untuk setiap keputusan bisnis.'}"
    )

    with open("src/app/page.tsx", "w") as f:
        f.write(content)

modify_page()
