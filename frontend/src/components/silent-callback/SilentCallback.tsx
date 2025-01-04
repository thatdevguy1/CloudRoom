import { Skeleton } from "../ui/skeleton";

function SilentCallback() {
  return (
    <>
      <div className="flex flex-row justify-around">
        <Skeleton className="w-[13vw] h-[90vh] rounded-lg " />
        <Skeleton className="w-[85vw] h-[90vh] rounded-lg " />
      </div>
    </>
  );
}

export default SilentCallback;
