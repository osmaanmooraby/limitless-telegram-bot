import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import LifeStory from '@/components/LifeStory'
import TradingDashboard from '@/components/TradingDashboard'
import VIPSection from '@/components/VIPSection'
import MediaHub from '@/components/MediaHub'
import InnerWorld from '@/components/InnerWorld'
import EmpireMap from '@/components/EmpireMap'
import AskOsmaanAI from '@/components/AskOsmaanAI'
import HiddenVault from '@/components/HiddenVault'
import FinalCTA from '@/components/FinalCTA'

export default function Home() {
  return (
    <main className="relative bg-background">
      <Navigation />
      <Hero />
      <LifeStory />
      <TradingDashboard />
      <VIPSection />
      <MediaHub />
      <InnerWorld />
      <EmpireMap />
      <AskOsmaanAI />
      <HiddenVault />
      <FinalCTA />
    </main>
  )
}
