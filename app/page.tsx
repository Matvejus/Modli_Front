import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Decision Support Tool for Circular Procurement in Healthcare
        </h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-12">
          <p className="text-lg text-gray-700 text-center">
            This tool is developed for procurement professionals and others who want to
            gain insight into the economic, social and environmental impact of different
            types of <b>isolation gowns</b> to make better informed purchasing decisions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <FeatureCard 
            title="1. Gown comparison"
            description="Use this feature to compare the economic, social and environmental impact of different types of reusable and disposable isolation gowns."
            buttonText="Compare Gowns"
            buttonLink="/gowns"
          />
          <FeatureCard 
            title="2. Gown portfolio optimization"
            description="Use this feature to create an optimal portfolio from different types of isolation gowns based on either water, CO₂, energy or financial impact."
            buttonText="Optimize Portfolio"
            buttonLink="/portfolio_optimization"
          />
        </div>
        <footer className="mt-12 text-center text-sm text-gray-600">
        This tool was developed by researchers from Amsterdam University of Applied Sciences (AUAS) and industry partners in the MODLI project. MODLI is co-funded by the Taskforce for Applied Research SIA, part of the Dutch Research Council (NWO). RAAK.PUB11.024
        </footer>
      </div>
    </div>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  buttonText: string
  buttonLink: string
}

function FeatureCard({ title, description, buttonText, buttonLink }: FeatureCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-700 mb-6">{description}</p>
      <div className="flex justify-center">
        <Link href={buttonLink} className="inline-block bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition-colors">
          {buttonText}
        </Link>
      </div>
    </div>
  )
}

