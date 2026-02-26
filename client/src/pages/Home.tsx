import Hero from '../components/Hero'
import FeaturedCollection from '../components/FeaturedCollection'
import ProductHighlight from '../components/ProductHighlight'
import BrandPhilosophy from '../components/BrandPhilosophy'
import Lookbook from '../components/Lookbook'
import WhyLemonO from '../components/WhyLemonO'

const Home = () => {
  return (
    <div className="pt-16 md:pt-20">
      <Hero />
      <FeaturedCollection />
      <ProductHighlight />
      <BrandPhilosophy />
      <Lookbook />
      <WhyLemonO />
    </div>
  )
}

export default Home
