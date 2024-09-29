import Layout from "@/components/Navbar";

export default function layout({ children }: { children: React.ReactNode }) {
	return (
		<Layout>
			{children}
		</Layout>
	);
}