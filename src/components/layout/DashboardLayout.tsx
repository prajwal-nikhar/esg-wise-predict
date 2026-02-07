 import { ReactNode, useState } from 'react';
 import { Link, useLocation, useNavigate } from 'react-router-dom';
 import { useAuth } from '@/contexts/AuthContext';
 import { Button } from '@/components/ui/button';
 import { Avatar, AvatarFallback } from '@/components/ui/avatar';
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
 } from '@/components/ui/dropdown-menu';
 import {
   Leaf,
   LayoutDashboard,
   FileQuestion,
   BarChart3,
   TrendingUp,
   Search,
   GitCompare,
   Star,
   LogOut,
   User,
   Menu,
   X,
 } from 'lucide-react';
 import { cn } from '@/lib/utils';
import EsgNewsSlider from '@/components/esg/EsgNewsSlider';
 
 interface DashboardLayoutProps {
   children: ReactNode;
 }
 
 const companyNavItems = [
   { href: '/company/dashboard', label: 'Dashboard', icon: LayoutDashboard },
   { href: '/company/questionnaire', label: 'Questionnaire', icon: FileQuestion },
   { href: '/company/scores', label: 'My Scores', icon: BarChart3 },
   { href: '/company/predictions', label: 'Predictions', icon: TrendingUp },
 ];
 
 const investorNavItems = [
   { href: '/investor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
   { href: '/investor/browse', label: 'Browse Companies', icon: Search },
   { href: '/investor/compare', label: 'Compare', icon: GitCompare },
   { href: '/investor/watchlist', label: 'Watchlist', icon: Star },
 ];
 
 export function DashboardLayout({ children }: DashboardLayoutProps) {
   const { profile, role, signOut } = useAuth();
   const location = useLocation();
   const navigate = useNavigate();
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 
   const navItems = role === 'company' ? companyNavItems : investorNavItems;
 
   const handleSignOut = async () => {
     await signOut();
     navigate('/login');
   };
 
   const initials = profile?.full_name
     ?.split(' ')
     .map((n) => n[0])
     .join('')
     .toUpperCase() || 'U';
 
   return (
     <div className="min-h-screen bg-esg-light dark:bg-esg-dark bg-cover bg-center">
       {/* Header */}
       <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
         <div className="container flex h-16 items-center justify-between px-4">
           <div className="flex items-center gap-4">
             <Button
               variant="ghost"
               size="icon"
               className="md:hidden"
               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
             >
               {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
             </Button>
             <Link to="/" className="flex items-center gap-2">
               <Leaf className="h-6 w-6 text-primary" />
               <span className="font-bold text-lg hidden sm:inline">ESG Platform</span>
             </Link>
           </div>
 
           {/* Desktop Navigation */}
           <nav className="hidden md:flex items-center gap-1">
             {navItems.map((item) => (
               <Link key={item.href} to={item.href}>
                 <Button
                   variant={location.pathname === item.href ? 'secondary' : 'ghost'}
                   size="sm"
                   className="gap-2"
                 >
                   <item.icon className="h-4 w-4" />
                   {item.label}
                 </Button>
               </Link>
             ))}
           </nav>
 
           <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="gap-2">
                 <Avatar className="h-8 w-8">
                   <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                     {initials}
                   </AvatarFallback>
                 </Avatar>
                 <span className="hidden sm:inline">{profile?.full_name}</span>
               </Button>
             </DropdownMenuTrigger>
             <DropdownMenuContent align="end">
               <DropdownMenuItem className="gap-2">
                 <User className="h-4 w-4" />
                 Profile
               </DropdownMenuItem>
               <DropdownMenuSeparator />
               <DropdownMenuItem onClick={handleSignOut} className="gap-2 text-destructive">
                 <LogOut className="h-4 w-4" />
                 Sign out
               </DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>
         </div>
 
         {/* Mobile Navigation */}
         {mobileMenuOpen && (
           <nav className="md:hidden border-t p-4 space-y-1 bg-card/80 backdrop-blur-sm">
             {navItems.map((item) => (
               <Link
                 key={item.href}
                 to={item.href}
                 onClick={() => setMobileMenuOpen(false)}
               >
                 <Button
                   variant={location.pathname === item.href ? 'secondary' : 'ghost'}
                   className="w-full justify-start gap-2"
                 >
                   <item.icon className="h-4 w-4" />
                   {item.label}
                 </Button>
               </Link>
             ))}
           </nav>
         )}
       </header>
 
       {/* Main Content */}
       <main className="container px-4 py-6">{children}</main>

       {/* Footer */}
       <footer className="border-t bg-background/50">
        <EsgNewsSlider />
       </footer>
     </div>
   );
 }