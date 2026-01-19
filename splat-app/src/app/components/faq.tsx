"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqItems = [
  {
    question: "What types of images work best?",
    answer: "High-quality images with good lighting and clear subjects work best. Photos of places, objects, or memorable moments are ideal for 3D reconstruction.",
  },
  {
    question: "How long does it take to create a 3D scene?",
    answer: "Most images are processed in just a few seconds. Complex scenes may take slightly longer, but you'll have your interactive 3D scene within moments.",
  },
  {
    question: "Can I share my 3D scenes with others?",
    answer: "Yes! Every 3D scene you create comes with a unique shareable link. Anyone with the link can view, orbit, and zoom through your scene.",
  },
  {
    question: "Is my data secure?",
    answer: "Your privacy is important to us. Images are processed securely and your 3D scenes are only accessible via your unique links. No ads, no tracking.",
  },
]

export function FAQ() {
  return (
    <section className="bg-[#5a7f8c] py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-2">
          Timeless Mind FAQ
        </h2>
        <p className="text-white/80 mb-10">
          Everything you need to know for sharing your world.
        </p>
        
        <Accordion type="single" collapsible className="space-y-3">
          {faqItems.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-[#4a6a76]/50 rounded-lg border-none px-4"
            >
              <AccordionTrigger className="text-white hover:text-white/90 hover:no-underline py-4 text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-white/70 pb-4">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
