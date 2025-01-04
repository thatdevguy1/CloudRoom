import { Check } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

const Pricing4 = () => {
  const [isAnnually, setIsAnnually] = useState(false);
  return (
    <section className="py-32 flex flex-row justify-center">
      <div className="container">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-6">
          <h2 className="text-pretty text-4xl font-bold lg:text-6xl">
            Pricing
          </h2>
          <div className="flex flex-col justify-between gap-10 md:flex-row">
            <p className="max-w-screen-md text-muted-foreground lg:text-xl">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat
              odio, expedita neque ipsum pariatur suscipit!
            </p>
            <div className="flex h-11 w-fit shrink-0 items-center rounded-md bg-muted p-1 text-lg">
              <RadioGroup
                defaultValue="monthly"
                className="h-full grid-cols-2"
                onValueChange={(value) => {
                  setIsAnnually(value === "annually");
                }}
              >
                <div className='h-full rounded-md transition-all has-[button[data-state="checked"]]:bg-white'>
                  <RadioGroupItem
                    value="monthly"
                    id="monthly"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="monthly"
                    className="flex h-full cursor-pointer items-center justify-center px-7 font-semibold text-muted-foreground peer-data-[state=checked]:text-primary"
                  >
                    Monthly
                  </Label>
                </div>
                <div className='h-full rounded-md transition-all has-[button[data-state="checked"]]:bg-white'>
                  <RadioGroupItem
                    value="annually"
                    id="annually"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="annually"
                    className="flex h-full cursor-pointer items-center justify-center gap-1 px-7 font-semibold text-muted-foreground peer-data-[state=checked]:text-primary"
                  >
                    Yearly
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <div className="flex w-full flex-col items-stretch gap-6 md:flex-row">
            <div className="flex w-full flex-col rounded-lg border p-6 text-left">
              <Badge className="mb-8 block w-fit">FREE</Badge>
              <span className="text-4xl font-medium">$0</span>
              <p className="invisible text-muted-foreground">Per month</p>
              <Separator className="my-6" />
              <div className="flex flex-col justify-between gap-20">
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Unlimited Integrations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Windows, Linux, Mac support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>24/7 Support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Free updates</span>
                  </li>
                </ul>
                <Button className="w-full">Get Started for free</Button>
              </div>
            </div>
            <div className="flex w-full flex-col rounded-lg border p-6 text-left">
              <Badge className="mb-8 block w-fit">PRO</Badge>
              <span className="text-4xl font-medium">
                {isAnnually ? "$99" : "$9"}
              </span>
              <p className="text-muted-foreground">Per month</p>
              <Separator className="my-6" />
              <div className="flex h-full flex-col justify-between gap-20">
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Everything in FREE</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Live call suport every month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Unlimited Storage</span>
                  </li>
                </ul>
                <Button className="w-full">Upgrade to PRO</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing4;
