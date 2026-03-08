import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MarketingPageProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  sections: { title: string; text: string }[];
}

export default function MarketingPage({ eyebrow, title, subtitle, sections }: MarketingPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        {eyebrow && (
          <Badge variant="outline" className="mb-2">
            {eyebrow}
          </Badge>
        )}
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
        {sections.map((section, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline">{section.title}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{section.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
