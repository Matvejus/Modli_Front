"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import EmissionsInfoModal from "@/components/modals/gown_detail"
import { CertificationModal } from "@/components/modals/CreateCertificate"
import { LikertScale } from "@/components/dashboard/Api/LikertScale"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import { EditCertificationModal } from "@/components/modals/EditCertificate"
import { Gown } from "@/app/interfaces/Gown"
import { Certificate } from "@/app/interfaces/Certificate"

interface GownDetailProps {
  params: {
    id: string
  }
}

// const AnimatedSwitch = ({
//   checked,
//   onCheckedChange,
// }: { checked: boolean; onCheckedChange: (checked: boolean) => void }) => (
//   <SwitchPrimitive.Root
//     checked={checked}
//     onCheckedChange={onCheckedChange}
//     className="w-[42px] h-[25px] bg-gray-200 rounded-full relative shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200 ease-in-out data-[state=checked]:bg-blue-500"
//   >
//     <SwitchPrimitive.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow-lg transform transition-transform duration-200 ease-in-out translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
//   </SwitchPrimitive.Root>
// )

export default function GownDetail({ params }: GownDetailProps) {
  const [gown, setGown] = useState<Gown | null>(null)
  const [allCertificates, setAllCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [hasChanges, setHasChanges] = useState(false)
  const { id } = params
  const router = useRouter()

  const fetchGownDetails = useCallback(async () => {
    try {
      setLoading(true);
      
      // Call your Next.js API route instead of Django directly
      const gownRes = await fetch(`/api/emissions/gowns/${id}`, {
        credentials: 'include'
      });
      
      if (!gownRes.ok) throw new Error("Failed to fetch gown details");
      const gownData = await gownRes.json();
      setGown(gownData);
      console.log(gownData)

      const certificatesRes = await fetch(`/api/emissions/certificates`, {
        credentials: 'include'
      });
      
      if (!certificatesRes.ok) throw new Error("Failed to fetch certificates");
      const certificatesData = await certificatesRes.json();
      setAllCertificates(certificatesData);
    } catch (error) {
      console.error("API error: ", error);
    } finally {
      setLoading(false);
    }
  }, [id]);


  
  useEffect(() => {
    if (id) {
      fetchGownDetails();
    }
  }, [id, fetchGownDetails]);

  useEffect(() => {
    if (gown && allCertificates.length > 0) {
      // Only update if certificates don't already have a checked property
      const needsUpdate = allCertificates.some(cert => cert.checked === undefined);
      
      if (needsUpdate && Array.isArray(gown.certificates)) {
        // Create a map of certificate IDs from gown.certificates for faster lookup
        const selectedCertIds = new Set(gown.certificates.map(cert => cert.id));
        
        // Update all certificates with checked property based on whether their ID is in the selected set
        setAllCertificates((prevCertificates) =>
          prevCertificates.map((cert) => ({
            ...cert,
            checked: selectedCertIds.has(cert.id)
          }))
        );
      }
    }
  }, [gown, allCertificates]);

  // console.log(allCertificates.map(cert => ({ name: cert.name, checked: cert.checked })));

  const handleInputChange = (field: keyof Gown, value: string | number | boolean) => {
    if (gown) {
      setGown({ ...gown, [field]: value })
      setHasChanges(true)
    }
  }

  const handleCertificateChange = (certificateId: number) => {
    setAllCertificates((prevCertificates) =>
      prevCertificates.map((cert) => (cert.id === certificateId ? { ...cert, checked: !cert.checked } : cert)),
    )
    setHasChanges(true)
  }

  const handleSave = async () => {
    if (!gown) return;

    const updatedData = {
      ...gown,
      certificates: allCertificates
        .filter((cert) => cert.checked)
        .map((cert) => ({
          id: cert.id,
          name: cert.name,
          description: cert.description,
        })),
    };

    console.log(updatedData)

    try {
      // Call your Next.js API route instead of Django directly
      const response = await fetch(`/api/emissions/gowns/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(updatedData),
      });
      console.log(updatedData)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to save gown details: ${JSON.stringify(errorData)}`);
      }

      await fetchGownDetails(); // Refetch the data after saving
      setHasChanges(false);
      // alert("Gown details saved successfully!");
    } catch (error) {
      console.error("Error saving gown details:", error);
      alert(`Failed to save gown details. Error: ${error}`);
    }
  };

  if (loading || !gown) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  
  return (
    <div className="container mx-auto p-4 text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{gown.name}</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {/* <Card>
          <CardHeader>
            <CardTitle>Reusable</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-sm font-medium">{gown.reusable ? 'Yes' : 'No'}</span>
            <AnimatedSwitch checked={gown.reusable} onCheckedChange={(checked) => handleInputChange('reusable', checked)} />
          </CardContent>
        </Card> */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase cost (€/gown)</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              value={gown.cost}
              onChange={(e) => handleInputChange("cost", Number.parseFloat(e.target.value))}
              prefix="$"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
          <div className="flex items-center space-x-2">
            <CardTitle>Waste cost (€/gown)</CardTitle>
            <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                        <span className="sr-only">More information</span>
                        <Info className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                      Please contact your waste management company about waste management costs for disposable gowns. 
                      If a value per kg is given, please multiply by 0.04 - the tool uses an average weight of 0.04 kg for disposable gowns.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
          </div>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              value={gown.waste_cost}
              onChange={(e) => handleInputChange("waste_cost", Number.parseFloat(e.target.value))}
              prefix="$"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
          <div className="flex items-center space-x-2">
            <CardTitle>Residual value (€/gown)</CardTitle>
            <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                        <span className="sr-only">More information</span>
                        <Info className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                      Please contact your recycler for more information about the monetary value of end-of-life gowns/materials.
                      If a value per kg is given, please multiply by 0.3 - the tool uses an average weight of 0.3 kg for reusable gowns.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
          </div>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              value={gown.residual_value}
              onChange={(e) => handleInputChange("residual_value", Number.parseFloat(e.target.value))}
              prefix="$"
            />
          </CardContent>
        </Card>
        {gown.reusable && (
          <Card>
            <CardHeader>
              <CardTitle>Laundry cost (€/gown/wash)</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                value={gown.laundry_cost}
                onChange={(e) => handleInputChange("laundry_cost", Number.parseFloat(e.target.value))}
                prefix="$"
              />
            </CardContent>
          </Card>
        )}
        {gown.reusable && (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CardTitle>Max. number of washes (expected)</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                        <span className="sr-only">More information</span>
                        <Info className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Your laundry/gown supplier will be able to advise you if you are unsure about the expected
                        maximum number of washes for a specific gown before it reaches end-of-life.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                value={gown.washes}
                onChange={(e) => handleInputChange("washes", Number.parseInt(e.target.value))}
              />
            </CardContent>
          </Card>
        )}
        {/* <Card>
          <CardHeader>
            <CardTitle>FTE local (Hours)</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              value={gown.fte_local}
              onChange={(e) => handleInputChange("fte_local", Number.parseFloat(e.target.value))}
              prefix="$"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>FTE local extra (Hours)</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              value={gown.fte_local_extra}
              onChange={(e) => handleInputChange("fte_local_extra", Number.parseFloat(e.target.value))}
              prefix="$"
            />
          </CardContent>
        </Card> */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CardTitle>Social Certifications</CardTitle>
              <CertificationModal />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                      <span className="sr-only">More information</span>
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Your laundry/gown supplier will be able to advise you if you are unsure if certifications are in
                      place for specific gowns.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {allCertificates.map((certificate) => (
                <div key={certificate.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`certificate-${certificate.id}`}
                    checked={certificate.checked}
                    onCheckedChange={() => handleCertificateChange(certificate.id)}
                  />
                  <label
                    htmlFor={`certificate-${certificate.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {certificate.name}
                  </label>
                  <EditCertificationModal
                    certificateId={certificate.id}
                    certificateName={certificate.name}
                    certificateDescription={certificate.description}
                    onUpdate={fetchGownDetails}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CardTitle>Perceived Comfort (optional)</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                      <span className="sr-only">More information</span>
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      If isolation gown user tests have been carried out at your healthcare organization you can include
                      these results here by selecting a perceived comfort score.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <LikertScale
              value={gown.comfort}
              onChange={(value) => handleInputChange("comfort", value)}
              name="comfort"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CardTitle>Perceived hygiene (optional)</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                      <span className="sr-only">More information</span>
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      If applicable you can add a perceived hygiene score here based on the advice of your infection
                      prevention team.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <LikertScale value={gown.hygine} onChange={(value) => handleInputChange("hygine", value)} name="hygiene" />
          </CardContent>
        </Card>
      </div>

      <Button onClick={hasChanges ? handleSave : () => router.push("/gowns")} className="mb-6">
        {hasChanges ? "Save Changes" : "Back"}
      </Button>

      {/* <h2 className="text-2xl font-semibold mb-4">Emissions</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Stage</TableHead>
              <TableHead className="whitespace-nowrap">Fibers</TableHead>
              <TableHead className="whitespace-nowrap">Yarn Production</TableHead>
              <TableHead className="whitespace-nowrap">Fabric Production</TableHead>
              <TableHead className="whitespace-nowrap">Finishing</TableHead>
              <TableHead className="whitespace-nowrap">Produciton</TableHead>
              <TableHead className="whitespace-nowrap">Transport</TableHead>
              <TableHead className="whitespace-nowrap">Use</TableHead>
              <TableHead className="whitespace-nowrap">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emissions.map((emission, index) => (
              <TableRow key={index}>
                <TableCell>
              {emission.emission_stage === 'CO2'
                ? `${emission.emission_stage} (KG)`
                : emission.emission_stage === 'Energy'
                ? `${emission.emission_stage} (MJ)`
                : emission.emission_stage === 'Water'
                ? `${emission.emission_stage} (L)`
                : emission.emission_stage === 'Cost'
                ? `${emission.emission_stage} (€)`
                : emission.emission_stage === 'Energy'}
                </TableCell>
                <TableCell>{emission.fibers.toFixed(2)}</TableCell>
                <TableCell>{emission.yarn_production.toFixed(2)}</TableCell>
                <TableCell>{emission.fabric_production.toFixed(2)}</TableCell>
                <TableCell>{emission.finishing.toFixed(2)}</TableCell>
                <TableCell>{emission.production.toFixed(2)}</TableCell>
                <TableCell>{emission.transport.toFixed(2)}</TableCell>
                <TableCell>{emission.use.toFixed(2)}</TableCell>
                <TableCell>{emission.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div> */}
    </div>
  )
}

