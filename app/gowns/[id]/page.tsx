"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CertificationModal } from "@/components/modals/CreateCertificate"
import { LikertScale } from "@/components/dashboard/Api/LikertScale"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import { EditCertificationModal } from "@/components/modals/EditCertificate"
import type { Gown } from "@/app/interfaces/Gown"
import type { Certificate } from "@/app/interfaces/Certificate"

interface GownDetailProps {
  params: {
    id: string
  }
}

export default function GownDetail({ params }: GownDetailProps) {
  const [gown, setGown] = useState<Gown | null>(null)
  const [allCertificates, setAllCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [hasChanges, setHasChanges] = useState(false)
  const [shouldHyphenate, setShouldHyphenate] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const { id } = params
  const router = useRouter()

  const fetchGownDetails = useCallback(async () => {
    try {
      setLoading(true)

      // Call your Next.js API route instead of Django directly
      const gownRes = await fetch(`/api/emissions/gowns/${id}`, {
        credentials: "include",
      })

      if (!gownRes.ok) throw new Error("Failed to fetch gown details")
      const gownData = await gownRes.json()
      setGown(gownData)
      console.log(gownData)

      const certificatesRes = await fetch(`/api/emissions/certificates`, {
        credentials: "include",
      })

      if (!certificatesRes.ok) throw new Error("Failed to fetch certificates")
      const certificatesData = await certificatesRes.json()
      setAllCertificates(certificatesData)
    } catch (error) {
      console.error("API error: ", error)
    } finally {
      setLoading(false)
    }
  }, [id])

  // Check for overflow and determine if hyphenation is needed
  useEffect(() => {
    const checkOverflow = () => {
      if (headerRef.current) {
        const container = headerRef.current
        const containerWidth = container.offsetWidth
        const contentWidth = container.scrollWidth
        setShouldHyphenate(contentWidth > containerWidth)
      }
    }

    // Check on mount and resize
    checkOverflow()
    window.addEventListener("resize", checkOverflow)

    // Use ResizeObserver for more accurate detection
    if (headerRef.current && window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(checkOverflow)
      resizeObserver.observe(headerRef.current)

      return () => {
        window.removeEventListener("resize", checkOverflow)
        resizeObserver.disconnect()
      }
    }

    return () => window.removeEventListener("resize", checkOverflow)
  }, [gown, allCertificates])

  useEffect(() => {
    if (id) {
      fetchGownDetails()
    }
  }, [id, fetchGownDetails])

  useEffect(() => {
    if (gown && allCertificates.length > 0) {
      // Only update if certificates don't already have a checked property
      const needsUpdate = allCertificates.some((cert) => cert.checked === undefined)

      if (needsUpdate && Array.isArray(gown.certificates)) {
        // Create a map of certificate IDs from gown.certificates for faster lookup
        const selectedCertIds = new Set(gown.certificates.map((cert) => cert.id))

        // Update all certificates with checked property based on whether their ID is in the selected set
        setAllCertificates((prevCertificates) =>
          prevCertificates.map((cert) => ({
            ...cert,
            checked: selectedCertIds.has(cert.id),
          })),
        )
      }
    }
  }, [gown, allCertificates])

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
    if (!gown) return

    const updatedData = {
      ...gown,
      certificates: allCertificates
        .filter((cert) => cert.checked)
        .map((cert) => ({
          id: cert.id,
          name: cert.name,
          description: cert.description,
        })),
    }

    console.log(updatedData)

    try {
      // Call your Next.js API route instead of Django directly
      const response = await fetch(`/api/emissions/gowns/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedData),
      })

      console.log(updatedData)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to save gown details: ${JSON.stringify(errorData)}`)
      }

      await fetchGownDetails() // Refetch the data after saving
      setHasChanges(false)
      // alert("Gown details saved successfully!");
    } catch (error) {
      console.error("Error saving gown details:", error)
      alert(`Failed to save gown details. Error: ${error}`)
    }
  }

  if (loading || !gown) return <div className="flex justify-center items-center h-screen">Loading...</div>

  return (
    <div className="container mx-auto p-14 text-white relative z-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{gown.name}</h1>
      </div>

      {/* Main grid for most cards - keeping 3 columns even on smaller screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
                      {gown.reusable ? (
                        <p>
                          Please contact your waste management company about waste management costs for reusable gowns.
                          If a value per kg is given, please multiply by 0.3 - the tool uses an average weight of 0.3 kg
                          for reusable gowns
                        </p>
                      ) : (
                        <p>
                          Please contact your waste management company about waste management costs for disposable
                          gowns. If a value per kg is given, please multiply by 0.04 - the tool uses an average weight
                          of 0.04 kg for disposable gowns.
                        </p>
                      )}
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
                    {gown.reusable ? (
                      <p>
                        Please contact your recycler for more information about the monetary value of end-of-life
                        gowns/materials. If a value per kg is given, please multiply by 0.3 - the tool uses an average
                        weight of 0.3 kg for reusable gowns.
                      </p>
                    ) : (
                      <p>
                        Please contact your recycler for more information about the monetary value of end-of-life
                        gowns/materials. If a value per kg is given, please multiply by 0.04 - the tool uses an average
                        weight of 0.04 kg for disposable gowns.
                      </p>
                    )}
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
              <CardTitle>
                Laundry cost (€/gown/wash)
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
                        When leasing isolation gowns, enter the pay-per-use costs in this field and leave the purchase
                        cost field blank
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
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

        {gown.reusable && (
          <Card>
            <CardHeader>
              <div ref={headerRef} className="flex items-center justify-between overflow-hidden">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <CardTitle className="truncate">
                    {shouldHyphenate ? "Social Certi-fications" : "Social Certifications"}
                  </CardTitle>
                  <div className="flex items-center space-x-1 flex-shrink-0">
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
                            Your laundry/gown supplier will be able to advise you if you are unsure if certifications
                            are in place for specific gowns.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
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
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
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
        )}
      </div>

      {/* Separate grid for comfort and hygiene cards - each takes 50% width */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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
    </div>
  )
}
