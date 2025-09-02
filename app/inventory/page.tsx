import ICsList from "@/components/inventory/Ics";
import Mcus from "@/components/inventory/Mcus";
import Sensors from "@/components/inventory/Sensors";
import Navbar from "@/components/Main/Navbar";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import LumpComponents from "@/components/inventory/lump";
import MiscComponents from "@/components/inventory/Misc";

const Page = () => {
  return (
    <>
      <Navbar />

      <div className=" mx-auto mt-24 px-4">
        <Accordion
          type="single"
          collapsible
          className="w-full space-y-4"
          defaultValue="mcus"
        >
          {/* MCUs */}
          <AccordionItem value="mcus">
            <AccordionTrigger className="text-xl font-bold text-white">
              Microcontrollers
            </AccordionTrigger>
            <AccordionContent>
              <Mcus />
            </AccordionContent>
          </AccordionItem>

          {/* Sensors */}
          <AccordionItem value="sensors">
            <AccordionTrigger className="text-xl font-bold text-white">
              Sensors
            </AccordionTrigger>
            <AccordionContent>
              <Sensors />
            </AccordionContent>
          </AccordionItem>

          {/* ICs */}
          <AccordionItem value="ics">
            <AccordionTrigger className="text-xl font-bold text-white">
              ICs
            </AccordionTrigger>
            <AccordionContent>
              <ICsList />
            </AccordionContent>
          </AccordionItem>

          {/* Lumps */}
          <AccordionItem value="lumps">
            <AccordionTrigger className="text-xl font-bold text-white">
              Lumps
            </AccordionTrigger>
            <AccordionContent>
              <LumpComponents />
            </AccordionContent>
          </AccordionItem>

          {/* Miscellaneous */}
          <AccordionItem value="misc">
            <AccordionTrigger className="text-xl font-bold text-white">
              Miscellaneous
            </AccordionTrigger>
            <AccordionContent>
              <MiscComponents />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

export default Page;
