import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return <main className="flex items-center justify-center ">
    <SignIn
      appearance={{
        variables: {
          colorPrimary: "#000000",
          colorBackground: "#ffffff",
          colorText: "#000000",
        },
      }}
    />
  </main>;

}