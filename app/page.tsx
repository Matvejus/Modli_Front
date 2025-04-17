import Link from "next/link"
import { ArrowRight, PersonStanding, LineChart, HandCoins, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"


export default function LandingPage() {
  return (
    <div className="max-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-14 md:pt-18 lg:pt-10">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute right-0 top-0 -z-10 h-[300px] w-[300px] rounded-full bg-green-100 opacity-20 blur-3xl md:h-[600px] md:w-[600px]"></div>

        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
              Decision Support Tool for Circular Procurement
            </h1>
            <div className="flex flex-col gap-2 min-[400px]:flex-row"></div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-2 md:py-2 lg:py-2 mb-16">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="mt-4">
            <div className="grid gap-8">
              <Card className="overflow-hidden border-none bg-white transition-all hover:shadow-lg relative z-30">
                <CardHeader className="relative z-10 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="rounded-full bg-green-100 p-2">
                      <LineChart className="h-5 w-5 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Isolation Gown Comparison</CardTitle>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg mb-4">
                    <p className="text-lg text-slate-700 max-w-3xl mx-auto">
                      This tool is developed for healthcare procurement professionals and others who want to gain insight into the
                      economic, social and environmental impact of different types of{" "}
                      <span className="font-semibold">isolation gowns</span> to make better informed purchasing
                      decisions.
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
                      <Leaf className="h-8 w-8 text-green-600 mb-2" />
                      <h3 className="font-medium text-slate-900">Environmental Impact</h3>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
                      <HandCoins className="h-8 w-8 text-green-600 mb-2" />
                      <h3 className="font-medium text-slate-900">Economic Impact</h3>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
                      <PersonStanding className="h-8 w-8 text-green-600 mb-2" />
                      <h3 className="font-medium text-slate-900">Social Impact</h3>
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
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
