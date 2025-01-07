import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Faq = () => {
  const faqs = [
    {
      question: "What is CloudRoom?",
      answer:
        "CloudRoom is a secure and cost-effective cloud storage solution designed to store and manage your infrequently accessed files with ease.",
    },
    {
      question: "How secure is my data on CloudRoom?",
      answer:
        "Your data is encrypted both at rest and in transit, and we utilize AWS's robust infrastructure to ensure the highest levels of security and reliability.",
    },
    {
      question: "What file types can I store on CloudRoom?",
      answer:
        "You can store a wide variety of file types, including documents, images, videos, and more. If you encounter any restrictions, feel free to contact our support team.",
    },
    {
      question: "Is there a limit to how much data I can store?",
      answer:
        "CloudRoom offers flexible subscription plans to fit your needs. Whether you need 100GB or 500GB of storage, we’ve got you covered.",
    },
    {
      question: "Can I access my files from any device?",
      answer:
        "Yes! CloudRoom is accessible from any device with an internet connection, ensuring you can retrieve your files whenever and wherever you need them.",
    },
    {
      question: "What happens if I exceed my storage limit?",
      answer:
        "If you exceed your storage limit, you can upgrade your subscription plan at any time to add more space to your account.",
    },
    {
      question: "Does CloudRoom support team collaboration?",
      answer:
        "We currently focus on individual storage, but team collaboration features are planned for future updates. Stay tuned!",
    },
    {
      question: "How do I contact support if I have an issue?",
      answer:
        "Our support team is available 24/7 to assist you. You can contact us via live chat, email, or the help section in your dashboard.",
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer:
        "Yes, you can cancel your subscription at any time from your account settings. Your files will remain accessible until the end of your billing cycle.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards and debit cards. Additional payment methods such as PayPal may be supported in the future.",
    },
  ];

  return (
    <section className="pt-32 w-full flex flex-row justify-center px-10">
      <div className="container">
        <h1 className="mb-4 text-3xl font-semibold md:mb-11 md:text-5xl">
          Frequently asked questions
        </h1>
        {faqs.map((faq, index) => (
          <Accordion key={index} type="single" collapsible>
            <AccordionItem value={`item-${index}`}>
              <AccordionTrigger className="hover:text-foreground/60 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </section>
  );
};

export default Faq;
