import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Recycle, LineChart, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-8 lg:pt-8">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute right-0 top-0 -z-10 h-[300px] w-[300px] rounded-full bg-green-100 opacity-20 blur-3xl md:h-[600px] md:w-[600px]"></div>

        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-700">
              Healthcare Sustainability
            </div>
            <h1 className="text-4xl font-bold tracking-tighter text-slate-900 md:text-5xl lg:text-6xl">
              Decision Support Tool for
              <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                {" "}
                Circular Procurement
              </span>
            </h1>
            <p className="max-w-[700px] text-slate-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Helping healthcare professionals make informed purchasing decisions with economic, social, and
              environmental impact insights.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-2 md:py-2 lg:py-2 mb-6">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          {/* <Card className="border-none bg-white/80 shadow-lg backdrop-blur-sm">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="rounded-full bg-green-100 p-2">
                  <Recycle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-lg text-center text-slate-700 max-w-3xl mx-auto">
                This tool is developed for procurement professionals and others who want to gain insight into the
                economic, social and environmental impact of different types of{" "}
                <span className="font-semibold">isolation gowns</span> to make better informed purchasing decisions.
              </p>
            </CardContent>
          </Card> */}

          <div className="mt-16">
            <div className="grid gap-8">
              <Card className="overflow-hidden border-none bg-white shadow-xl transition-all hover:shadow-lg">
                <div className="absolute top-0 right-0 h-[150px] w-[200px] bg-green-50 rounded-bl-full opacity-50"></div>
                <CardHeader className="relative z-10 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="rounded-full bg-green-100 p-2">
                      <LineChart className="h-5 w-5 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Gown Comparison</CardTitle>
                  </div>
                  <CardDescription className="text-base text-slate-600 mb-6">
                    Compare the economic, social and environmental impact of different types of reusable and disposable
                    isolation gowns.
                  </CardDescription>
                  <div className="bg-green-50 p-6 rounded-lg mb-4">
                    <p className="text-lg text-slate-700 max-w-3xl mx-auto">
                      This tool is developed for procurement professionals and others who want to gain insight into the
                      economic, social and environmental impact of different types of{" "}
                      <span className="font-semibold">isolation gowns</span> to make better informed purchasing
                      decisions.
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
                      <Shield className="h-8 w-8 text-green-600 mb-2" />
                      <h3 className="font-medium text-slate-900">Environmental Impact</h3>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
                      <LineChart className="h-8 w-8 text-green-600 mb-2" />
                      <h3 className="font-medium text-slate-900">Economic Analysis</h3>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
                      <Recycle className="h-8 w-8 text-green-600 mb-2" />
                      <h3 className="font-medium text-slate-900">Sustainability Metrics</h3>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="relative z-10 flex justify-center border-t bg-slate-50 p-6">
                  <Button
                    asChild
                    size="lg"
                    className="gap-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                  >
                    <Link href="/gowns">
                      Compare Gowns <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Commented out as per original code
              <Card>
                <CardHeader>
                  <CardTitle>2. Gown Portfolio Optimization</CardTitle>
                  <CardDescription>
                    Use this feature to create an optimal portfolio from different types of isolation gowns based on either water, CO₂, energy or financial impact.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild>
                    <Link href="/portfolio_optimization">Optimize Portfolio</Link>
                  </Button>
                </CardFooter>
              </Card>
              */}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-2">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            {/* <div className="flex items-center justify-center space-x-2">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="AUAS Logo"
                width={40}
                height={40}
                className="rounded-sm"
              />
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="NWO Logo"
                width={40}
                height={40}
                className="rounded-sm"
              />
            </div> */}
            <p className="max-w-[700px] text-sm text-slate-600">
              This tool was developed by researchers from Amsterdam University of Applied Sciences (AUAS) and industry
              partners in the MODLI project. MODLI is co-funded by the Taskforce for Applied Research SIA, part of the
              Dutch Research Council (NWO). RAAK.PUB11.024
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

