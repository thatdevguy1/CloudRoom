import {
  BarChartHorizontal,
  BatteryCharging,
  CircleHelp,
  Layers,
  WandSparkles,
  ZoomIn,
} from "lucide-react";

const reasons = [
  {
    title: "Quality",
    description:
      "We prioritize the safety and reliability of your files. Using AWS's secure infrastructure, we ensure that your data is protected, always available, and stored with the highest standards in the cloud industry.",
    icon: <ZoomIn className="size-6" />,
  },
  {
    title: "Experience",
    description:
      "A seamless and intuitive user interface designed to make cloud storage effortless. Enjoy a hassle-free experience with features that make managing your files simple and efficient.",
    icon: <BarChartHorizontal className="size-6" />,
  },
  {
    title: "Support",
    description:
      "Our dedicated support team is here for you 24/7. Whether you have questions or need assistance, we're just a click away to ensure you get the help you need, anytime.",
    icon: <CircleHelp className="size-6" />,
  },
  {
    title: "Innovation",
    description:
      "We continually push boundaries with cutting-edge features and tools, ensuring you stay ahead with the most advanced cloud storage solutions available.",
    icon: <WandSparkles className="size-6" />,
  },
  {
    title: "Results",
    description:
      "Our platform is designed to deliver consistent, reliable, and effective results. From fast uploads to secure downloads, we make your data management simple and productive.",
    icon: <Layers className="size-6" />,
  },
  {
    title: "Efficiency",
    description:
      "Save time and resources with our highly optimized cloud storage solutions. Quickly upload, access, and share your files with zero delays and maximum efficiency.",
    icon: <BatteryCharging className="size-6" />,
  },
];

const Feature = () => {
  return (
    <section className="py-32 px-10">
      <div className="container">
        <div className="mb-10 md:mb-20">
          <h2 className="mb-2 text-center text-3xl font-semibold lg:text-5xl">
            Why Store Your Files With Us?
          </h2>
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => (
            <div key={i} className="flex flex-col">
              <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-accent">
                {reason.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{reason.title}</h3>
              <p className="text-muted-foreground">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature;
