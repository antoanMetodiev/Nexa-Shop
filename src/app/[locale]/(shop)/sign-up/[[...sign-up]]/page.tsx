import { SignUp } from "@clerk/nextjs";
import { Container } from "@/components/ui/Container";

export default function SignUpPage() {
  return (
    <div className="bg-white py-16">
      <Container>
        <div className="flex justify-center">
          <SignUp />
        </div>
      </Container>
    </div>
  );
}
