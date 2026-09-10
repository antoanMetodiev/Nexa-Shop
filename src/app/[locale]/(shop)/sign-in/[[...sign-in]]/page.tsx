import { SignIn } from "@clerk/nextjs";
import { Container } from "@/components/ui/Container";

export default function SignInPage() {
  return (
    <div className="bg-white py-16">
      <Container>
        <div className="flex justify-center">
          <SignIn />
        </div>
      </Container>
    </div>
  );
}
