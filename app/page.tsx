import { PatientForm } from "@/components/forms/PatientForm";
import { PasskeyModal } from "@/components/PasskeyModal";
import Image from "next/image";
import Link from "next/link";

interface SearchParamProps {
  searchParams: {
    admin?: string;
  };
}

const Home = async ({ searchParams }: SearchParamProps) => {
  const isAdmin = searchParams?.admin === "true";

  return (
    <div className="flex h-screen max-h-screen">
      {isAdmin && <PasskeyModal />}

      <section className="remove-scrollbar container mb-20">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          {/* <Image
            src="/assets/images/madilu_icon.jpg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-14 w-fit rounded"
          /> */}

          <PatientForm />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 CarePluse
            </p>
            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>

      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img w-1/2"
      />
    </div>
  );
};

export default Home;
