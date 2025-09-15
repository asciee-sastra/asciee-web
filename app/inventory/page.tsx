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
import { Button } from "@/components/ui/button"; // ✅ import button
import { ShoppingCart } from "lucide-react";

const Page = () => {
  return (
    <>
      <Navbar />
      <div className="mx-auto mt-24 px-4">
        <Accordion
          type="single"
          collapsible
          className="w-full space-y-4"
          defaultValue="mcus"
        >
          {/* MCUs */}
          <Mcus />
          <Sensors />

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

      {/* Floating Order Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          asChild
          className="bg-green-600 text-white w-16 h-16 rounded-full shadow-lg hover:bg-blue-700 transition-all"
        >
          <a
            href="https://forms.gle/JySv6V7AFwp4ZsSd6"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ShoppingCart  className="w-5 h-5"/>
          </a>
        </Button>
      </div>
    </>
  );
};

export default Page;
