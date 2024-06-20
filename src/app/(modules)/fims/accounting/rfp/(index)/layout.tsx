import { TitleCard } from "@/components/cards/title";

const title = "Request For Payment";

export const metadata = {
  title,
};

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex flex-col gap-6 py-8">
      <TitleCard title={title} />
      {children}
    </div>
  );
}
