import { Theme, useTheme } from '~/components/function/theme/theme-provider';
import { Card, CardContent, CardTitle } from '../card/card';

export default function ThemeCard({ themeName }: { themeName: Theme }) {
  const { setTheme } = useTheme();
  
  return (
    <Card
      onClick={() => setTheme(themeName)}
      className={`${themeName} cursor-pointer overflow-hidden p-0`}
    >
      <div className="p-4" style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}>
        <CardTitle>{themeName}</CardTitle>
      </div>
      <div className="flex">
        <div className="h-8 w-1/4" style={{ backgroundColor: 'hsl(var(--primary))' }}></div>
        <div className="h-8 w-1/4" style={{ backgroundColor: 'hsl(var(--secondary))' }}></div>
        <div className="h-8 w-1/4" style={{ backgroundColor: 'hsl(var(--accent))' }}></div>
        <div className="h-8 w-1/4" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
      </div>
    </Card>
  );
}
