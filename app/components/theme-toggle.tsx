import { Moon, Sun, Monitor } from "lucide-react";
import { useFetcher } from "react-router";
import { useColorScheme } from "~/hooks/use-color-scheme";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

export function ThemeToggle() {
  const fetcher = useFetcher();
  const { colorScheme } = useColorScheme();

  const handleSubmit = (value: string) => {
    fetcher.submit(
      { "color-scheme": value },
      {
        method: "post",
        action: "/api/theme",
      }
    );
  };

  return (
    <div>
      <Tabs defaultValue={colorScheme} onValueChange={handleSubmit}>
        <TabsList className="">
          <TabsTrigger value="light">
            <Sun />
          </TabsTrigger>
          <TabsTrigger value="dark">
            <Moon />
          </TabsTrigger>
          <TabsTrigger value="system">
            <Monitor />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
