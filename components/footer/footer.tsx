import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, ChevronDown } from "lucide-react"




export default function Footer(){
return (
        <footer className="bg-footer-modli py-2 relative z-30 ">
                <div className="mx-auto px-4 md:px-6 mx-auto max-w-6xl">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <p className="max-w-[max] text-xs text-white">
                    This tool has been developed by researchers from Amsterdam University of Applied Sciences (AUAS) and
                    industry partners in the MODLI project. MODLI is co-funded by the Taskforce for Applied Research SIA, part
                    of the Dutch Research Council (NWO) RAAK.PUB11.024.
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                            <button className="rounded-full p-1 text-muted-foreground hover:bg-black hover:text-foreground focus:bg-white focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                <span className="sr-only">More information</span>
                                <Info className="h-4 w-4" />
                            </button>
                            </TooltipTrigger>
                            <TooltipContent className="whitespace-normal max-w-xs">
                                <p className="whitespace-normal">
                                The purpose of this tool is to provide information
                                about the economic, environmental and social impact of different types of non-sterile isolation gowns that
                                are used in healthcare settings and for general awareness raising purposes. The estimates provided by the
                                tool are indicative and based on simplified assumptions and calculations. The AUAS does not guarantee the
                                accuracy, reliability or completeness of the data included in the tool or for any conclusions or judgments
                                based on using the tool and accepts no responsibility or liability neither for the use of the tool nor for
                                any omissions or errors in the calculations or data.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                        </TooltipProvider>
                    </p>
                </div>
                </div>
            </footer>
    );
};