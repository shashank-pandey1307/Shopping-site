import Hero from '../components/Hero'
import FeaturedCollection from '../components/FeaturedCollection'
import ProductHighlight from '../components/ProductHighlight'
import BrandPhilosophy from '../components/BrandPhilosophy'
import Lookbook from '../components/Lookbook'
import WhyLemonO from '../components/WhyLemonO'

const Home = () => {
  return (
    <div className="pt-16 md:pt-20">
      {/* SECTION 1: Hero */}
      <Hero />
      
      {/* SECTION 2: Featured Collection */}
      <FeaturedCollection />
      
      {/* SECTION 3: Product Highlight */}
      <ProductHighlight />
      
      {/* SECTION 4: Brand Philosophy */}
      <BrandPhilosophy />
      
      {/* SECTION 5: Lookbook / Lifestyle */}
      <Lookbook />
      
      {/* SECTION 6: Why lemonO */}
      <WhyLemonO />
    </div>
  )
}

export default Home
