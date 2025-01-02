import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

function AppSideBar() {
  return (
    <Sidebar className="w-64 bg-gray-900 text-white">
      <SidebarContent>
        <SidebarGroupLabel className="text-2xl font-bold">
          CloudRoom
        </SidebarGroupLabel>
        <SidebarGroupContent title="Main">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <a className="text-black">Dashboard</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuButton>
              <a className="text-black">Files</a>
            </SidebarMenuButton>

            <SidebarMenuButton>
              <a className="text-black">Settings</a>
            </SidebarMenuButton>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSideBar;
