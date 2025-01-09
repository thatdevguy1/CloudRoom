import { ArrowDownRight } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import LaptopModel from "../laptop-model/LaptopModel";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei";
import { Link } from "react-router";
import { useAuth } from "react-oidc-context";

const Hero1 = () => {
  const auth = useAuth();
  return (
    <section className="py-32 px-10">
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Badge variant="outline">
              New Release
              <ArrowDownRight className="ml-2 size-4" />
            </Badge>
            <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
              Welcome to CloudRoom
            </h1>
            <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">
              Not all data needs to be at your fingertips, but it all deserves a
              secure home. With CloudRoom, you can store your files affordably
              and reliably. Perfect for archiving the past while focusing on the
              future.
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              <Button
                onClick={() => auth.signinRedirect()}
                className="w-full sm:w-auto"
              >
                Sign Up Now
              </Button>
              <Link to="/pricing">
                <Button variant="outline" className="w-full sm:w-auto">
                  Checkout Our Plans
                  <ArrowDownRight className="ml-2 size-4" />
                </Button>
              </Link>
            </div>
          </div>
          <Canvas camera={{ position: [-5, 0, -15], fov: 65 }}>
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <Suspense fallback={null}>
              <group rotation={[0, Math.PI, 0]} position={[0, 1, 0]}>
                <LaptopModel />
              </group>
              <Environment preset="city" />
            </Suspense>
            <ContactShadows
              position={[0, -4.5, 0]}
              scale={20}
              blur={2}
              far={4.5}
            />
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              minPolarAngle={Math.PI / 2.2}
              maxPolarAngle={Math.PI / 2.2}
            />
          </Canvas>
        </div>
      </div>
    </section>
  );
};

export default Hero1;
