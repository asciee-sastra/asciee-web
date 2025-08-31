'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'

type FAQItem = {
  id: string
  icon: IconName
  question: string
  answer: string
}

export default function FAQsThree() {
  const faqItems: FAQItem[] = [
    {
      id: 'item-1',
      icon: 'lightbulb',
      question: 'What is the main purpose of this association?',
      answer: `The association’s core mission is:
• To create a space where students can move beyond textbook learning  
• To focus on strengthening fundamentals through hands-on experiences.`,
    },
    {
      id: 'item-2',
      icon: 'user',
      question: 'Who can join the association?',
      answer: `• Any 2nd year student from SEEE with a curiosity for electronics or a passion for technology is welcome!  
• Whether you’re a beginner exploring new interests or someone with prior experience, this is the place to grow, learn, and collaborate.`,
    },
    {
      id: 'item-3',
      icon: 'book-open',
      question: 'Do I need prior technical knowledge to participate?',
      answer: `• Not necessarily.  
• While having a basic understanding of technical concepts is helpful, what really matters is your eagerness to learn.  
• Our sessions are designed to build on what you already know, challenge you to explore further, and equip you with both practical skills and creative problem-solving abilities.`,
    },
    {
      id: 'item-4',
      icon: 'calendar',
      question: 'What kind of events have been previously conducted?',
      answer: `Our association has hosted:  
• Diverse workshops like Intel FPGA, MATLAB, and MathWorks  
• Competitions such as Hack 'N' Spark, Logic Gate Olympics, and Circuit Building  
• Sessions on Wi-Fi and 5G, promoting hands-on learning and real-world insights  
Stay tuned for more!`,
    },
    {
      id: 'item-5',
      icon: 'user',
      question: 'Who conducts the workshops and sessions?',
      answer: `Most workshops and sessions are conducted by:  
• Experienced senior students of the club  
• Faculties  
• Experienced members of the industry`,
    },
    {
      id: 'item-6',
      icon: 'star',
      question: 'What are the benefits of joining the club?',
      answer: `You can gain:  
a) Hands-on skills in circuit design, and any topic that tickles your fancy  
b) Non-technical skills like teamwork, documentation, and event management are added advantages too!`,
    },
  ]

  return (
    <section className="pb-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          <div className="md:w-1/3">
            <div className="sticky top-20">
              <h2 className="mt-4 text-4xl text-white text-center font-bold">
                Frequently Asked Questions
              </h2>
            </div>
          </div>
          <div className="md:w-2/3">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="backdrop-blur-xl bg-foreground/70 text-white shadow-xs rounded-lg border px-4 last:border-b"
                >
                  <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="flex size-6">
                        <DynamicIcon name={item.icon} className="m-auto size-5" />
                      </div>
                      <span className="text-base">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <p className="text-base leading-relaxed whitespace-pre-line">
                      {item.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
