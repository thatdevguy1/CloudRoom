import Auth from "@/components/auth/Auth";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import InviteForm from "@/components/invite-form/InviteForm";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "react-router";
import { useAuth } from "react-oidc-context";
import Modal from "../modal/Modal";

const Header = () => {
  const auth = useAuth();
  return (
    <section className="p-4 border border-slate-200">
      <div className="nav container">
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <img src="cloudroom.png" className="h-12" alt="logo" />
            </div>
            <div className="flex items-center">
              <Link
                className={cn(
                  "text-muted-foreground",
                  navigationMenuTriggerStyle,
                  buttonVariants({
                    variant: "ghost",
                  })
                )}
                to="/"
              >
                Home
              </Link>
              <Link
                className={cn(
                  "text-muted-foreground",
                  navigationMenuTriggerStyle,
                  buttonVariants({
                    variant: "ghost",
                  })
                )}
                to="/pricing"
              >
                Pricing
              </Link>
              <Link
                className={cn(
                  "text-muted-foreground",
                  navigationMenuTriggerStyle,
                  buttonVariants({
                    variant: "ghost",
                  })
                )}
                to="/faq"
              >
                FAQ
              </Link>
              {auth.isAuthenticated && (
                <>
                  <Link
                    className={cn(
                      "text-muted-foreground",
                      navigationMenuTriggerStyle,
                      buttonVariants({
                        variant: "ghost",
                      })
                    )}
                    to="/dashboard"
                  >
                    Dashboard
                  </Link>
                  <Modal
                    message={<InviteForm />}
                    title="Please Enter Your Invite Key"
                  >
                    <Button>Claim Invite</Button>
                  </Modal>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Auth />
          </div>
        </nav>
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="cloudroom.png" className="h-12" alt="logo" />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex items-center gap-2">
                      <img src="cloudroom.png" className="h-12" alt="logo" />
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="mb-8 mt-8 flex flex-col gap-4">
                  <Link
                    className={cn(
                      "text-muted-foreground",
                      navigationMenuTriggerStyle,
                      buttonVariants({
                        variant: "ghost",
                      })
                    )}
                    to="/"
                  >
                    Home
                  </Link>
                  <Link
                    className={cn(
                      "text-muted-foreground",
                      navigationMenuTriggerStyle,
                      buttonVariants({
                        variant: "ghost",
                      })
                    )}
                    to="/pricing"
                  >
                    Pricing
                  </Link>
                  <Link
                    className={cn(
                      "text-muted-foreground",
                      navigationMenuTriggerStyle,
                      buttonVariants({
                        variant: "ghost",
                      })
                    )}
                    to="/faq"
                  >
                    FAQ
                  </Link>
                  {auth.isAuthenticated && (
                    <>
                      <Link
                        className={cn(
                          "text-muted-foreground",
                          navigationMenuTriggerStyle,
                          buttonVariants({
                            variant: "ghost",
                          })
                        )}
                        to="/dashboard"
                      >
                        Dashboard
                      </Link>
                    </>
                  )}
                </div>
                <div className="border-t pt-4">
                  <div className="mt-2 flex flex-row justify-between gap-3">
                    {auth.isAuthenticated && (
                      <Modal
                        message={<InviteForm />}
                        title="Please Enter Your Invite Key"
                      >
                        <Button>Claim Invite</Button>
                      </Modal>
                    )}
                    <Auth />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
