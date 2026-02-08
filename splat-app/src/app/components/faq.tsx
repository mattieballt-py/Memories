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
  {
    question: "Who made this masterpiece?",
    answer: "Made for fun, as a test of current gaussian splat capabilities, Mattie Ball made this with the support and development from early users. Thank you!",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="bg-[#759AAD] py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-2">
          Timeless Mind FAQ
        </h2>
        <p className="text-white/80 mb-10">
          Everything you need to know for sharing your world.
        </p>

        <Accordion type="single" collapsible className="space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg px-6 overflow-hidden"
            >
              <AccordionTrigger className="text-white/95 hover:text-white hover:no-underline py-5 text-left font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-white/80 pb-5 pt-1 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
