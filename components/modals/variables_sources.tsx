"use client"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { InfoCircledIcon } from "@radix-ui/react-icons"

export default function VariablesAndSourcesModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("economic")

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <InfoCircledIcon className="mr-2 h-4 w-4" /> click here to view variables and sources used
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] md:max-w-[80vw] lg:max-w-[1000px] max-h-[90vh] overflow-y-auto bg-white text-black border-2 border-gray-200 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            MODLI's Sustainability Impact Assessment: Variables and Assumptions
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            This document outlines the key variables, assumptions, and data sources used in the assessment.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="economic">Economic Impact</TabsTrigger>
            <TabsTrigger value="environmental">Environmental Impact</TabsTrigger>
            <TabsTrigger value="social">Social Impact</TabsTrigger>
            <TabsTrigger value="disclaimer">Disclaimer</TabsTrigger>
          </TabsList>

          {/* Economic Impact Tab */}
          <TabsContent value="economic" className="space-y-4">
            <p>
              Table 1 presents key variables and default values used in assessing the economic impact of disposable and
              reusable isolation gowns.
            </p>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Variables</TableHead>
                    <TableHead className="w-1/3">Default values</TableHead>
                    <TableHead className="w-1/3">References</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Weight of reusable gowns</TableCell>
                    <TableCell>300 grams</TableCell>
                    <TableCell>BAwear (2024)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Weight of disposable gown</TableCell>
                    <TableCell>40 grams</TableCell>
                    <TableCell>BAwear (2024)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Longevity*
                      <br />
                      (number of washes)
                    </TableCell>
                    <TableCell>Reusable gowns: 80 washes until end-of-life</TableCell>
                    <TableCell>
                      LOKAAS Pilot (2022-2024)
                      <br />
                      Reblend Maatschappelijke Business Case Circulaire Isolatiejassen (2023)
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Purchase costs*
                      <br />
                      (price per gown + potential cost for (laundry) tag per gown)
                    </TableCell>
                    <TableCell>
                      Reusable gowns: €42
                      <br />
                      Disposable gown: €0.76
                    </TableCell>
                    <TableCell>Reblend Maatschappelijke Business Case Circulaire Isolatiejassen (2023)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Laundry costs*
                      <br />
                      (laundry cost per wash charged by industrial laundry)
                    </TableCell>
                    <TableCell>€1.25 per gown/wash</TableCell>
                    <TableCell>
                      LOKAAS Pilot (2022-2024) Reblend Maatschappelijke Business Case Circulaire Isolatiejassen (2023).
                      In the upscaled LOKAAS, a cost of €0.80 per gown wash is estimated.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Waste costs*
                      <br />
                      (charged by waste management companies for hospital specific waste)
                    </TableCell>
                    <TableCell>
                      Hospital specific waste is charged at €1.20/kg
                      <br />• Disposable gown (40 grams): €0.05 per gown
                      <br />• Reusable gown is expected to be recycled, thus €0.00
                    </TableCell>
                    <TableCell>
                      LOKAAS Pilot (2022-2024)
                      <br />
                      Reblend Maatschappelijke Business Case Circulaire Isolatiejassen (2023).
                      <br />
                      <br />
                      Due to the current safety/hygiene regulations, after use, disposable gowns are classified as
                      (contaminated) hospital specific waste.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Residual value*
                      <br />
                      (potential monetary value of isolation gowns/material at end-of-life)
                    </TableCell>
                    <TableCell>
                      Reusable gown: €0.03 at end-of-life
                      <br />
                      <br />
                      Disposable gown: €0.00 at end-of-life
                    </TableCell>
                    <TableCell>
                      End-of-life reusable gowns are valued at: €0.02 - €0.14/kg as feedstock for fibre-to-fibre
                      recycling and €0.08/kg for downcycling (
                      <a
                        href="https://reports.fashionforgood.com/report/sorting-for-circularity-europe/"
                        className="text-blue-600 hover:underline"
                      >
                        Sorting for Circularity Europe, Fashion for Good, 2022
                      </a>
                      ). In the calculation we have taken a default value of 0.1 per kg.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <p className="text-sm italic">
              Note: *refers to user-input variables. In case of no user input, the default values in the second column
              will be used in the calculation of economic impact.
            </p>
          </TabsContent>

          {/* Environmental Impact Tab */}
          <TabsContent value="environmental" className="space-y-4">
            <p>
              For the environmental impact calculations, we recognize three phases, i.e. Production, Usage, and
              End-of-Life. We rely on Idemat (version 2024-V2-3e) as the database for environmental impact variables
              considered in each phase.
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                The <strong>Production phase</strong> is split into three sub-phases: Raw (extracting the materials),
                Advanced (production, manufacturing) and Transport (transporting gowns from production sites to
                laundries/wholesalers which often concerns long-distance intermodal ocean-road transport). Table 2
                provides further information on assumed localities.
              </li>
              <li>
                The <strong>Usage phase</strong> covers the laundry process, which is based on the weight of gowns. The
                environmental impact related to the transportation process between laundry companies and healthcare
                organizations is not taken into account as the impact is considered negligible.
              </li>
              <li>
                The <strong>End-of-Life phase</strong> has two options: regular incineration (with electricity
                generation) for disposable gowns and a closed-loop (chemical) recycling program for all types of
                reusable gowns. No data on mechanical recycling is available in Idemat (version 2024-V2-3e). The
                environmental impact related to the transportation process from the healthcare facility to recycling or
                waste management companies is not considered as the impact is considered negligible.
              </li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">Assumed localities in the Production phase</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gown type</TableHead>
                    <TableHead>Production Raw</TableHead>
                    <TableHead>Production Advanced</TableHead>
                    <TableHead>Production Transport</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>100% Lyocell</TableCell>
                    <TableCell>Market mix</TableCell>
                    <TableCell>Market mix</TableCell>
                    <TableCell>10.000km by boat</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>100% Organic Cotton</TableCell>
                    <TableCell>China</TableCell>
                    <TableCell>China/India</TableCell>
                    <TableCell>10.000km by boat</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>100% Cotton</TableCell>
                    <TableCell>Global mix: USA, India, China</TableCell>
                    <TableCell>Global mix: USA, India, China</TableCell>
                    <TableCell>10.000km by boat</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>100% Recycled Cotton</TableCell>
                    <TableCell>No data</TableCell>
                    <TableCell>No data</TableCell>
                    <TableCell>10.000km by boat</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>100% Polyester</TableCell>
                    <TableCell>Market mix</TableCell>
                    <TableCell>Market mix</TableCell>
                    <TableCell>10.000km by boat</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>100% Recycled Polyester</TableCell>
                    <TableCell>Market mix</TableCell>
                    <TableCell>Market mix</TableCell>
                    <TableCell>10.000km by boat</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Polyester-Cotton Blend (65-35)</TableCell>
                    <TableCell>Global mix: USA, India, China & Market mix</TableCell>
                    <TableCell>Global mix: USA, India, China & Market mix</TableCell>
                    <TableCell>10.000km by boat</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>100% Polypropelene (disposable)</TableCell>
                    <TableCell>Market mix</TableCell>
                    <TableCell>Market mix</TableCell>
                    <TableCell>10.000km by boat</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <h3 className="text-lg font-semibold mt-4">Metrics</h3>
            <p>We consider the following three metrics, as described in Idemat (version 2024-V2-3e):</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Water (L)</strong> – Refers to fresh water used in all the three phases and scaled according to
                the water scarcity index. This is represented in liters, and accounts for the amount of water needed to
                restore the balance of in- and outflux of water during the process to negate any local ecological
                damage. Thus, it favors water use in places where there is an abundance of water, and punishes water use
                where it is scarce.
              </li>
              <li>
                <strong>Energy (MJ-eq)</strong> – The energy needed to finish each phase (production, usage and
                end-of-life). This is represented in MJ-eq, which allows to compare energy use from different sources.
              </li>
              <li>
                <strong>CO₂-eq</strong> - refers to the total emission of greenhouse gasses. CO₂-eq measures the impact
                of different greenhouse gases (GHGs) on global warming in terms of the amount of CO₂ calculated based on
                the Global Warming Potential index. The Global Warming Potential is a fixed value that expresses any
                greenhouse gas in terms of CO2-equiv.
              </li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">Exclusions</h3>
            <p>
              We do not include the following metrics: Toxicity, Land use, Eutrophication, Acidification, Ozone
              depletion. These effects are relatively small and because the exact chemicals used during the different
              stages are unknown, these metrics cannot be accurately estimated.
            </p>
          </TabsContent>

          {/* Social Impact Tab */}
          <TabsContent value="social" className="space-y-4">
            <p>
              Regarding social impact, we consider three elements: social certifications, perceived hygiene (user), and
              perceived comfort (user).
            </p>

            <h3 className="text-lg font-semibold mt-4">Social certifications</h3>
            <p>
              The following certifications with a (partial) focus on social aspects (e.g. farmers receiving a living
              wage) are included. When using the tool, users can manually add other types of certification.
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                Fairtrade Textile Production Standard:
                <a
                  href="https://www.fairtrade.net/en/why-fairtrade/how-we-do-it/standards/who-we-have-standards-for/textile-standard.html#:~:text=The%20Fairtrade%20Textile%20Standard%20aims%20to%20facilitate%20change,brands%20to%20commit%20to%20fair%20terms%20of%20trade."
                  className="text-blue-600 hover:underline"
                >
                  Fairtrade Textile Production Standard: Textile Standard
                </a>
              </li>
              <li>
                Fair for Life Kleding:
                <a
                  href="https://www.fairforlife.org/pmws/indexDOM.php?client_id=fairforlife&page_id=root_2_3&lang_iso639=en"
                  className="text-blue-600 hover:underline"
                >
                  Fair for Life - Standard & material
                </a>
              </li>
              <li>
                Fair Wear Foundation:
                <a
                  href="https://www.fairwear.org/responsible-purchasing-practices"
                  className="text-blue-600 hover:underline"
                >
                  Responsible purchasing practices – Fair Wear
                </a>
              </li>
              <li>
                OEKO-TEX Made in Green:
                <a
                  href="https://www.oeko-tex.com/en/news/infocenter/discover-the-made-in-green-label-check-and-experience-transparency"
                  className="text-blue-600 hover:underline"
                >
                  Discover the MADE IN GREEN Label Check and experience transparency
                </a>
              </li>
              <li>
                BlueSign Certified (PFAS free):
                <a href="https://www.bluesign.com/" className="text-blue-600 hover:underline">
                  bluesign | Sustainable Solutions for the Textile Industry
                </a>
              </li>
            </ul>

            <p>
              For an overview of (social) certifications in the textile industry please see:
              <a
                href="https://www.keurmerkenwijzer.nl/alle-keurmerken/kleding"
                className="text-blue-600 hover:underline ml-1"
              >
                https://www.keurmerkenwijzer.nl/alle-keurmerken/kleding
              </a>
            </p>

            <h3 className="text-lg font-semibold mt-4">Perceived hygiene</h3>
            <p>
              An evaluation of hygiene based on the advice of your infection prevention team. 5-point Likert scale from
              very unhygienic to very hygienic.
            </p>

            <h3 className="text-lg font-semibold mt-4">Perceived Comfort</h3>
            <p>
              A subjective evaluation of comfort, for example obtained through user tests. 5-point Likert scale from
              very uncomfortable to very comfortable.
            </p>
          </TabsContent>

          <TabsContent value="disclaimer">
            <div className="p-4 border rounded-md bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">Disclaimer</h3>
              <p className="text-sm">
                This tool has been developed by researchers from Amsterdam University of Applied Sciences (AUAS) and
                industry partners in the MODLI project. MODLI is co-funded by the Taskforce for Applied Research SIA,
                part of the Dutch Research Council (NWO) RAAK.PUB11.024. The purpose of this tool is to provide
                information about the economic, environmental and social impact of different types of non-sterile
                isolation gowns that are used in healthcare settings and for general awareness raising purposes. The
                estimates provided by the tool are indicative and based on simplified assumptions and calculations. The
                AUAS does not guarantee the accuracy, reliability or completeness of the data included in the tool or
                for any conclusions or judgments based on using the tool and accepts no responsibility or liability
                neither for the use of the tool nor for any omissions or errors in the calculations or data.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
