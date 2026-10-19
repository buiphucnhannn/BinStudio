import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Ornament from "@/components/ui/Ornaments";

export default function NotFound() {
  return (
    <section className="relative flex screen items-center overflow-hidden bg-sand">
      <Ornament
        name="aperture"
        className="absolute -top-10 -right-10 w-72 animate-spin-slow text-ink/[0.06]"
      />
      <Container className="relative py-32 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 h-display text-[2.6rem] sm:text-[3.4rem]">
          Không tìm thấy trang · Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-ink-soft">
          Trang bạn tìm không tồn tại hoặc đã được di chuyển. The page you are looking for does not
          exist or has moved.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button href="/" arrow>
            Về trang chủ
          </Button>
          <Button href="/en" variant="outline">
            English home
          </Button>
        </div>
      </Container>
    </section>
  );
}
