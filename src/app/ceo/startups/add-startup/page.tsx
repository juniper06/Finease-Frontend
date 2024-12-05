import { AddStartupForm } from "@/components/ceo/startup/add-form";
import { Separator } from "@/components/ui/separator";

export default async function AddStartupPage() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl w-full">
          New Startup
        </h1>
      </div>
      <Separator/>
      <h1 className="text-lg font-semibold md:text-xl w-full">Startup Information</h1>
      <AddStartupForm/>
    </>
  );
}
