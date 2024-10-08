import { Metadata } from "next"


import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui//card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui//tabs"

import { Overview } from "@/components/dashboard/charts/overview-bar"
import { OverviewRadar } from "@/components/dashboard/charts/overview-radar"
import RandomDataTable from "@/components/dashboard/charts/table-overview"
import StackedDonutChart from "@/components/dashboard/charts/PieStacked"
import GaugeChartCo2 from "@/components/dashboard/charts/GaugeChart-co2"
import GaugeChartEnergy from "@/components/dashboard/charts/GaugeChart-energy"
import GaugeChartWater from "@/components/dashboard/charts/GaugeChart-water"
import NetherlandsMap from "@/components/dashboard/charts/GeoChart"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
}




export default function DashboardPage() {
  return (
    <>
      {/* <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div> */}
      <div className="hidden flex-col md:flex">
        {/* <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <TeamSwitcher />
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div> */}
        <div className="flex-1 space-y-4 p-8 pt-6">
          {/* <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">MODLI</h2>
            <div className="flex items-center space-x-2">
              <CalendarDateRangePicker />
              <Button>Download</Button>
            </div>
          </div> */}
          <Tabs defaultValue="sustainalbe" className="space-y-4">
            <TabsList>
              <TabsTrigger value="sustainalbe">Sustainable</TabsTrigger>
              <TabsTrigger value="resilient">Resilient</TabsTrigger>
            </TabsList>
            <TabsContent value="sustainalbe" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"> 

              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      TOTAL COST
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">45,231.89</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent>
                    <GaugeChartCo2/>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <GaugeChartEnergy/>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <GaugeChartWater/>
                  </CardContent>
                </Card>
                
              </div>
              <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="z-20">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="production">Production</TabsTrigger>
              <TabsTrigger value="laundry">Laundry</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 ">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <OverviewRadar />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Gown portofolio outlook</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RandomDataTable />
                  </CardContent>
                </Card>
            </div>
            </TabsContent>
            <TabsContent value="production" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 ">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Portfolio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StackedDonutChart />
                  </CardContent>
                </Card>
            </div>
            </TabsContent>
            <TabsContent value="laundry" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 ">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Economic Ares affected</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <NetherlandsMap />
                  </CardContent>
                </Card>
            </div>
            </TabsContent>
            </Tabs>
            </TabsContent>
            <TabsContent value="resilient" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"> 

              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      TOTAL COST
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">45,231.89</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent>
                    <GaugeChartCo2/>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <GaugeChartEnergy/>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <GaugeChartWater/>
                  </CardContent>
                </Card>
                
              </div>
              <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="z-20">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="production">Production</TabsTrigger>
              <TabsTrigger value="laundry">Laundry</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 ">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <OverviewRadar />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Gown portofolio outlook</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RandomDataTable />
                  </CardContent>
                </Card>
            </div>
            </TabsContent>
            <TabsContent value="production" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 ">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Portfolio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StackedDonutChart />
                  </CardContent>
                </Card>
            </div>
            </TabsContent>
            <TabsContent value="laundry" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 ">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Economic Ares affected</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <NetherlandsMap />
                  </CardContent>
                </Card>
            </div>
            </TabsContent>
            </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}