import { Card, CardHeader } from "@/components/ui/card";

interface TitleCardProps {
  title: React.ReactNode;
  children?: React.ReactNode;
}

export function TitleCard({ title, children = "" }: TitleCardProps) {
  return (
    <>
      <Card className="shadow-lg print:hidden">
        <CardHeader className="py-6">
          <div className="flex flex-col items-center gap-2 font-semibold text-[#3A3A3A] text-lg lg:flex-row lg:justify-between lg:gap-0 lg:text-xl">
            <span className="flex w-fit justify-center lg:justify-start">
              {title}
            </span>
            {children ? (
              <span className="flex w-full justify-end lg:w-fit">
                {children}
              </span>
            ) : null}
          </div>
        </CardHeader>
      </Card>
    </>
  );
}
