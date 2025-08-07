import MainLayout from "../../../components/MainLayout";

interface EmbedLayoutProps {
  children: React.ReactNode;
}
export default function EmbedLayout({ children }: EmbedLayoutProps) {
  return (
    <MainLayout
      navbar={false}
      toolbar={false}
      leftSidePanel={false}
      rightSidePanel={false}
      footer={false}
    >
      {children}
    </MainLayout>
  );
}
