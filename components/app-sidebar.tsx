"use client";
import {
  CreditCardIcon,
  FolderOpenIcon,
  HistoryIcon,
  KeyIcon,
  LogOutIcon,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscriptions";

const menuItems = [
  {
    title: "Home",
    items: [
      {
        title: "Workflows",
        icon: FolderOpenIcon,
        url: "/workflows",
      },
      {
        title: "Credentials",
        icon: KeyIcon,
        url: "/credentials",
      },
      {
        title: "Executions",
        icon: HistoryIcon,
        url: "/executions",
      },
    ],
  },
];

export default function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (url: string) => pathname === url;

  const { hasActiveSubscription, isLoading } = useHasActiveSubscription();

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className='gap-x-4 h-10 px-4'>
            <Link href='/' prefetch>
              <Image src='/logos/logo.svg' alt='Aivium' width={32} height={32} />
              <span className='font-semibold text-sm'>Aivium</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive(item.url)}
                      className='gap-x-4 h-10 px-4'
                    >
                      <Link href={item.url} prefetch>
                        <item.icon className='size-4' />
                        <span className='truncate'>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {!hasActiveSubscription && !isLoading && (
            <SidebarMenuItem>
              <SidebarMenuButton
                className='gap-x-4 h-10 px-4'
                tooltip={"Upgrade to Pro"}
                onClick={() => authClient.checkout({ slug: "aivium-pro" })}
              >
                <StarIcon className='size-4' />
                <span className='truncate'>Upgrade to Pro</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton
              className='gap-x-4 h-10 px-4'
              tooltip={"Billing Portal"}
              onClick={() => authClient.customer.portal()}
            >
              <CreditCardIcon className='size-4' />
              <span className='truncate'>Billing Portal</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              className='gap-x-4 h-10 px-4'
              tooltip={"Sign Out"}
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/login");
                    },
                  },
                })
              }
            >
              <LogOutIcon className='size-4' />
              <span className='truncate'>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
