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
import { Cable, MicrochipIcon, Package, ShoppingCart } from "lucide-react";
import Footer from "@/components/Main/Footer";
import { createClient } from "@/utils/supabase/server";

const Page = async () => {
  const supabase = await createClient();
  let orderUrl = "";

  const { data } = await supabase
    .from("links")
    .select("link")
    .eq("name", "order")
    .maybeSingle();

  if (data?.link) {
    orderUrl = data.link;
  }

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
            <AccordionTrigger className="text-xl flex justify-center items-center gap-2 font-bold text-white">
              <div className="flex items-center gap-2"><MicrochipIcon className="w-6 h-6 text-primary" />
        ICs</div>
            </AccordionTrigger>
            <AccordionContent>
              <ICsList />
            </AccordionContent>
          </AccordionItem>

          {/* Lumps */}
          <AccordionItem value="lumps">
            <AccordionTrigger className="text-xl flex justify-center items-center gap-2 font-bold text-white">
              <div className="flex items-center gap-2"><Package className="w-8 h-8 mb-3 text-primary" /> Lump components</div>
            </AccordionTrigger>
            <AccordionContent>
              <LumpComponents />
            </AccordionContent>
          </AccordionItem>

          {/* Miscellaneous */}
          <AccordionItem value="misc">
            <AccordionTrigger className="text-xl flex justify-center items-center gap-2 font-bold text-white">
             <div className="flex items-center gap-2"><Cable className="w-8 h-8 mb-3 text-primary" /> Miscellaneous Components</div>
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
          className="bg-green-600 text-white px-6 py-4 text-md rounded-full shadow-lg hover:bg-blue-700 transition-all"
        >
          <a
            href={orderUrl || "https://forms.gle/JySv6V7AFwp4ZsSd6"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ShoppingCart className="w-5 h-5" /> Request
          </a>
        </Button>
      </div>
      <Footer />
    </>
  );
};

export default Page;
