import { BookOpen, Sparkles, Trophy } from 'lucide-react';
import Image from 'next/image';

interface AuthHeroProps {
  /** Tiêu đề đã được dịch sẵn (page là server component, truyền chuỗi vào) */
  title: string;
  /** Mô tả/tagline đã được dịch sẵn */
  description: string;
}

/**
 * Panel thương hiệu (cột trái) dùng chung cho trang login & register.
 * Presentational thuần: nhận sẵn chuỗi đã dịch, không tự gọi getTranslations.
 * Ẩn dưới breakpoint lg để mobile chỉ còn form.
 */
export default function AuthHero({ title, description }: AuthHeroProps) {
  return (
    <div className="bg-primary relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
      {/* Nền màu: gradient primary -> secondary + blob blur tĩnh tạo chiều sâu */}
      <div className="from-primary via-primary/85 to-secondary absolute inset-0 bg-gradient-to-br" />
      <div className="bg-secondary/40 absolute -top-24 -left-24 h-96 w-96 rounded-full blur-[120px]" />
      <div className="bg-primary/50 absolute -right-24 -bottom-24 h-96 w-96 rounded-full blur-[120px]" />

      {/* Icon decor tĩnh (gamified edutech) */}
      <Sparkles className="text-primary-foreground/15 absolute top-16 right-20 h-10 w-10" />
      <BookOpen className="text-primary-foreground/15 absolute bottom-32 left-16 h-12 w-12" />
      <Trophy className="text-primary-foreground/10 absolute top-1/2 right-12 h-14 w-14" />

      {/* Logo */}
      <div className="text-primary-foreground relative z-10 flex items-center gap-3">
        <Image src="/favicon-48x48.png" alt="Wordy Logo" width={48} height={48} priority />
        <span className="font-heading text-xl font-bold">Wordy</span>
      </div>

      {/* Khối trung tâm: ô đặt ảnh minh hoạ + tagline */}
      <div className="relative z-10 flex flex-1 flex-col justify-center gap-6 py-12">
        {/* Thay bằng illustration thật: đặt file vào public/ rồi đổi src của Image bên dưới */}
        <div className="border-primary-foreground/15 bg-primary-foreground/10 mb-2 flex aspect-[4/3] w-full max-w-sm items-center justify-center rounded-2xl border backdrop-blur-sm">
          <Image
            src="/favicon-180x180.png"
            alt="Wordy"
            width={120}
            height={120}
            className="opacity-90"
            priority
          />
        </div>

        <h2 className="text-primary-foreground font-heading text-3xl leading-tight font-bold tracking-tight xl:text-4xl">
          {title}
        </h2>
        <p className="text-primary-foreground/80 max-w-md text-base leading-relaxed">
          {description}
        </p>
      </div>

      {/* Dải decor dưới chân panel */}
      <div className="bg-primary-foreground/20 relative z-10 h-1 w-24 rounded-full" />
    </div>
  );
}
